---
id: ADR-005
type: decision
status: accepted
version: 0.1
created: 2026-05-23
updated: 2026-05-23
supersedes: []
superseded_by: null
related:
  - ../../design/REVIEW.md
  - ../_meta/design-brief.md
---

# ADR-005 · 变体 A "含蓄专业" 作为 MVP 视觉方向

## Context

[M0.5 首轮设计交付](../05-progress/milestones.md) 探索了两个视觉方向：

- **变体 A · 含蓄专业**：现代克制、标题宋体 + 正文黑体、松绿 accent、暖米黄底
- **变体 B · 古典书页**：典籍感、全宋体、朱砂 accent、宣纸底、竖向中文标签、中文数字

两者**共享设计 tokens 结构和组件 API**，但视觉调性截然不同。详细对比在 [`/design/REVIEW.md`](../../design/REVIEW.md) 第 4 节。

MVP 上线必须确定一个主线方向——影响开发实现、品牌定位、用户首次印象。

---

## Decision

**MVP 采用变体 A（含蓄专业）。变体 B 暂不实现，但保留在代码中作为未来"古籍主题"皮肤选项。**

---

## Consequences

### 好的

- **聚焦目标用户**：A 的"专业工具"调性匹配应试者、临床执业者的严肃语境
- **阅读效率高**：标题宋 + 正文黑的搭配是中文长时间阅读的黄金组合
- **扩展性强**：A 的视觉风格对内容域中性，未来扩展到其他考试 / 学科不冲突
- **实现成本低**：装饰元素少、字体加载量小、无竖向标签等特殊布局
- **降低 MVP 风险**：A 是更"保守"的选择——先证明产品价值，再做品牌包装

### 坏的 / 取舍

- **文化辨识度较弱**：相比 B，A 的"中医感"不强，可能在同类工具中区分度较弱
  - **缓解**：将来开放 B 作为主题选项，让喜欢古籍风的用户切换
- **失去 B 的独特品牌锚点**：朱砂印章、宣纸底色这些视觉标签是辨识度极强的
  - **缓解**：tokens 已支持运行时切换，B 的代码保留，不丢失
- **设计师的 B 工作未直接用上**：但是不浪费——B 是有价值的探索，验证了 brief 的灵活性

### 中性

- 不需要立即决定 B 何时上线——观察 MVP 的用户反馈再决定
- tokens.jsx 中的 B 色板保留，但 MVP 阶段不暴露给用户

---

## Alternatives Considered

### 方案 A（采用）：变体 A 为主，B 保留代码
- 详见上文

### 方案 B：变体 B 作为 MVP
- **否决理由**：
  - 部分装饰是纯美学（竖向标签、印章），与设计原则 6（视觉化是增量）部分冲突
  - 全宋体长时间阅读疲劳风险待验证，MVP 阶段不宜冒险
  - 文化风格强势，未来扩展到其他内容域时需要重做视觉

### 方案 C：两者并行作为用户选项
- **否决理由**：
  - 两套主题的细节维护成本高（每次新组件要做两版）
  - MVP 阶段优先级是"证明产品"，不是"主题丰富"
  - 用户在 onboarding 阶段被迫做选择是摩擦

### 方案 D：混合 A 和 B 的元素
- **否决理由**：
  - 调性混杂容易"四不像"
  - 两位设计师的探索分别完整，强行融合会破坏各自的视觉一致性
  - 增加决策成本

---

## Implementation Notes

### MVP 直接使用

- `design/tokens.jsx` 的 `TOKENS.A` 部分
- `design/design-system.jsx` 中所有共用组件（PrimaryBtn 等）
- `design/a-home.jsx`、`a-node.jsx`、`a-quiz.jsx` 作为页面实现参考

### 代码中如何对待 B

- **保留**：`TOKENS.B`、`design/b-*.jsx` 文件不删
- **不暴露**：MVP 用户设置中**不提供变体切换**
- **未来路径**：当决定上线"古籍主题"皮肤时，在 user.prefersTheme 加 'classical' 选项

### 设计补稿（基于 A）

- F00 登录页（M1 必须）—— 让设计师按 A 风格补
- F05 白纸召回（M3）
- 空状态 / 加载态 / 错误态

---

## References

- [`/design/REVIEW.md`](../../design/REVIEW.md) — 完整评审 + 变体对比
- [`/design/README.md`](../../design/README.md) — 设计稿入口
- [`../_meta/design-brief.md`](../_meta/design-brief.md) — 评审依据
- [`ADR-001-tool-not-habit.md`](ADR-001-tool-not-habit.md) — 产品定位决定了 A 的"专业"调性更契合
- 对话记录：用户在 review 后明确选 A

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初版，确立变体 A 为 MVP；B 留作未来皮肤 | — |
