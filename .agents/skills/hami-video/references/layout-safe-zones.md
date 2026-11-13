# Layout: platform safe zones + caption rules

All coordinates are pixels at native resolution (1920×1080 landscape,
1080×1920 vertical), origin top-left. These encode real overlap bugs found in
review — treat them as hard limits, not suggestions.

## Landscape (1920×1080) = B站 / YouTube

- Caption band: full-width bottom gradient, 150px tall; text at `bottom: 85`
  (text baseline zone y ≈ 949–995).
- **All scene content (bullets, cards, outro footer) must end above y ≈ 940.**
- B站 web control bar slides over y ≈ 1010+; the 6px ProgressBar is decorative
  and may be covered.
- Outro footer (thanks + CNCF) is a single in-flow line at the column end, not
  absolutely-positioned rows (absolute rows collided with the caption band).

## Vertical (1080×1920) = 视频号 / 抖音 / Shorts

- Content column: **width 856** (left margin 64 → right edge x = 920).
- **Content must end above y ≈ 1410.**
- Caption pill: frosted glass, pinned `bottom: 400` (y ≈ 1403–1520), fontSize
  zh 33 / en 29, maxWidth 856.
- 视频号 UI overlays to avoid: right icon rail x ≥ ~930, y ≈ 950–1550; bottom
  account/caption strip y ≥ ~1540.

## Caption rules (user-settled)

- **Vertical captions NEVER wrap.** One line per caption; over-wide text is
  split into two sequential captions by `fit_vertical()` in
  `scripts/build_captions.py` (entries > 780px estimated width are split at
  、，, or space; duration split by text weight). The renderer also sets
  `whiteSpace: nowrap` and scales the font down (min 22) as a last-resort net.
- **Centering gotcha that caused a wrap bug**: an absolutely-positioned pill
  centered with `left: "50%" + translateX(-50%)` gets HALF the parent width as
  its wrap width (540→480px usable) and `maxWidth` silently fails. Correct:
  `left: 0; right: 0; margin: "0 auto"; width: "fit-content"`.
- English terms inside zh captions are tinted brand green.
- Landscape captions sit in their own band (bottom 150px) so they can never
  overlap scene content by construction.

## Scene-geometry lessons (vertical variants are the dangerous ones)

- **RemoteGpuV stack** (proven values): client card top 460 h 290 (bottom 750)
  → wire svg y 750–865 (label at y0+64) → server top 865 h 300 (bottom 1165)
  → bullets `bottom: 490` (top ≈ y 1206). en bullets wrap to 4–5 lines and
  still clear the server card by 41px.
- **NumaV**: NUMA box top 940; connector ends at box top; event chip top 1155
  (bottom ≈ 1198); bullets `bottom: 510` (top y 1265) — 67px gap.
- **en text wraps more than zh** (65–77-char bullets → 4–5 lines). Every
  layout check must run BOTH locales.

## QA method (works without model vision)

1. Render late-frame stills — **≥ 200 frames past scene start** (bullets have
   entrance delays ~70–92 + spring, so mid-caption frames can predate the
   bullets entirely; that caused a missed overlap once).

   ```bash
   npx remotion still src/index.ts HAMI211ZHV out/stills/v-<scene>.png --frame=<n>
   npx remotion still src/index.ts HAMI211ENV out/stills/en-<scene>.png --frame=<n> --props='{"captions":true}'
   ```

   (en compositions default to captions OFF — pass `--props` for caption QA.)
2. OCR box-scan every still with `assets/qa/ocr_box.swift`
   (`swift ocr_box.swift a.png b.png` → per-line `[x..-.. y..-..] text`).
3. Assert the invariants above: no line crosses y 940 (landscape content),
   y 1410 (vertical content bottom), x 920 (vertical content right edge);
   captions in their zones; gaps between stacked elements > 0.
4. Final cuts: `ffmpeg -ss <t> -i out/<mp4> -frames:v 1` spot frames for the
   exact frames users screenshot (caption mid-points).

Swift Vision OCR (`ocr_box.swift`) is the proven scanner. Do NOT use
SFSpeechRecognizer-based swift (crashes on TCC privacy); do not rely on
`tesseract` for zh (eng-only in practice).
