---
id: ADR-INDEX
type: decision
status: agreed
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related: []
depends_on: []
supersedes: []
---

# 架构决策记录（ADR）索引

> 每个重要决策一份 ADR。**ADR 一旦写入即不可变**——被推翻时写新 ADR 引用旧的，不修改旧文档。

## Why ADR

每个项目都积累了大量"我们当时为什么这么决定"的隐性知识。这些知识在团队成员变动时会丢失，导致后人重蹈覆辙或推翻已有共识。

ADR 是把决策**固化为可追溯记录**的标准格式。它不是文档，是**决策的化石**。

参考：[Architecture Decision Records](https://adr.github.io/)

---

## ADR 列表

| 编号 | 决策 | 状态 | 关键影响 |
|---|---|---|---|
| [ADR-001](ADR-001-tool-not-habit.md) | 工具而非习惯机器 | accepted | 全产品方向 |
| [ADR-002](ADR-002-state-not-task.md) | 用记忆强度替代 due date | accepted | F02, F04 设计基础 |
| [ADR-003](ADR-003-markdown-as-content-store.md) | 内容用 Markdown 文件 + Git | accepted | 整个内容工程流程 |
| [ADR-004](ADR-004-email-magic-link-auth.md) | 用 Email Magic Link 作为认证方式 | accepted | 账户系统设计 |
| [ADR-005](ADR-005-variant-a-as-mvp.md) | 变体 A "含蓄专业" 作为 MVP | accepted | 整体视觉方向；B 留作未来皮肤 |

---

## ADR 状态说明

- **proposed**：决策已提出，未达成共识
- **accepted**：决策已采用，作为当前架构依据
- **deprecated**：决策已被替代，但保留以备追溯
- **superseded by ADR-XXX**：已被另一份 ADR 替代

---

## 何时写新 ADR

满足以下任一条件时**必须**写：

1. 推翻已有架构层决策
2. 引入新的核心技术（如换数据库、换算法）
3. 改变 [`../00-vision/`](../00-vision/) 中的任一原则
4. 跨多个功能的改动（影响 ≥ 3 个 F##）
5. 引入会显著影响用户体验的重大改变

满足以下条件**应该**写：

- 团队内有争议，需要记录权衡过程
- 决策依据是"非显而易见"的（仅看代码看不出为什么）
- 否决了一个看起来合理的选项（解释 why not）

不需要 ADR：

- 代码风格、命名约定（写到 CONTRIBUTING.md）
- 单功能内部的细节（写到对应 F## 文档）
- 临时实验决策（实验文档在 `06-experiments/`）

---

## ADR 模板

```markdown
---
id: ADR-XXX
type: decision
status: proposed   # proposed | accepted | deprecated | superseded
version: 0.1
created: YYYY-MM-DD
updated: YYYY-MM-DD
supersedes: []
superseded_by: null
---

# ADR-XXX · {{决策标题}}

## Context（背景）

为什么需要这个决策？当下面临什么问题？

## Decision（决策）

我们决定 X，而不是 Y 或 Z。

## Consequences（后果）

**好的**：
- ...

**坏的 / 取舍**：
- ...

**中性**：
- ...

## Alternatives Considered（考虑过的方案）

- **方案 A**：（描述）→ 否决，因为 ...
- **方案 B**：（描述）→ 否决，因为 ...

## References（参考）

链接 / 文献 / 相关讨论

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | YYYY-MM-DD | 初稿 | — |
```

---

## ADR 编号规则

- 简单递增整数，4 位填充：ADR-001、ADR-002...
- 一旦分配，不复用（即使该 ADR 被废弃）
- 文件名格式：`ADR-XXX-kebab-case-title.md`

## Open Questions

- [ ] 是否需要"半正式"ADR（重要但快速决策）？目前所有 ADR 都走完整模板，可能拖慢决策。考虑加 lightweight ADR 模板。

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初稿，创建 ADR 体系 | — |
