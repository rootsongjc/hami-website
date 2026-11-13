# HAMi v2.11.0 Release Announcement Video

Motion-graphics announcement videos for
[HAMi v2.11.0](https://github.com/Project-HAMi/HAMi/releases/tag/v2.11.0), built with
[Remotion](https://remotion.dev) (React). Four deliverables render from one timeline:

| Composition | Output | Use |
| ----------- | ------ | --- |
| `HAMI211ZH` | `out/hami-v2.11.0-announcement-zh.mp4` | 中文横屏 16:9 — B 站 / YouTube / 官网 |
| `HAMI211ZHV` | `out/hami-v2.11.0-announcement-zh-vertical.mp4` | 中文竖屏 9:16 — 视频号 / 抖音 / 小红书 / Shorts |
| `HAMI211EN` | `out/hami-v2.11.0-announcement-en.mp4` | English landscape |
| `HAMI211ENV` | `out/hami-v2.11.0-announcement-en-vertical.mp4` | English vertical |

All cuts are 1080p30, H.264 + AAC, with **AI voiceover** (Kokoro TTS, local) and a
synthetic ambient music bed. Scene lengths follow the narration automatically.

## Layout

```
video/
├── src/
│   ├── content.ts            # ALL on-screen copy (zh + en) — edit here
│   ├── timing.generated.json # per-locale scene lengths (from narration audio)
│   ├── theme.ts              # brand tokens (colors, fonts) from website BRAND.md
│   ├── Video.tsx             # landscape assembly (scenes + narration + bgm)
│   ├── VideoVertical.tsx     # 1080x1920 assembly for short-video channels
│   ├── Root.tsx              # the 4 compositions
│   ├── components/Shared.tsx
│   └── scenes/               # landscape + vertical/ scene variants
├── public/img/               # official HAMi + CNCF logos (from static/img)
├── public/audio/
│   ├── narration-zh|en/      # scene-0..8.wav (Kokoro TTS, gitignored)
│   └── bgm-zh|en.wav         # ambient bed (scripts/make_bgm.py, gitignored)
└── scripts/
    ├── build_narration.py    # TTS + measure + write timing.generated.json
    └── make_bgm.py           # numpy ambient music synth
```

## Commands

```bash
npm install                     # first time

# one-time audio pipeline prerequisites:
brew install espeak-ng
python3 -m pip install --user --break-system-packages edge-tts kokoro-onnx soundfile
npx hyperframes tts hi --voice af_sky --output /tmp/x.wav   # downloads Kokoro models (en voice)

npm run narration               # (re)generate narration + timing.generated.json
npm run bgm                     # (re)generate music beds to match the new totals

npx remotion studio             # live preview

npm run render                  # zh landscape + vertical (captions ON — B站/视频号 default)
npm run render:en               # en landscape + vertical (clean, no captions)
npm run render:cap:en           # en landscape + vertical, burned-in captions (-captioned)
npm run render:nocap            # zh landscape + vertical, captions OFF (-clean suffix)
```

## Scenes

1. **Intro** — HAMi logo, v2.11.0, release date, CNCF Incubating
2. **Stats** — 220+ PRs · 50+ contributors · 29 first-timers (animated counters)
3. **Remote GPU** — Lupine client/server node diagram with animated link
4. **AMD Instinct** — memory/compute isolation bars + placement chips
5. **Ascend ENPU** — fixed-share / elastic / best-effort policy cards
6. **NUMA Refit** — CPU Manager + HAMi scheduler converging on one NUMA node
7. **More** — Flexible MIG, scheduler hardening, OpenShift/SELinux, …
8. **Upgrade** — typing terminal with the helm upgrade command
9. **Outro** — logo lockup, tagline + CTA: zh = Star button + WeChat QR code
   (community assistant, `public/img/wechat-assistant-qr.jpg` from the website
   repo); en = Star button + project-hami.io card. Links, thanks, CNCF.

## Narration & timing

Voice copy lives in `scripts/build_narration.py` (`NARRATION[locale].text`). It is
written TTS-friendly (哈密 = HAMi, 英伟达 = NVIDIA, 二点一一零 = v2.11.0, full-width
punctuation) while on-screen text in `src/content.ts` keeps real English spelling.

- **zh**: `zh-CN-XiaochenMultilingualNeural` via **Azure Speech REST**
  (`scripts/azure_tts.py`, credentials in `video/.azure-speech.json` —
  gitignored; Speech resource `hami-tts-video` Free F0, region `eastus`, RG
  `hami-video-rg`). Rate +8%, no style (multilingual voices have none).
  Multilingual = native Putonghua with fluent English terms (GPU/CUDA/vLLM/Helm)
  mid-sentence. Selection history: user rejected the zh-only
  `Harper:MAI-Voice-2.1-Flash` narrator (English terms broke mid-sentence) and
  the free edge-tts voices; from 6 multilingual candidates
  (`out/voice-samples-multilingual/`) B 晓辰 won on native-zh feel + term
  clarity (whisper round-trip hit 5/7 terms incl. CUDA/vLLM/Helm, best of zh
  voices). Earlier zh-voice pack: `out/voice-samples-azure/`. Query all
  voices+styles: `GET
  https://<region>.tts.speech.microsoft.com/cognitiveservices/voices/list`.
  Kokoro's zh voices have a strong regional accent — never use them for zh.
- **en**: `af_sky` via Kokoro (local, native-quality English).

Changing narration changes scene lengths automatically: `npm run narration` re-measures
audio and rewrites `src/timing.generated.json` (min lengths per scene are enforced so
animations still finish). Then run `npm run bgm` to match the music length.

Other Mandarin voices worth trying (edit `voice` in `build_narration.py`): the
full Azure catalog is queryable via the voices/list API above — multilingual
females: `zh-CN-XiaoxiaoMultilingualNeural` (story/cheerful styles, weaker
English terms per whisper test), `zh-CN-XiaoyouMultilingualNeural` (chat),
`en-US-AvaMultilingualNeural` / `en-US-SerenaMultilingualNeural` (serious;
English-native, slight accent on zh).

To swap the synthetic voice for a human recording: replace the files in
`public/audio/narration-<locale>/scene-*.wav`, re-run `npm run narration -- --dry`
to re-time, and `npm run bgm`.

## Captions (zh ON by default; platform safe zones)

Caption defaults follow the target platforms: **zh compositions ship WITH
burned-in captions** (`Root.tsx` sets `captions: true` for `HAMI211ZH` /
`HAMI211ZHV` — the B站/视频号 audience expects subtitles); **en compositions
default to clean**, export a captioned variant with the `captions` prop:

```bash
npm run render             # zh → captions burned in (default files)
npm run render:nocap       # zh → out/*-clean.mp4 (captions off)
npm run render:cap:en      # en → out/*-captioned.mp4
# one-off: npx remotion render HAMI211EN out/x.mp4 --props='{"captions":true}'
```

Caption copy is generated by `scripts/build_captions.py` into
`src/captions.generated.json`. zh caption copy lives in `ZH_CAPTIONS` — unlike
the TTS text it uses REAL spellings (HAMi, v2.11.0, CUDA) because it is read,
not spoken. en captions reuse the narration text. Phrase timing is proportional
to weighted length (CJK char = 1, latin word = 2) over the measured narration
wav — accurate to ~±0.3s per scene. Regenerate AFTER `npm run narration`
(or `npm run captions` directly):

```bash
python3 scripts/build_captions.py   # rewrites src/captions.generated.json
```

Layout (v3 — dedicated caption zones per platform, never over scene content):

- **Landscape = B站** (1920×1080): full-width bottom gradient band (150px,
  transparent → dark). Text sits at `bottom: 85` (y ≈ 949-995), clearing the
  B站 web control bar (y ≈ 1010+) when it slides in. All scene bullets /
  outro footer are raised to end above y ≈ 940 (verified by OCR box scan).
  The 6px ProgressBar is decorative and may be covered by the player bar.
- **Vertical = 视频号** (1080×1920): frosted-glass pill (blur + 0.55 alpha)
  pinned at `bottom: 400` (y ≈ 1403-1520), fontSize 33 zh / 29 en,
  maxWidth 856. Captions are ALWAYS a single line (user rule): the pill is
  centered with `left:0; right:0; margin:auto` (NOT `left:50%` — that halves
  the available wrap width), `whiteSpace: nowrap`, over-wide entries are
  split into two captions by `fit_vertical()` in `scripts/build_captions.py`
  (>780px est. width), and the renderer scales the font down as a last-resort
  net. Vertical scenes use a 856px content width (left 64, right
  edge x = 920) and end content above y ≈ 1410, so the right-side like/
  comment/share icon rail (x ≥ ~930, y ≈ 950-1550) and the bottom account/
  caption strip (y ≥ ~1540) never cover scene text.

English terms in zh captions are tinted brand green. If scene layouts change,
re-check with stills: `npx remotion still src/index.ts HAMI211ZH
out/stills/<name>.png --frame=<n>` (zh already has captions on) and OCR it.

## Music

`scripts/make_bgm.py` synthesizes a quiet ambient bed (Am–F–C–G pads) — no license
needed. To use licensed music instead, drop files at `public/audio/bgm-zh.wav` /
`bgm-en.wav` (same names, matching lengths) and re-render. Music volume and the
fade envelope are in `src/Video.tsx` / `src/VideoVertical.tsx`.

## Branding rules

- Colors and font stacks mirror the website `BRAND.md` (dark mode tokens).
- Logos are the official CNCF artwork SVGs copied from `static/img/` — do not recolor.
- HAMi and the HAMi logo are trademarks of The Linux Foundation.
