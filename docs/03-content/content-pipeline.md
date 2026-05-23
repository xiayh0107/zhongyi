---
id: CONTENT-001
type: content
status: agreed
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - node-catalog.md
  - ../01-architecture/information-architecture.md
  - ../01-architecture/data-model.md
depends_on:
  - ../01-architecture/data-model.md
  - ../01-architecture/information-architecture.md
supersedes: []
---

# 内容工程流程

> 从原始资料（中医.docx）到结构化节点 + 题目的完整流程。**人 + LLM 协作，每一步都有审校把关。**

## Why

内容是这个产品的核心资产。质量决定一切。但纯人工生产 200 节点 + 1000 题工作量太大；纯 LLM 生产质量不稳定。需要一套**半自动 + 强审校**的流程，明确每一步的输入输出和责任归属。

---

## 流程总览

```
原始资料 (docx)
    │
    ▼
[1] 资料预处理            人工 + 脚本
    │   docx → 纯文本 / markdown
    │   切分章节、识别题型
    │
    ▼
[2] 节点抽取              LLM + 人审
    │   从原文识别概念节点
    │   按 schema 生成 frontmatter + body
    │   状态: draft
    │
    ▼
[3] 题目挂载              LLM + 人审
    │   原题库 → 结构化 Question
    │   每道题挂载到节点
    │   状态: draft → reviewed
    │
    ▼
[4] 关系标注              人工为主
    │   节点之间的 relations 字段
    │   双向链接 [[wiki-link]]
    │
    ▼
[5] 模板填充              LLM + 人审
    │   L2 节点的 template 字段
    │   L5 的 recall_keypoints
    │
    ▼
[6] 校验 + 构建            脚本
    │   validate-content.ts
    │   build-graph.ts
    │
    ▼
content/.build/  →  部署
```

---

## 各阶段详细

### [1] 资料预处理

**输入**：`中医.docx`（238KB，~1730 行，~37000 字）

**步骤**：
1. `pandoc -t plain 中医.docx > raw.txt` 转纯文本
2. 人工切分：按"单选 / 多选 / 简答&名词解释"三大块
3. 给每道题打上原始编号（如 `单选-7`、`多选-23`、`简答-9`），用于追溯

**输出**：
- `content/source/raw.md`（人类可读）
- `content/source/raw-tagged.json`（脚本可读，每题有原始编号 + 行号）

**人工工作量**：~1 小时
**LLM 工作量**：仅作分类辅助

---

### [2] 节点抽取

**目标**：识别原文中的概念节点（不是题目），按 5 层架构归类。

**过程**：

1. **第一遍：LLM 扫描**
   - prompt：「从这份资料中识别所有可作为独立学习节点的概念，按 L1-L5 分层。每个节点输出 id、title、layer、source line。」
   - 模型：Claude Opus / GPT-4 级别
   - 输出：节点候选清单（JSON）

2. **第二遍：人工审核清单**
   - 砍掉太细 / 太粗的节点
   - 合并重复
   - 补充 LLM 漏掉的
   - 确认 30-50 个 MVP 优先节点

3. **第三遍：LLM 生成节点文件**
   - 对每个确认的节点，LLM 从原文抽取相关内容，生成 markdown
   - prompt 模板见下文「Prompt 库」
   - 输出：`content/nodes/{layer}/{category}/{id}.md`（status: draft）

4. **第四遍：人工审校**
   - 读 markdown，对比原文，校正
   - 改 status: reviewed

**校验**：
- 每个节点必须有 summary、body
- L2 节点必须有 template
- source.lines 必须能在 raw 中找到对应内容

**人工工作量**：约 10-15 分钟/节点 → 30 节点 = 5-7 小时
**LLM 工作量**：每节点约 30-60 秒生成

---

### [3] 题目挂载

**目标**：把原题库 ~440 题转成结构化 Question，每道挂到一个或多个节点。

**过程**：

1. **批量结构化**
   - LLM 一次处理 10-20 道题
   - 输入：原文题目 + 已有节点清单
   - 输出：`Question` JSON（含 type、stem、options、answer、why、node_ids、source）
   - 关键：让 LLM 自动判断 type（多数原文已分类）

2. **题型再分配**
   - 原资料只分了单选/多选/简答。一道单选可改写为 fill_in_blank 来增加检索强度
   - LLM 建议：对于"X 在志为？"类的低线索问题，生成两个 Question（一个 single_choice、一个 fill_in_blank）

3. **节点挂载**
   - LLM 根据 stem 内容判断挂载节点
   - 例："肝在志为？" → 挂 `liver`
   - 例："心肾不交怎么治" → 挂 `heart`, `kidney`, `heart-kidney-不交`, `huanglian-ejiao-tang`

4. **人工审校**
   - 抽查约 20%
   - 修正错误挂载
   - 改善 why（必须有解析）

**质量门槛**：
- 没有 why 不能上线
- node_ids 至少 1 个
- answer 必须能根据 options 验证

**人工工作量**：~5 秒/题审查 + 1-2 分/题修正 → 440 题 ≈ 3-5 小时

---

### [4] 关系标注

**目标**：节点之间的 relations 字段 + body 中的 [[wiki-link]]。

**过程**：

1. **LLM 第一遍**
   - 对每个节点，扫描 body，建议可链接到的其他节点
   - 输出：建议链接清单

2. **人工补充关系**
   - 标准化关系类型（`paired_with`、`generates` 等，详见 [`../01-architecture/information-architecture.md`](../01-architecture/information-architecture.md)）
   - 中医知识图的「相生相克」「相表里」由人工显式填写
   - body 中的 wiki-link 由人工或脚本插入

3. **校验**
   - 所有 [[wiki-link]] 目标必须存在
   - relations[].target 必须存在
   - 不能有重复

**这一步偏人工**——LLM 难以一致地识别关系类型。

**人工工作量**：每节点 5-10 分钟 → 30 节点 = 2-5 小时

---

### [5] 模板填充

**目标**：L2 节点的 template 字段 + 所有节点的 recall_keypoints。

**过程**：

1. **L2 模板填充**（LLM 高准确率）
   - 五脏 / 六腑 / 六淫 / 单味药 / 方剂 等都有标准模板
   - LLM 一次扫描多个节点，按 schema 填入

2. **recall_keypoints 抽取**（LLM + 人审）
   - LLM prompt：「从这个节点的 body 中抽取所有可独立召回的知识点，分 required（核心）和 optional（额外）。每个 keypoint 列出常见 aliases。」
   - 输出粒度建议：每个 L2 节点 10-20 个 required + 5-10 个 optional

3. **人工审校**
   - 颗粒度调整（不要太细如"主"、不要太粗如"很多功能"）
   - 增删 aliases

**人工工作量**：每节点 5-10 分钟 → 30 节点 = 2-5 小时

---

### [6] 校验 + 构建

**自动化**：

```bash
pnpm content:validate     # 跑 scripts/validate-content.ts
pnpm content:build        # 跑 scripts/build-graph.ts，输出 .build/
```

校验失败 → 阻止部署。详见 [`../01-architecture/data-model.md`](../01-architecture/data-model.md) 的"校验规则"。

---

## Prompt 库

存放在 `scripts/prompts/`，版本管理。

### prompts/extract-nodes.md
```
你是一位中医知识工程师。

任务：从以下中医资料中识别所有可作为独立学习节点的概念。

【信息架构 5 层】
L1 世界观：阴阳五行、整体观、辨证论治
L2 实体：五脏六腑、气血津液、六淫七情、经络
L3 关系：脏腑相生相克、相表里、精血同源等
L4 事实：要药、要穴、方剂、舌脉对应
L5 应用：病-证-方推理链

【节点粒度规则】
- 一个节点的"讲解 + 5 题测试" ≤ 10 分钟
- 一个节点能被一段 200 字 + 一张表覆盖

【输出格式】
JSON 数组，每项:
{
  "id": "kebab-case-or-pinyin",
  "title": "中文名",
  "layer": "L2",
  "category": "zang-fu",
  "source_lines": [232, 597],
  "rationale": "为什么这是独立节点"
}

【资料】
{{raw_text}}
```

### prompts/generate-node.md
```
为节点「{{title}}」生成 markdown 文件。

【数据源】（来自原资料对应行号）
{{source_excerpt}}

【输出要求】
1. frontmatter 完整 (id, title, layer, summary, template if L2)
2. body 用 markdown
3. 不臆造内容，只用数据源中的事实
4. summary ≤ 30 字
5. 概念中可链接的用 [[other-node-id]] 标记

【模板示例】
{{template_example}}
```

### prompts/structure-questions.md
（类似上面，详见 `scripts/prompts/structure-questions.md`，篇幅省略）

---

## 进度跟踪

每个节点在 [`node-catalog.md`](node-catalog.md) 中有一行：

| 节点 ID | 层 | 状态 | 题目数 | 责任人 |
|---|---|---|---|---|
| liver | L2 | reviewed | 12 | — |
| spleen | L2 | draft | 0 | — |
| wind-evil | L2 | generated | 5 | — |

状态流转：
```
未做 → generated（LLM 生成）→ reviewed（人审完）→ live（部署上线）
                              ↘ rejected（推翻重做）
```

---

## 工作量估算（30 节点 MVP）

| 阶段 | 人工时长 | LLM 调用 |
|---|---|---|
| 1. 资料预处理 | 1h | 少量 |
| 2. 节点抽取 | 5-7h | ~50 次 |
| 3. 题目挂载 | 3-5h | ~50 次（每次 10 题） |
| 4. 关系标注 | 2-5h | 少量 |
| 5. 模板填充 | 2-5h | ~30 次 |
| 6. 校验构建 | 0.5h | — |
| **合计** | **14-23h** | **~130 次** |

按 LLM API 价格估算 < $20 一次性内容投入。**核心瓶颈在人审时间**。

---

## 内容更新

MVP 上线后内容更新的策略：

1. **错误修正**：直接改 markdown → 重新构建 → 部署。已学过该节点的用户记忆不重置。
2. **新增节点**：按上述流程跑一遍。
3. **节点拆分 / 合并**：罕见但需要谨慎。涉及 progress 表的迁移：
   - 拆分：原节点的 progress 复制到所有子节点
   - 合并：取最高 strength 作为合并后节点的初始值
4. **节点删除**：先 deprecate（保留页面，标记"已废弃"），不立即删除。用户的 progress 标记为不活跃。

迁移逻辑实现在 `scripts/migrate-content.ts`。

## Open Questions

- [ ] LLM 输出的事实性错误如何系统性发现？人审是兜底，但能否上游加自动核对（例如把 LLM 输出与原文做差异比对）？
- [ ] 节点 id 用 kebab-case 英文（`liver`）还是拼音（`gan`）还是混合（`gan-zang`）？倾向于英文为主，无明确英译时用拼音。
- [ ] 是否所有题目的 source 行号都要 100% 准确？这影响追溯能力但增加审校成本。

## Related Docs

- [`node-catalog.md`](node-catalog.md) — 节点清单 + 状态跟踪
- [`../01-architecture/data-model.md`](../01-architecture/data-model.md) — 节点和题目的 schema
- [`../01-architecture/information-architecture.md`](../01-architecture/information-architecture.md) — 节点分层规则

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初稿，确立 6 步流程 + Prompt 库结构 | — |
