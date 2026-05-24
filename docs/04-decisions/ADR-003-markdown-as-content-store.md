---
id: ADR-003
type: decision
status: accepted
version: 0.1
created: 2026-05-23
updated: 2026-05-23
supersedes: []
superseded_by: null
related:
  - ../01-architecture/data-model.md
  - ../01-architecture/tech-stack.md
  - ../03-content/content-pipeline.md
---

# ADR-003 · 内容用 Markdown 文件 + Git，不用 CMS / 数据库

## Context

学习类产品的核心资产是**内容**（节点讲解 + 题目）。这些内容如何存储是一个早期但重大的架构决策。

主流方案：

1. **CMS（Strapi / Sanity / Contentful）**：可视化后台，结构化数据库
2. **数据库直存**（Postgres + 管理面板）
3. **Markdown 文件 + Git**（Astro / Hugo / Eleventy 等静态站点常用）
4. **Headless CMS + 自定义后台**

每种方案都有合理性。但选择决定了：
- 谁能编辑（编辑技能门槛）
- 如何审校（流程）
- 如何回滚（错误恢复）
- 如何集成 LLM（自动化生产）
- 性能特征（构建 vs 实时查询）

---

## Decision

**采用方案 3：Markdown 文件（含 frontmatter）+ Git 版本管理。**

具体：

- 节点内容存 `content/nodes/**/*.md`
- 题目存 `content/questions/*.json`（结构化，按领域拆分）
- 用户数据（progress、attempts）仍用数据库（SQLite/PostgreSQL）
- 构建期把 Markdown 转成派生数据（图谱、搜索索引），输出到 `content/.build/`

详见 [`../01-architecture/data-model.md`](../01-architecture/data-model.md)。

---

## Consequences

### 好的

- **Git 版本管理免费获得**：每次内容变更 = 一个 commit，diff 清晰，可回滚
- **审校流程标准化**：用 PR 流程审校内容，与代码审校工具链统一
- **LLM 生成的内容直接生成 PR**：不需要 CMS 中间层
- **编辑工具自由**：审校者用 VS Code / Obsidian / 任意编辑器
- **零成本部署**：构建期一次性处理，运行期纯静态读取
- **离线/迁移容易**：所有内容是文件，复制走即可
- **简化基础设施**：少一个 CMS 系统，少一套管理后台

### 坏的 / 取舍

- **非技术编辑者门槛**：让纯中医专家不学 Git 直接编辑，困难
  - **缓解**：MVP 阶段审校者就是技术成员；后期可加 web 编辑器层（仍写入 Markdown）
- **构建期成本**：每次内容变更需要重新构建
  - **缓解**：MVP <500 节点，构建 <5s 可接受；可做增量构建
- **结构化校验靠 schema**：不像 CMS 自带强制 schema
  - **缓解**：frontmatter schema + CI 校验脚本，效果相当
- **题目用 JSON 而非 Markdown**：是次优解（题目是结构化数据，不是文本），但 JSON 比 Markdown 更适合结构化
  - **缓解**：用 YAML 也行，看团队偏好

### 中性

- 不能在生产环境直接编辑内容——必须走构建流程
- 用户提交修正建议的流程是"提 PR / issue"，不是"在 app 内编辑"

---

## Alternatives Considered

### 方案 A：Strapi / Sanity 类 CMS
- 可视化后台 + 结构化数据库
- 优点：非技术编辑友好
- **否决**：
  - 引入额外系统（部署、维护、安全）
  - 与 Git/LLM 工作流脱节
  - 大材小用——我们的内容结构简单且不需要实时编辑

### 方案 B：所有内容入 Postgres
- 内容和用户数据同一个数据库
- **否决**：
  - 失去 Git 版本管理
  - 数据库 schema 变更 = 内容 schema 变更，迁移成本高
  - 不能用文本工具批量处理

### 方案 C：MDX（Markdown + JSX）
- 允许在 Markdown 中嵌入 React 组件
- **否决**（部分否决）：
  - MVP 不需要嵌入组件
  - 增加复杂度（解析、构建、安全）
  - 将来需要时可升级到 MDX，迁移成本低

### 方案 D：Headless CMS（如 Tina CMS）
- 编辑层是 web 界面，存储仍是 Git Markdown
- **暂缓**：是好选择但 MVP 不需要；可作为 V2 升级路径

### 方案 E（采用）：纯 Markdown + Git
- 简单、Git 原生、LLM 友好

---

## 迁移路径

如果将来需要切换：

| 迁移目标 | 难度 | 触发条件 |
|---|---|---|
| → MDX | 极低 | 需要嵌入交互组件 |
| → Headless CMS (Tina) | 中 | 非技术编辑者增多 |
| → 完整 CMS（Sanity） | 高 | 内容协作者 >10 人，需要工作流 |
| → 数据库 | 极高 | 不太可能，丢失太多优势 |

**关键属性**：Markdown 是无损格式。从 Markdown 迁出容易，迁入难。先用最简的，复杂度按需引入。

---

## References

- [`../01-architecture/data-model.md`](../01-architecture/data-model.md) — Markdown 文件的 schema 细节
- [`../01-architecture/tech-stack.md`](../01-architecture/tech-stack.md) — 配套技术（gray-matter、remark）
- [`../03-content/content-pipeline.md`](../03-content/content-pipeline.md) — 内容生产流程
- [Andy Matuschak's Working Notes](https://notes.andymatuschak.org/) — Markdown + 双向链接的成功实践
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) — 同模式的 schema 校验参考

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初版，确立 Markdown + Git 方案 | — |
