---
id: ADR-002
type: decision
status: accepted
version: 0.1
created: 2026-05-23
updated: 2026-05-23
supersedes: []
superseded_by: null
related:
  - ADR-001-tool-not-habit.md
  - ../02-features/F02-memory-strength.md
  - ../02-features/F04-knowledge-map.md
---

# ADR-002 · 用记忆强度替代 due date

## Context

[ADR-001](ADR-001-tool-not-habit.md) 确定了"工具而非习惯机器"。但这是一个方向性决策。当我们设计 SRS（间隔重复系统）时，遇到了一个具体的技术选择：

**传统 SRS（SuperMemo、Anki、Duolingo 等）的核心抽象是「到期日 / due date」**：
- 每张卡片有一个下次复习时间
- 到期 → 进复习队列
- 用户必须做完队列才"达成今日目标"

这个抽象自带几个问题：

1. **强加日节奏**：所有 due date 都按"天"为单位，迫使用户日复一日打开 app
2. **"过期"感**：用户看到"overdue by 5 days"会有亏欠感、压力感
3. **离散化失真**：到期日是离散的"是/否"，但记忆衰减本身是连续过程

### ADR-001 与 SRS 的冲突

我们说"工具不是习惯机器"，但如果保留 due date 框架，整个产品又会回到任务式（"今日需复习 X 张"）。

矛盾：**要做有效的间隔重复（科学）+ 不强加日节奏（产品哲学）**，这两个能否同时满足？

---

## Decision

**底层使用 FSRS 算法（科学），呈现层换为"记忆强度"连续模型（哲学）。**

具体：

1. **数据层**：保留 FSRS 完整状态（stability、difficulty、last_review、state）
2. **派生层**：定义 `memory_strength(card, now) ∈ [0, 100]` 纯函数，按遗忘曲线连续计算
3. **呈现层**：用户看到的是当下强度值 + 4 档状态（未学/学过/熟练/衰减中），不显示任何 due date 或 overdue
4. **推荐层**：用户主动点开"需要补强"时按 strength 排序展示，**绝不主动 push**

详细实现见 [`../02-features/F02-memory-strength.md`](../02-features/F02-memory-strength.md)。

---

## Consequences

### 好的

- **保留 SRS 科学性**：FSRS 算法被多项研究证明优于 SM-2，我们没放弃这部分
- **去除日节奏强制**：用户停一周回来，看到的是"很多节点强度低"（信息），而非"你欠了 50 张复习"（压力）
- **统一抽象**：节点强度、题目强度、推荐排序都用同一个连续函数
- **简化数据库**：不需要 cron job 更新所有用户的 due date，强度是请求时实时派生

### 坏的 / 取舍

- **失去"清空队列"的成就感**：有些用户喜欢"今天做完了所有该复习的"的明确感觉
- **新手难以理解**：用户不知道"现在该做什么"——这是有意的，但需要好的引导
- **推荐算法更复杂**：不能简单按 due date 排序，需要按"衰减斜率"等启发式
- **行业惯例不符**：与所有竞品对话困难（用户会问"什么时候该复习"）

### 中性

- 文档术语统一禁用 "due"、"overdue"、"expired"、"逾期"——见 [`../00-vision/glossary.md`](../00-vision/glossary.md) 反模式清单
- 需要培训用户："不是 app 告诉你今天做什么，是你看到状态自己决定做什么"

---

## Alternatives Considered

### 方案 A：完全套用 Anki 模式
- 每张卡片有 due date，到期进队列
- **否决**：与 ADR-001 冲突，会回到任务式

### 方案 B：保留 due date 但不显示
- 后台仍按 due date 调度，前台只显示"建议复习的卡片数"
- **否决**：换汤不换药，本质还是任务式；而且"建议数"会被用户解读为"任务"

### 方案 C：完全抛弃 SRS，用启发式（如按访问时间、错误率排序）
- **否决**：丢失 SRS 算法 50 年的科学积累；启发式很难做到 FSRS 的准确度

### 方案 D：用 due date，但叫做"建议复习时间"
- **否决**：术语换名字解决不了认知问题，"建议时间过了"和"逾期"在用户感受上一样

### 方案 E（采用）：FSRS 底层 + 连续强度上层
- 保留 SRS 完整科学性
- 上层抽象换为"状态描述"
- 同时满足两个目标

---

## References

- [Free Spaced Repetition Scheduler (FSRS)](https://github.com/open-spaced-repetition/fsrs4anki) — 算法和准确度研究
- [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) — TypeScript 实现
- Karpicke, J. D. (2008). *The critical importance of retrieval for learning* — 检索练习的科学基础
- [`ADR-001-tool-not-habit.md`](ADR-001-tool-not-habit.md) — 上游决策
- [`../02-features/F02-memory-strength.md`](../02-features/F02-memory-strength.md) — 此决策的实现细节
- 对话记录：用户提出"以用户真实的学习行为为依据"的反馈

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初版，确立强度模型 | — |
