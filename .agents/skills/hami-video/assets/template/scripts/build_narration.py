#!/usr/bin/env python3
"""Generate per-scene narration (Kokoro TTS) for both locales, measure durations,
and emit src/timing.generated.json so scene lengths match the voiceover.

Prereqs: pip install --user --break-system-packages kokoro-onnx soundfile
         brew install espeak-ng
Models are cached by `npx hyperframes tts` under ~/.cache/hyperframes/tts/.

Usage:
  python3 scripts/build_narration.py            # synth + write timing
  python3 scripts/build_narration.py --dry      # timing only (needs existing wavs)
"""
import argparse
import json
import math
import os
import subprocess
import sys
import wave

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
AUDIO = os.path.join(ROOT, "public", "audio")
FPS = 30

SCENES = [
    "intro",
    "stats",
    "remoteGpu",
    "amd",
    "ascend",
    "numa",
    "more",
    "upgrade",
    "outro",
]

# padding (s) added after narration ends, per scene
PAD = {
    "intro": 1.0,
    "stats": 0.8,
    "remoteGpu": 0.8,
    "amd": 0.8,
    "ascend": 0.8,
    "numa": 0.8,
    "more": 0.9,
    "upgrade": 1.0,
    "outro": 1.4,
}

# minimum scene length (frames) so on-screen animations can finish
MIN_FRAMES = {
    "intro": 115,
    "stats": 175,
    "remoteGpu": 235,
    "amd": 220,
    "ascend": 220,
    "numa": 220,
    "more": 245,
    "upgrade": 205,
    "outro": 155,
}

# TTS-friendly copy: full-width punctuation, phonetic Chinese for terms
# (哈密=HAMi, 英伟达=NVIDIA, 二点一一零=v2.11.0). On-screen text in
# src/content.ts keeps the real English spelling.
#
# Engines:
#   zh -> Azure Speech (paid-tier voices via video/.azure-speech.json; user picked
#         Harper MAI-Voice-2.1-Flash + narrator style for the documentary feel)
#   en -> Kokoro via hyperframes CLI (local, native-quality English)
NARRATION = {
    "zh": {
        "engine": "azure",
        # Multilingual voice: native Putonghua + fluent English terms
        # (GPU/CUDA/vLLM/Helm). User picked Xiaochen from the multilingual
        # pack (out/voice-samples-multilingual/) after rejecting Harper MAI
        # (zh-only voice — English terms sounded broken mid-sentence).
        "voice": "zh-CN-XiaochenMultilingualNeural",
        # 断句优化:commas in TTS text each cause an audible pause, so copy uses
        # long flowing clauses (fewer ,) to avoid choppy delivery.
        "rate": "+8%",
        "speed": 1.0,
        "text": {
            "intro": "哈密二点一一零版本正式发布。作为云原生计算基金会的孵化项目,哈密是云原生的GPU虚拟化中间件。",
            "stats": "这个版本合并了两百二十多个PR,来自五十多位贡献者,其中二十九位是首次参与。",
            "remoteGpu": "远程GPU让没有显卡也没有驱动的节点通过网络运行CUDA和vLLM,算力随需而至。",
            "amd": "AMD显卡成为一等公民,显存与算力隔离全部在容器级强制执行,与英伟达同一调度层。",
            "ascend": "昇腾新增第三种切分模式ENPU,三种隔离策略灵活组合互不干扰。",
            "numa": "NUMA对齐让CPU与GPU的调度终于一致,工作负载落在同一个NUMA节点。",
            "more": "还有更多。动态MIG支持CDI,调度器全面加固,并支持OpenShift与集群自动扩缩容,官网也全新改版。",
            "upgrade": "一条Helm命令即可升级到二点一一零版本,详见发布说明与升级指南。",
            "outro": "欢迎到 GitHub 给 HAMi 点个 Star!也可以扫码添加社区小助手的微信,加入哈密社区!",
        },
    },
    "en": {
        "engine": "kokoro",
        "voice": "af_sky",
        "speed": 1.0,
        "text": {
            "intro": "HAMi v2.11.0 is officially released — a CNCF Incubating project for cloud-native GPU virtualization.",
            "stats": "This release merges more than 220 pull requests from over 50 contributors — 29 of them first-timers.",
            "remoteGpu": "Remote GPU runs CUDA and vLLM on nodes with no GPU and no driver. Compute, served over the network.",
            "amd": "AMD GPUs are now first-class citizens — memory and compute isolation, enforced inside the container, behind the same scheduler as NVIDIA.",
            "ascend": "Ascend gets a third partitioning mode, ENPU, with three isolation policies that never interfere.",
            "numa": "NUMA refit aligns CPU and GPU scheduling, so workloads land on the same NUMA node.",
            "more": "And more: dynamic MIG with CDI, a hardened scheduler, OpenShift and Cluster Autoscaler support, and a brand-new website.",
            "upgrade": "Upgrade to v2.11.0 with a single Helm command. See the release notes and the upgrade guide.",
            "outro": "If you find HAMi useful, give the project a star on GitHub — and visit project-hami.io to learn more!",
        },
    },
}


def synth_all():
    """Synthesize per locale: zh via edge-tts (Microsoft, standard Mandarin,
    network required), en via the hyperframes CLI (local Kokoro)."""
    import tempfile

    for locale, conf in NARRATION.items():
        outdir = os.path.join(AUDIO, f"narration-{locale}")
        os.makedirs(outdir, exist_ok=True)
        for i, scene in enumerate(SCENES):
            out = os.path.join(outdir, f"scene-{i}.wav")
            with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False, encoding="utf-8") as tf:
                tf.write(conf["text"][scene])
                txt = tf.name
            try:
                if conf["engine"] == "azure":
                    # Azure Speech REST via scripts/azure_tts.py — outputs wav directly
                    sys.path.insert(0, HERE)
                    from azure_tts import synthesize
                    synthesize(
                        conf["text"][scene], conf["voice"], out,
                        style=conf.get("style"), styledegree=conf.get("styledegree"),
                        rate=conf.get("rate"), pitch=conf.get("pitch"),
                    )
                elif conf["engine"] == "edge":
                    # edge-tts writes mp3; convert to wav for duration + Remotion
                    mp3 = out.replace(".wav", ".mp3")
                    cmd = [sys.executable, "-m", "edge_tts", "--voice", conf["voice"]]
                    if conf.get("rate"):
                        cmd += [f"--rate={conf['rate']}"]  # "=" form: value starts with '-'
                    if conf.get("pitch"):
                        cmd += [f"--pitch={conf['pitch']}"]
                    cmd += ["--file", txt, "--write-media", mp3]
                    res = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=300)
                    if res.returncode != 0:
                        sys.exit(f"edge-tts failed for [{locale}] {scene}:\n{res.stdout[-800:]}\n{res.stderr[-800:]}")
                    res = subprocess.run(
                        ["npx", "remotion", "ffmpeg", "-y", "-i", mp3, out],
                        cwd=ROOT, capture_output=True, text=True, timeout=300,
                    )
                    if res.returncode != 0:
                        sys.exit(f"ffmpeg conversion failed for [{locale}] {scene}:\n{res.stderr[-800:]}")
                    os.unlink(mp3)
                else:
                    res = subprocess.run(
                        ["npx", "hyperframes", "tts", txt, "--voice", conf["voice"],
                         "--speed", str(conf["speed"]), "--output", out],
                        cwd=ROOT, capture_output=True, text=True, timeout=600,
                    )
                    if res.returncode != 0:
                        sys.exit(f"tts failed for [{locale}] {scene}:\n{res.stdout[-800:]}\n{res.stderr[-800:]}")
            finally:
                os.unlink(txt)
            print(f"[{locale}] {scene}: {wav_duration(out):.2f}s -> {out}")


def wav_duration(path):
    with wave.open(path, "rb") as w:
        return w.getnframes() / w.getframerate()


def write_timing():
    timing = {}
    for locale in NARRATION:
        outdir = os.path.join(AUDIO, f"narration-{locale}")
        frames = {}
        for i, scene in enumerate(SCENES):
            wav = os.path.join(outdir, f"scene-{i}.wav")
            dur = wav_duration(wav)
            f = max(math.ceil((dur + PAD[scene]) * FPS), MIN_FRAMES[scene])
            frames[scene] = f
        timing[locale] = frames
        total = sum(frames.values())
        print(f"[{locale}] total {total} frames = {total / FPS:.2f}s")
    out = os.path.join(ROOT, "src", "timing.generated.json")
    with open(out, "w") as f:
        json.dump(timing, f, indent=2)
    print("wrote", out)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true", help="skip synthesis, only measure + write timing")
    args = ap.parse_args()
    if not args.dry:
        synth_all()
    write_timing()
