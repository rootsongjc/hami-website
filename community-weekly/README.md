# HAMi 社区周报

HAMi 社区每周五发布的内容周报：覆盖 Project-HAMi GitHub 组织全部仓库一周内**已完成**的代码、文档、版本发布与社区活动。本目录（`community-weekly/` 分支 `community-weekly`）集中存放所有期目、模板与配图。

每期出**中英双语**：中文版（`YYYY-MM-DD.md`）发微信公众号等中文渠道；英文版（`YYYY-MM-DD.en.md`）发 HAMi 的 LinkedIn 与 X（Twitter）等国际渠道，配图同步双语。

## 目录结构

```
community-weekly/
├── README.md          # 本文件：索引 + 流程
├── TEMPLATE.md        # 周报模板：写作规则 + 数据采集命令 + 正文结构
├── YYYY-MM-DD.md      # 各期正文·中文（以该期结束的周五日期命名）
├── YYYY-MM-DD.en.md   # 各期正文·英文（同日期 + .en 后缀）
└── images/            # 各期配图（Remotion 渲染；中文无后缀，英文加 -en；横版 1920×1080 / 竖版 1080×1920）
```

## 期目索引

| 期号 | 发布日期 | 中文 | 英文 | 配图 |
|---|---|---|---|---|
| 第 1 期 | 2026-11-13 | [2026-11-13.md](2026-11-13.md) | [2026-11-13.en.md](2026-11-13.en.md) | 中：[横](images/2026-11-13.png) · [竖](images/2026-11-13-vertical.png)／英：[横](images/2026-11-13-en.png) · [竖](images/2026-11-13-en-vertical.png) |

## 每周流程（周五）

1. 按 [TEMPLATE.md](TEMPLATE.md) 中的采集命令抓取本周数据（commits / PR / issues / releases / Star）。
2. 撰写当期中文正文 `YYYY-MM-DD.md`，再产出英文版 `YYYY-MM-DD.en.md`（结构与数据一致，贡献者一律 GitHub ID），遵守模板写作规则（只写已完成、按贡献者组织、链接克制）。
3. 更新 Remotion 卡片内容并渲染四张图（组合 `HAMIWEEKLY` / `HAMIWEEKLYV` / `HAMIWEEKLYEN` / `HAMIWEEKLYENV`，位于本仓库 `multimedia` 分支 `video/` 工程，改 `src/WeeklyCard.tsx` 顶部 ZH / EN 常量），图片输出到 `images/`。
4. 更新本期目索引表，提交到 `community-weekly` 分支。
5. 发布：中文版 → 微信公众号、微信群、Discord；英文版 → LinkedIn、X（@ProjectHAMi）。
