---
id: FEATURES-INDEX
type: feature
status: agreed
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - ../05-progress/milestones.md
depends_on: []
supersedes: []
---

# 功能矩阵

> 所有功能模块的目录、状态、优先级、依赖关系。每个功能一份 F## 文档。

## Why

功能是迭代单位。需要一个统一的目录回答：「这个功能存在吗？归谁做？什么状态？谁依赖它？」

---

## 当前功能清单

| ID | 名称 | 状态 | 优先级 | 里程碑 | 依赖 |
|---|---|---|---|---|---|
| F00 | 账户与认证 | agreed | P0 | M1 | — |
| [F01](F01-node-page.md) | 节点页 | draft | P0 | M1 | F00 |
| [F02](F02-memory-strength.md) | 记忆强度引擎 | draft | P0 | M2 | F00, F01 |
| [F03](F03-question-types.md) | 题型系统 | draft | P0 | M2 | F00, F01 |
| [F04](F04-knowledge-map.md) | 知识地图（主页） | draft | P1 | M3 | F00, F01, F02 |
| [F05](F05-active-recall.md) | 白纸召回 | draft | P2 | M3 | F03 |

**F00 账户与认证**没有独立的 F00 文档——设计完整在 [`../01-architecture/auth-and-account.md`](../01-architecture/auth-and-account.md)（基础设施性质，归属架构层），决策在 [`../04-decisions/ADR-004-email-magic-link-auth.md`](../04-decisions/ADR-004-email-magic-link-auth.md)。后续如有 UI 层细节再补 F00 文档。

### 状态说明

- **draft**：设计中，未达成共识
- **agreed**：设计已确认，可以开工
- **in-progress**：正在实现
- **done**：已上线
- **revisiting**：上线后被重新评估

### 优先级说明

- **P0**：MVP 必备，没有它产品不成立
- **P1**：MVP 强需求，但可以有降级版本
- **P2**：可以放到 MVP 后
- **P3**：未来探索

---

## 依赖图

```
F00 账户与认证（基础设施 · 所有用户数据的前提）
 │
 ▼
F01 节点页（核心抽象）
 ├── F02 记忆强度引擎（每个节点需要进度状态）
 │    └── F04 知识地图（用强度可视化）
 ├── F03 题型系统（节点页内嵌的测试）
 │    └── F05 白纸召回（题型系统的特殊形态）
 └── F04 知识地图（地图上的节点是 F01）
```

修改任一功能前，先看下游依赖：

- 改 F01 → 需要评估 F02/F03/F04 影响
- 改 F02 → 需要评估 F04 影响
- 改 F03 → 需要评估 F05 影响

---

## 未来功能（占位，尚未设计）

以下 ID 已预留，但文档未创建。新功能用下一个可用编号。

| ID | 候选名 | 简短想法 |
|---|---|---|
| F06 | 节点对比页 | 例：浙贝 vs 川贝、阴黄 vs 阳黄。当多节点共享模板时有价值。 |
| F07 | 学习路径推荐 | 基于用户当前掌握度推荐下一节点，但不强制 |
| F08 | 全局搜索 | FlexSearch + 节点/题目混合搜索 |
| F09 | 自定义节点笔记 | 用户在节点上写自己的笔记 |
| F10 | 导出 / 离线包 | 把已学节点导出 Markdown 或 Anki deck |
| F11 | 移动端 PWA 优化 | 手势、触控、离线 |

**这些条目不构成承诺**——是想法仓库。要做时升级为完整 F## 文档。

---

## 反功能清单（明确不做）

| 不做什么 | 理由 |
|---|---|
| 用户积分/等级/勋章 | 违反 [`../00-vision/design-principles.md`](../00-vision/design-principles.md) 原则 5 |
| Daily streak | 违反原则 2 |
| 社交 / 关注 / 评论 | 不符合工具定位 |
| 视频讲解 | 信息密度低于文字 + 表格 |
| AI 对话教师 | MVP 后探索，当前不引入额外复杂度 |
| 题目用户提交 / wiki 编辑 | 内容质量需要专业审校把关 |

---

## 功能文档写作规范

每份 F## 文档必须包含：

1. **frontmatter**（id / status / 依赖等）
2. **一句话定位**
3. **Why**：为什么需要这个功能
4. **用户行为**：用户能做什么、看到什么（不是工程实现，是行为描述）
5. **UI 结构**：文字版线框图
6. **数据依赖**：引用 [`../01-architecture/data-model.md`](../01-architecture/data-model.md) 中的具体字段
7. **验收标准**：可勾选的列表，定义"完成"
8. **反模式**：明确这个功能不做什么
9. **Open Questions**
10. **Changelog**

模板见 [`../_meta/document-template.md`](../_meta/document-template.md)。

## Open Questions

- [ ] F05 白纸召回的优先级要不要提到 P1？它是和多邻国/常规题库最差异化的功能点。
- [ ] 是否需要单独一份「F00 用户身份与认证」文档？目前简单 Auth.js 配置不够格独立文档化，但用户量上来后可能需要。

## Related Docs

- [`../05-progress/milestones.md`](../05-progress/milestones.md) — 里程碑包含哪些功能
- [`../01-architecture/data-model.md`](../01-architecture/data-model.md) — 所有功能依赖的数据契约

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.2 | 2026-05-23 | 加入 F00 账户与认证（设计文档在 auth-and-account.md） | — |
| 0.1 | 2026-05-23 | 初稿，立 F01-F05 五个核心功能 + 未来占位 | — |
