#!/usr/bin/env python3
"""Build burned-in caption tracks (per-locale, per-scene phrase timings).

Reads:
  - scripts/build_narration.py (NARRATION texts; en used as-is)
  - public/audio/narration-<locale>/scene-*.wav (exact narration durations)
  - src/timing.generated.json (scene lengths, for clamping)
Writes src/captions.generated.json:
  { "zh": { "intro": [{"t": "...", "f0": 0, "f1": 87}, ...], ... }, "en": {...} }

zh caption text uses REAL spellings (HAMi, v2.11.0, CUDA) while the spoken
TTS text uses phonetic Chinese (哈密, 二点一一零) — captions transcribe meaning.
Timing is proportional to weighted phrase length (CJK char=1, latin word=2);
within a 6-10s scene drift stays well under ~0.3s.
"""
import json
import os
import re
import sys
import wave

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
FPS = 30
LEAD_S = 0.10  # caption appears slightly before its speech (relative to scene)

sys.path.insert(0, HERE)
from build_narration import NARRATION, SCENES  # noqa: E402

# zh captions: real spellings, richer punctuation (captions are read, not spoken)
ZH_CAPTIONS = {
    "intro": "HAMi v2.11.0 正式发布。作为云原生计算基金会 CNCF 的孵化项目,HAMi 是云原生的 GPU 虚拟化中间件。",
    "stats": "本版本合并 220+ 个 PR,来自 50+ 位贡献者,其中 29 位是首次参与。",
    "remoteGpu": "远程 GPU:没有显卡、也没有驱动的节点,通过网络运行 CUDA 和 vLLM,算力随需而至。",
    "amd": "AMD 显卡成为一等公民。显存与算力隔离,全部在容器级强制执行,与 NVIDIA 共用同一调度层。",
    "ascend": "昇腾新增第三种切分模式 ENPU,三种隔离策略灵活组合、互不干扰。",
    "numa": "NUMA 对齐:CPU 与 GPU 的调度终于一致,工作负载落在同一个 NUMA 节点。",
    "more": "还有更多:动态 MIG 支持 CDI,调度器全面加固,支持 OpenShift 与集群自动扩缩容,官网也全新改版。",
    "upgrade": "一条 Helm 命令,即可升级到 v2.11.0。详见发布说明与升级指南。",
    "outro": "欢迎到 GitHub 给 HAMi 点个 Star!也可扫码添加社区小助手微信,加入 HAMi 社区!",
}

# phrase soft-break preference (longer prefix first)
SOFT_BREAKS = ["、", ",", ":", ";", "，", "、"]
HARD_SPLIT_TARGET = 16  # weighted units per caption line (zh)
HARD_SPLIT_MAX = 21
EN_TARGET = 46          # latin chars per caption line (en)
EN_MAX = 58


def _protect(text: str) -> str:
    """Hide dots inside version numbers (v2.11.0) and domains (project-hami.io) from the split."""
    text = re.sub(r"(?<=\d)\.(?=\d)", "\x01", text)
    return re.sub(r"(?<=[A-Za-z0-9])\.(?=[A-Za-z0-9])", "\x01", text)


def _restore(text: str) -> str:
    return text.replace("\x01", ".")


def weight(text: str) -> float:
    """CJK char = 1, latin word = 2."""
    w = 0.0
    for tok in re.findall(r"[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]|[A-Za-z0-9+.#-]+", text):
        w += 1.0 if len(tok) == 1 and ord(tok[0]) > 0x2E80 else 2.0
    return w


def split_zh(text: str) -> list[str]:
    """Split into caption phrases <= HARD_SPLIT_MAX weighted units."""
    text = _protect(text)
    # 1) split on sentence/statement punctuation (kept out of the phrase)
    parts = [p.strip() for p in re.split(r"[。!?;,.:、—…]+", text) if p.strip()]
    out = []
    for p in parts:
        if weight(p) <= HARD_SPLIT_MAX:
            out.append(p)
            continue
        # 2) hard-split long clause near the target weight
        while weight(p) > HARD_SPLIT_MAX:
            chars = list(p)
            acc, cut = 0.0, None
            for i, ch in enumerate(chars):
                acc += 1.0 if ord(ch) > 0x2E80 else 0.5  # latin char = 0.5 (~2/word)
                if acc >= HARD_SPLIT_TARGET:
                    cut = i + 1
                    break
            if cut is None or cut >= len(chars) - 2:
                break
            out.append("".join(chars[:cut]))
            p = "".join(chars[cut:]).lstrip()
        if p:
            out.append(p)
    # merge tiny fragments (< 4 weighted) into previous
    merged: list[str] = []
    for ph in out:
        if merged and weight(ph) < 4:
            merged[-1] += "、" + ph
        else:
            merged.append(ph)
    return [_restore(m) for m in merged]


def split_en(text: str) -> list[str]:
    parts = [p.strip() for p in re.split(r"[.!?;,:—]+", _protect(text)) if p.strip()]
    out = []
    for p in parts:
        while len(p) > EN_MAX:
            words = p.split(" ")
            cut, acc = None, 0
            for i, w in enumerate(words):
                acc += len(w) + 1
                if acc >= EN_TARGET:
                    cut = i + 1
                    break
            if not cut or cut >= len(words):
                break
            out.append(" ".join(words[:cut]))
            p = " ".join(words[cut:])
        if p:
            out.append(p)
    # merge too-short fragments into the NEXT phrase when possible (they are
    # trailing words of a cut clause, e.g. "with no" + "GPU and no driver")
    merged: list[str] = []
    for ph in reversed(out):
        if merged and len(ph) < 14 and len(merged[0]) + len(ph) + 1 <= EN_MAX:
            merged[0] = ph + " " + merged[0]
        else:
            merged.insert(0, ph)
    return [_restore(m) for m in merged]


def wav_duration(path: str) -> float:
    with wave.open(path, "rb") as w:
        return w.getnframes() / w.getframerate()


# Vertical pill: fontSize zh 33 / en 29, text area = 856 - 2*30 padding = 796px.
# Captions must NEVER wrap (user rule) — over-wide entries are split in two.
VERT_FS = {"zh": 33, "en": 29}
VERT_MAX_PX = 780  # safety margin under 796


def est_px(text: str, locale: str) -> float:
    w = 0.0
    for ch in text:
        if ch == " ":
            w += 0.30
        elif re.match(r"[\u3000-\u9fff\uff00-\uffef\u2014\u2026]", ch):
            w += 1.0
        elif ch.isupper() or ch.isdigit():
            w += 0.62
        else:
            w += 0.52
    return w * VERT_FS[locale]


def fit_vertical(entries: list[dict], locale: str) -> list[dict]:
    """Split any entry wider than the vertical pill into two single-line captions."""
    out = []
    for e in entries:
        t = e["t"]
        if est_px(t, locale) <= VERT_MAX_PX:
            out.append(e)
            continue
        # best split point: prefer 、，,；; — else space — else CJK midpoint
        cut = max(t.rfind("、", 0, len(t) // 2 + 4), t.rfind("，", 0, len(t) // 2 + 4),
                  t.rfind(",", 0, len(t) // 2 + 4), t.rfind(" ", 0, len(t) // 2 + 4))
        if cut < len(t) // 4:
            cut = len(t) // 2
        a, b = t[:cut].strip(" 、,，"), t[cut:].strip(" 、,，")
        if not a or not b:
            out.append(e)  # cannot split; the renderer's font-scale net handles it
            continue
        wa, wb = weight(a), weight(b)
        dur = e["f1"] - e["f0"]
        mid = e["f0"] + max(8, round(dur * wa / (wa + wb)))
        out.append({"t": a, "f0": e["f0"], "f1": min(mid, e["f1"] - 8)})
        out.append({"t": b, "f0": min(mid, e["f1"] - 8), "f1": e["f1"]})
        print(f"    split vertical: '{t}' -> '{a}' + '{b}'")
    return out


def build(locale: str) -> dict:
    timing = json.load(open(os.path.join(ROOT, "src", "timing.generated.json")))[locale]
    tracks = {}
    for i, scene in enumerate(SCENES):
        wav = os.path.join(ROOT, "public", "audio", f"narration-{locale}", f"scene-{i}.wav")
        narr_s = wav_duration(wav)
        text = ZH_CAPTIONS[scene] if locale == "zh" else NARRATION[locale]["text"][scene]
        phrases = split_zh(text) if locale == "zh" else split_en(text)
        weights = [weight(p) for p in phrases]
        total_w = sum(weights)
        start_f = max(0, round(LEAD_S * FPS))
        # speech window: narration duration minus a hair; clamp to scene length
        scene_f = timing[scene]
        span_f = min(round(narr_s * FPS) - start_f, scene_f - 4 - start_f)
        entries = []
        cursor = start_f
        for ph, w in zip(phrases, weights):
            dur = max(12, round(span_f * w / total_w))
            f0 = cursor
            f1 = min(cursor + dur, scene_f - 2)
            entries.append({"t": ph, "f0": f0, "f1": f1})
            cursor = f1
        tracks[scene] = fit_vertical(entries, locale)
    return tracks


if __name__ == "__main__":
    data = {"zh": build("zh"), "en": build("en")}
    out = os.path.join(ROOT, "src", "captions.generated.json")
    with open(out, "w") as f:
        json.dump(data, f, indent=1)
    for loc in data:
        for scene, entries in data[loc].items():
            preview = " | ".join(e["t"] for e in entries)
            print(f"[{loc}] {scene} ({len(entries)}): {preview}")
    print("wrote", out)
