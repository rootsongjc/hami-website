---
name: hami-video
description: "Use when creating or editing HAMi project videos — release announcements, feature intros, community promos. Covers scaffolding the bundled Remotion template, landscape+vertical scenes for zh+en, TTS narration (Azure/edge-tts/Kokoro), single-line captions, BGM synthesis, Bilibili/WeChat-Channels safe zones, OCR-based visual QA, and MP4 rendering."
---

# HAMi video maker

Produce HAMi project videos — release announcements, feature intros, community
promos — as motion-graphics MP4s with AI voiceover, burned-in captions and a
synthetic music bed, in **landscape** (Bilibili / YouTube / website) and
**vertical** (视频号 / 抖音 / 小红书 / Shorts) cuts, **zh + en** from one timeline.

A complete, proven template (the HAMi v2.11.0 announcement: 9 scenes, 4
compositions, 1080p30) is bundled at `assets/template/`. A new video = copy the
template → edit copy & scenes → run the pipeline. Start there; do not re-derive.

**Within this repository** (branch `multimedia`) the LIVE project is `video/`
at the repo root — prefer it over `assets/template/`, which is a snapshot kept
for out-of-repo use and may lag behind `video/`.

## Quick start

```bash
cp -R <this-skill>/assets/template <target-repo>/video   # or any dir
cd video
npm install                        # then read references/troubleshooting.md §install
npm run narration                  # TTS + scene timing  (needs prereqs below)
npm run captions                   # single-line caption tracks
npm run bgm                        # music bed sized to the new total
npx remotion still src/index.ts HAMI211ZH out/check.png --frame=120   # QA stills
npm run render                     # zh landscape+vertical (captions ON)
```

## What a deliverable set looks like

| Composition | Output | Notes |
| --- | --- | --- |
| `HAMI211ZH` / `HAMI211ZHV` | `*-zh.mp4` / `*-zh-vertical.mp4` | captions ON by default (B站/视频号 audience expects them) |
| `HAMI211EN` / `HAMI211ENV` | `*-en.mp4` / `*-en-vertical.mp4` | clean by default; `--props='{"captions":true}'` for `-captioned` |
| — | `*-zh-clean.mp4` etc. | `--props='{"captions":false}'` |

Scene lengths follow the narration audio automatically (`src/timing.generated.json`),
so copy edits never need manual retiming.

## Scope of this branch

Branch `multimedia` is the home for ALL HAMi multimedia work (videos now;
podcasts/shorts/other formats later): the `video/` Remotion pipeline, this
skill, and future media tooling. Branch off `multimedia` for each new video
(e.g. `multimedia/video-v2.12`), keep `multimedia` itself green.

## Read next

| Task | File |
| --- | --- |
| Full workflow, new-video edit checklist, exact commands, QA loop | `references/pipeline.md` |
| B站 / 视频号 safe zones, single-line caption rule, layout lessons | `references/layout-safe-zones.md` |
| Brand tokens, fonts, official logos, tagline, CTA, don'ts | `references/brand.md` |
| Install fixes, TTS engines, rendering gotchas, OCR QA helper | `references/troubleshooting.md` |
| Copyable starter (Remotion project) | `assets/template/` |
| macOS Vision OCR box-scan helper for QA | `assets/qa/ocr_box.swift` |

## Hard rules (settled with the user — do not re-litigate)

- **zh narration voice**: Azure Speech `zh-CN-XiaochenMultilingualNeural`
  (multilingual, native Putonghua, fluent English terms). Fallback: edge-tts
  `zh-CN-XiaoxiaoNeural`. **Never Kokoro for zh** (strong regional accent).
  en: Kokoro `af_sky` (local, good).
- **Vertical captions are ALWAYS single-line** — over-long entries are split
  into two captions, never wrapped (see layout-safe-zones.md).
- **Safe zones are law**: B站 landscape caption band bottom 150px; 视频号
  vertical content width 856px, right edge x≤920, content ends above y≈1410.
- **Brand**: official logo SVGs as-is (never recolor); **no adopter logo
  walls** (user explicitly rejected them); trademark line goes in credits.
- **Azure credentials are NOT in this bundle** (secret). Shape:
  `{"region": "eastus", "key": "..."}` at `video/.azure-speech.json`
  (gitignored). The live one for the HAMi project sits next to the original
  `video/` checkout in the hami-website repo worktree — ask the user or
  create a Free F0 Speech resource.
- **QA before shipping**: render stills → OCR box scan (zh AND en, late
  frames ≥200 past scene start so bullets have entered) → check overlaps.
  The model may not have vision; `assets/qa/ocr_box.swift` + coordinate
  checks are the reliable substitute.
