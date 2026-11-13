# HAMi brand rules for video

Source of truth: hami-website repo `BRAND.md` (dark tokens) + `static/img/`.
The template's `public/img/` already carries the needed assets.

## Tokens (src/theme.ts)

| Token | Value |
| --- | --- |
| primary (brand green) | `#10d05d` |
| secondary (cyan) | `#39c6f4` |
| tertiary (violet) | `#7c8cff` |
| background | `#0b0f14` |
| surface | `#171e27` |
| border | `#2a3442` |
| text | `#f5f7fa` |
| muted | `#9eb6ce` |

Fonts: **Space Grotesk** (display/latin), **Noto Sans SC** (zh), **IBM Plex
Mono** (code/links) — @fontsource packages, self-hosted by the template.

## Official assets (public/img/)

- `hami-graph-color.svg` — square graph mark
- `hami-horizontal-color-white.svg` — horizontal lockup for dark backgrounds
- `cncf-white.svg` — CNCF logo
- `wechat-assistant-qr.jpg` — community assistant QR (from website repo
  `static/img/community/`)

**Never recolor or restyle the logos.** Do not rebuild them from primitives.

## Copy conventions

- Official zh tagline (verbatim):
  「HAMi 是开源的云原生 GPU 虚拟化中间件，为 AI 工作负载提供异构加速器的共享、隔离与调度能力。」
- Project positioning: CNCF Incubating project; state the stage (Incubating)
  in intro/outro.
- Trademark line for credits: “HAMi and the HAMi logo are trademarks of The
  Linux Foundation.”

## Outro CTA (settled)

- zh: headline 欢迎到 GitHub 给 HAMi 点个 Star, Star card linking
  `github.com/Project-HAMi/HAMi`, + WeChat QR card (扫码添加社区小助手,
  加入 HAMi 微信社区).
- en: Star CTA + `project-hami.io` web card.
- Star icon is the yellow `#e3b341` SVG star; Globe icon uses secondary cyan.

## Don'ts (user-settled)

- **No adopter logo walls.** The user rejected a 10-logo “trusted in
  production” strip: a partial list misrepresents, and completeness is
  unmanageable. Company names may appear in prose, not as a logo grid.
- No logo recoloring, no unofficial logo variants, no AI-reconstructed marks.
- Brand green is for accents/highlights (incl. English terms inside zh
  captions), not large fills except deliberate CTA cards.
