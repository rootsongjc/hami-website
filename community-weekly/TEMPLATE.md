# HAMi 社区周报模板

> 每周五发布。覆盖时间窗：上周五 00:00 → 本周五（含）。**只写本周已完成、已合入、已发布、已举办的事**；进行中的 PR、未落地的设计讨论一律不写。

## 写作规则

1. **只记录已完成**：已合并的 PR、已发布的版本、已上线的文档/博客、已举办的活动。开放中的 PR、提案、issue 讨论不进入正文。
2. **时间窗边缘灵活处理**：窗口开始前 1～2 天发生的重大事件（如版本发布），若本周才完成公告/文档/传播收尾，应作为头条纳入并标注实际日期——读者视角它是"本周社区最重要的事"。
2. **突出贡献者，而不是罗列 PR**：正文按「谁在哪个仓库完成了什么」组织，最多附 3～5 个全局链接（仓库、公告、幻灯片），不逐条贴 PR 链接。
3. **用数字支撑**：每周固定采集下表数据，放进「本周数据」；头条里的每件事尽量带数字（提交数、PR 数、Star 数、参会规模等）。
4. **官网更新不单列**：官网只是社区动作的体现，并入对应头条（如"文档上线"并入对应项目动态）。
5. 篇幅控制在一页以内；语言面向社区用户、爱好者与贡献者，避免内部术语。

## 数据采集（每周五执行）

```bash
# 时间窗：上周五至今日
SINCE=2026-11-06 UNTIL=2026-11-14   # 按实际日期修改

# 1) 组织所有仓库一周 commit（总数 + 按仓库/作者聚合）
gh api "search/commits?q=org:Project-HAMi+committer-date:${SINCE}..${UNTIL}&per_page=100" \
  --jq '"TOTAL: \(.total_count)", ([.items[].repository.full_name] | group_by(.) | map({r: .[0], n: length}) | sort_by(-.n)[] | "\(.n)\t\(.r)")'

# 2) 合并的 PR（作者分布）
gh api "search/issues?q=org:Project-HAMi+is:pr+merged:${SINCE}..${UNTIL}&per_page=100" \
  --jq '"TOTAL: \(.total_count)", (.items[] | [(.repository_url | split("/repos/")[1]), .number, .title, .user.login] | @tsv)'

# 3) 新开 / 关闭 issue 数
gh api "search/issues?q=org:Project-HAMi+is:issue+created:${SINCE}..${UNTIL}&per_page=100" --jq '.total_count'
gh api "search/issues?q=org:Project-HAMi+is:issue+closed:${SINCE}..${UNTIL}&per_page=100" --jq '.total_count'

# 4) 本周发布（对近期有推送的仓库逐个查）
for r in HAMi HAMi-DRA HAMi-core HAMi-WebUI volcano-vgpu-device-plugin amd-device-plugin ascend-device-plugin; do
  gh api "repos/Project-HAMi/$r/releases?per_page=3" --jq ".[] | select(.published_at >= \"${SINCE}\") | [\"$r\", .tag_name, .published_at] | @tsv"
done

# 5) 主仓库 Star
gh api repos/Project-HAMi/HAMi --jq '.stargazers_count'

# 6) 官网内容落地（website 仓库 master）
git -C <website-checkout> fetch upstream --quiet
git -C <website-checkout> log upstream/master --since="${SINCE} 00:00:00" --pretty=format:'%h %ad %an | %s' --date=short
```

注意：约半数 PR 为 dependabot 自动升级，统计"贡献者"时排除 bot（dependabot[bot]、hami-robot[bot]、fishmans-agent 等按需人工判断）。

## 周报图片版（Remotion 模板）

图片模板在 hami-website 仓库 `multimedia` 分支 `video/` 工程：组合 `HAMIWEEKLY` / `HAMIWEEKLYV`（中文横/竖）与 `HAMIWEEKLYEN` / `HAMIWEEKLYENV`（英文横/竖），改 `src/WeeklyCard.tsx` 顶部的 ZH / EN 内容常量（头条 / 数据 / 贡献者名单）后渲染：

```bash
cd video
npx remotion still src/index.ts HAMIWEEKLY    out/hami-weekly-<date>.png             --frame=120
npx remotion still src/index.ts HAMIWEEKLYV   out/hami-weekly-<date>-vertical.png    --frame=120
npx remotion still src/index.ts HAMIWEEKLYEN  out/hami-weekly-<date>-en.png          --frame=120
npx remotion still src/index.ts HAMIWEEKLYENV out/hami-weekly-<date>-en-vertical.png --frame=120
```

渲染结果以该期结束日期命名（中文 `2026-11-13.png` / `2026-11-13-vertical.png`，英文加 `-en` 后缀），提交到本分支 `community-weekly/images/` 目录。英文文案更长，渲染后注意检查换行与溢出。

## 正文结构（复制后填写）

```markdown
# HAMi 社区周报 · 第 {{期号}} 期

**{{起始日期}} ～ {{结束日期}}** ｜ 面向 HAMi 社区用户、爱好者与贡献者 ｜ 只记录本周已完成的事

> **本期一句话**：{{20～40 字，概括本周最重要的 1～3 件事}}

## 本周头条
<!-- 3～5 条，按重要性排序；每条 = 加粗标题 + 2～4 行说明；新项目开源/版本发布/社区活动/里程碑优先 -->

**1. {{头条标题}}**
{{发生了什么、谁做的、为什么重要、带数字}}

## 版本发布
- {{仓库 + 版本号 + 一句话说明}}（无则写"本周无版本发布"）

## 本周合入的重要改进（按贡献者）
<!-- 表格：贡献者 ｜ 仓库 ｜ 完成了什么；只列已合并；每人一行，重大贡献者注明 PR 数/提交数 -->

| 贡献者 | 仓库 | 完成了什么 |
|---|---|---|
| {{handle}}（{{数字}}） | {{仓库}} | {{一句话：做了什么、解决什么问题}} |

## 本周数据

| 指标 | 数值 |
|---|---|
| 有代码活动的仓库 | {{n}} / 30 |
| 代码提交 | {{n}} 次 |
| 合并 PR | {{n}} 个（约半数为依赖自动升级） |
| 关闭 / 新开 Issue | {{n}} / {{n}} |
| 参与贡献者 | {{n}}+ 位 |
| HAMi 主仓库 Star | {{n}} |

## 致谢
感谢 {{@handle 列表，按贡献量排序}} 等 {{n}} 余位贡献者，以及所有提交 issue、参与评审和讨论的社区伙伴。

## 了解更多
- 官网与文档：https://project-hami.io
- {{本周最值得放出的 2～3 个链接：新仓库、公告、幻灯片}}
- 本周报图片版（横版 / 竖版）随文发布，可直接转发社群
```

## 英文版

每期同步产出英文版 `YYYY-MM-DD.en.md`：结构与中文版一致，数据/链接/贡献者 GitHub ID 完全相同，只做语言转换（不是重写）。发布到 HAMi 的 LinkedIn 与 X（@ProjectHAMi）；帖子文案可在英文版"TL;DR"基础上压缩成 3～5 句。

## 发布渠道建议

- 中文版：官网博客 / 微信公众号 / 微信群 / Discord #announce
- 英文版：LinkedIn（Project-HAMi 主页）/ X（@ProjectHAMi），配英文横版图
- 图片版用于微信群、朋友圈、视频号等以图为主的渠道
