#!/usr/bin/env python3
"""Azure Speech TTS wrapper for the HAMi video narration pipeline.

Reads credentials from video/.azure-speech.json (gitignored).
Usage:
  python3 scripts/azure_tts.py --voice zh-CN-Harper:MAI-Voice-2.1-Flash \
      --style narrator --rate "+8%" --text "你好" --out out/x.wav
  python3 scripts/azure_tts.py ... --styledegree 1.4
SSML output is riff-24khz-16bit-mono-pcm WAV (24 kHz mono 16-bit).
"""
import argparse
import json
import sys
import urllib.request

BASE_FORMAT = "riff-24khz-16bit-mono-pcm"


def load_cfg():
    with open(__file__.replace("scripts/azure_tts.py", ".azure-speech.json")) as f:
        return json.load(f)


def synthesize(text: str, voice: str, out_path: str, style: str = None,
               styledegree: float = None, rate: str = None, pitch: str = None,
               lang: str = "zh-CN") -> None:
    cfg = load_cfg()
    region, key = cfg["region"], cfg["key"]
    prosody_attrs = "".join(
        f' {k}="{v}"' for k, v in (("rate", rate), ("pitch", pitch)) if v)
    prosody_open = f"<prosody{prosody_attrs}>" if prosody_attrs else ""
    prosody_close = "</prosody>" if prosody_attrs else ""
    if style:
        sd = f' styledegree="{styledegree}"' if styledegree else ""
        inner = f'<mstts:express-as style="{style}"{sd}>{prosody_open}{text}{prosody_close}</mstts:express-as>'
    else:
        inner = f"{prosody_open}{text}{prosody_close}"
    ssml = (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" '
        'xmlns:mstts="https://www.w3.org/2001/mstts" '
        f'xml:lang="{lang}">'
        f'<voice name="{voice}">{inner}</voice></speak>'
    )
    url = f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1"
    req = urllib.request.Request(url, data=ssml.encode("utf-8"), headers={
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": BASE_FORMAT,
        "User-Agent": "hami-video-pipeline",
    })
    import time
    last_err = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = resp.read()
            break
        except Exception as e:  # IncompleteRead, timeouts, 5xx
            last_err = e
            if attempt == 3:
                raise
            time.sleep(2 * (attempt + 1))
    else:
        raise last_err or RuntimeError("tts failed")
    with open(out_path, "wb") as f:
        f.write(data)
    print(f"wrote {out_path} ({len(data)} bytes)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", required=True)
    ap.add_argument("--style", default=None)
    ap.add_argument("--styledegree", type=float, default=None)
    ap.add_argument("--rate", default=None)
    ap.add_argument("--pitch", default=None)
    ap.add_argument("--lang", default="zh-CN")
    ap.add_argument("--text", default=None)
    ap.add_argument("--file", default=None, help="read text from file")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    text = args.text
    if args.file:
        with open(args.file, encoding="utf-8") as f:
            text = f.read().strip()
    if not text:
        sys.exit("no text given")
    synthesize(text, args.voice, args.out, args.style, args.styledegree,
               args.rate, args.pitch, args.lang)


if __name__ == "__main__":
    main()
