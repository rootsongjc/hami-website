# Pipeline — from copy to rendered MP4s

The template (`assets/template/`) is the HAMi v2.11.0 announcement. A new video
generally keeps the scaffolding (theme, Shared components, Captions, scripts,
Video/VideoVertical assemblies) and replaces content + scenes.

## One-time prerequisites

```bash
brew install espeak-ng                       # phonemizer for Kokoro
python3 -m pip install --user --break-system-packages \
    edge-tts kokoro-onnx soundfile            # TTS engines + wav IO
npx hyperframes tts hi --voice af_sky --output /tmp/x.wav   # warms Kokoro model cache
```

- numpy for `make_bgm.py`: system python3 usually has it; otherwise use the
  DSH-bundled interpreter
  `/Users/jimmysong/.dsh/dsh-runtimes/dsh-primary-runtime/dependencies/python/bin/python3`.
- Azure zh voice: put `video/.azure-speech.json`
  (`{"region": "...", "key": "..."}`) in place — see SKILL.md hard rules.
- Remotion install fixes (esbuild allow-scripts, chrome-headless-shell
  extraction): see `troubleshooting.md` §install — hit every fresh `npm install`.

## New-video edit checklist (in order)

1. **Compositions & names** — decide the 4 ids (e.g. `HAMI211ZH`, `HAMI211ZHV`,
   `HAMI211EN`, `HAMI211ENV`). ids allow `[a-zA-Z0-9-CJK]` only, **no
   underscore**. Update `src/Root.tsx`, then every `npm run render*` script in
   `package.json` and output filenames.
2. **On-screen copy** — `src/content.ts`: ALL text zh+en (typed per scene),
   version numbers, links, CTA. This is the single source for scene text.
3. **Scenes** — edit/replace `src/scenes/*.tsx` + `src/scenes/vertical/*.tsx`.
   Keep the vertical variants' content inside the safe zone
   (layout-safe-zones.md). Reuse `components/Shared.tsx` primitives
   (Backdrop, SceneHeader, Bullets, Chip, Card, Watermark, ProgressBar).
4. **Narration copy** — `scripts/build_narration.py`: `NARRATION[locale].text`
   per scene. zh is written TTS-friendly (哈密 = HAMi, 二点一一零 = v2.11.0,
   英伟达 = NVIDIA, full-width punctuation, few commas = one breath per fact).
   Tune `PAD` (tail padding per scene) and `MIN_FRAMES` (animations must
   finish) if scenes change.
5. **Caption copy** — `scripts/build_captions.py`: `ZH_CAPTIONS` per scene.
   Unlike TTS text, captions use REAL spellings (HAMi, v2.11.0, CUDA) because
   they are read, not spoken. en captions reuse narration text automatically.
6. **Images** — official logos already in `public/img/`; add per-video assets
   (e.g. WeChat QR) there.
7. **README.md** — update composition table + scene list for the new video.

## Build pipeline (order matters)

```bash
npm run narration   # synth TTS (zh azure / en kokoro), measure wavs,
                    #   write src/timing.generated.json (scene lengths = audio + PAD, ≥ MIN_FRAMES)
npm run captions    # phrase-timed captions from narration wavs -> src/captions.generated.json
                    #   (splits over-wide vertical entries automatically)
npm run bgm         # ambient bed sized to zh total; npm run bgm:en for en
npx remotion studio # optional live preview
```

Then **QA stills** (layout-safe-zones.md §qa) and finally render:

```bash
npm run render          # zh landscape + vertical, captions burned in (default files)
npm run render:en       # en landscape + vertical, clean
npm run render:cap:en   # en ...-captioned.mp4
npm run render:nocap    # zh ...-clean.mp4
npm run render:prores   # ProRes master if needed
```

Renders are safe to run sequentially in one background shell; verify with
`ls -la out/` timestamps + `exit 0` markers rather than trusting scrollback.

## Iteration rules

- Changed narration text → re-run narration → captions → bgm (music length
  tracks total) → re-render affected cuts.
- Changed only on-screen copy (`content.ts`) → captions if phrases changed,
   then render.
- Swapped in a human voice recording → drop files as
  `public/audio/narration-<locale>/scene-*.wav`, `npm run narration -- --dry`
  (re-time without synth), `npm run bgm`.
- Licensed music instead of the synth bed → replace `public/audio/bgm-<locale>.wav`
  (same name, matching length), re-render. Volume/fades live in
  `src/Video.tsx` / `src/VideoVertical.tsx` (~0.13 under narration).

## Voice QA (whisper round-trip)

`npx hyperframes transcribe <wav> --model small --language zh` writes
`transcript.json` next to the input. Compare against the script — catches
accents, dropped terms and garbling BEFORE human review. zh terms to verify:
HAMi, GPU, CUDA, vLLM, Helm. Voice-selection history (what won/lost and why)
is in `assets/template/README.md` §Narration.
