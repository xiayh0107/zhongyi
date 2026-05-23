---
id: TEMPLATE
type: meta
status: done
version: 1.0
created: 2026-05-23
updated: 2026-05-23
related: []
depends_on: []
supersedes: []
---

# {{文档标题}}

> 一句话定位——这份文档是什么、解决什么问题。

## 背景 / Why

为什么需要这份文档？不写这个 → 项目会出什么问题？

## 内容主体

按文档类型选择结构：

### 如果是 vision 类
- 立场陈述
- 反模式（不做什么）
- 边界

### 如果是 architecture 类
- 结构图 / 数据流
- 关键抽象
- 约束

### 如果是 feature 类（F##）
- 用户行为（用户做什么、看到什么）
- UI 结构（文字版线框图）
- 数据依赖（引用 data-model）
- 验收标准（明确的、可勾选的列表）
- 反模式（明确不做什么）

### 如果是 decision 类（ADR）
- Context（背景）
- Decision（决策）
- Consequences（后果，包括负面）
- Alternatives considered（考虑过的其他方案）

### 如果是 content 类
- 数据来源
- 处理流程
- 校验规则

## Open Questions

未决问题列表，每条带责任人和决策截止时间（如有）：

- [ ] 问题 1 — owner: TBD
- [ ] 问题 2 — owner: TBD

## Related Docs

显式列出强相关文档，方便阅读时跳转。frontmatter 的 `related` 是机器可读，这里是人类可读。

- [`xxx.md`](../xxx/xxx.md) — 一句话说明为什么相关

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初稿 | — |
