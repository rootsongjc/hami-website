# Troubleshooting — every gotcha already paid for

## §install — fresh `npm install` in the template

1. **esbuild postinstall blocked** by npm allow-list: after install run
   `cd node_modules/esbuild && node install.js` or every remotion command
   fails with a missing-esbuild error.
2. **Remotion Chrome Headless Shell auto-extract is broken on macOS**: it
   extracts only ABOUT/LICENSE and leaves the zip. Fix:

   ```bash
   rm -rf node_modules/.remotion && npx remotion browser ensure
   ditto -x -k node_modules/.remotion/chrome-headless-shell/chrome-headless-shell-mac-arm64.zip \
          node_modules/.remotion/chrome-headless-shell/mac-arm64/
   ```

## §tts — narration engines

- **zh = Azure Speech REST** via `scripts/azure_tts.py`, voice
  `zh-CN-XiaochenMultilingualNeural`, rate +8%, no style (multilingual voices
  take none). Credentials `video/.azure-speech.json` `{"region","key"}`
  (gitignored, NOT in this skill bundle — SKILL.md hard rules says where the
  live one is). Free F0 resource is enough (500 min/wk style-less on the HAMi
  project's resource `hami-tts-video`, region eastus).
- **zh fallback = edge-tts** `zh-CN-XiaoxiaoNeural` (engine "edge" in
  build_narration.py). CLI invocation gotchas: run as `python3 -m edge_tts`;
  pass rate as **equals-form** `--rate=+8%` (a space-separated value starting
  with `-`/`+` breaks argparse); outputs mp3 → convert
  `npx remotion ffmpeg -y -i in.mp3 out.wav`.
- **en = Kokoro** `af_sky` via `npx hyperframes tts text.txt --voice af_sky
  --output out.wav` (hyperframes passes `lang` correctly). Direct
  `kokoro_onnx` calls mis-handle languages (lang="zh" crashes the espeak
  backend; omitting it phonemizes zh as en-us → 27s of dragged audio).
- **Never Kokoro zh** — strong regional accent (user flagged it; whisper
  round-trip garbled).
- Model caches: Kokoro/voices + whisper ggml under `~/.cache/hyperframes/`.
- whisper round-trip QA: `npx hyperframes transcribe X.wav --model small
  --language zh` (writes transcript.json next to input, overwrites each run).

## §remotion — framework traps

- Composition **ids**: `[a-zA-Z0-9-CJK]` only — underscore silently breaks
  selection (`HAMI211ZH` not `HAMI_211_ZH`).
- `calculateMetadata`/Composition `props` must be **type aliases** (type X =
  {...}), not interfaces, for `Record<string, unknown>` assignability.
- `useVideoConfig()` inside a `<Sequence>` returns the SEQUENCE's duration,
  not the composition's — read totals in the root component.
- `defaultProps` on Composition for the switch you flip via `--props` (e.g.
  `captions`), so one-off renders are deterministic.

## §render

- Long renders: run sequentially in one background shell, end with an
  `echo ALL_OK` marker; confirm by `ls -la out/` timestamps, not scrollback.
- `npx remotion ffmpeg` wraps the bundled ffmpeg (mp3→wav, frame extracts).
- Still renders of en compositions need `--props='{"captions":true}'` to QA
  captions (zh has them on by default).
- Windows-style path/quote quirks don't apply; on macOS `ditto -x -k` (not
  unzip) preserves exec bits in the headless shell fix.

## §qa — OCR

- Use `assets/qa/ocr_box.swift` (macOS Vision, zh-Hans+en-US, prints
  `[x..-.. y..-..] text` per line). Compile nothing: `swift ocr_box.swift imgs...`.
- Do NOT use SFSpeechRecognizer in QA swift tools — crashes on TCC privacy
  permissions.
- OCR confusions to expect: '.' between digits/letters inside brand terms
  (project-hami.io read as `project-hami.1…io`), missing spaces between CJK
  and latin. Judge by coordinates + fuzzy match, not exact strings.
- If the model has vision tools available, prefer them for reading user
  screenshots; OCR remains the bulk verifier for rendered stills.
