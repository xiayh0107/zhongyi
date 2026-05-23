---
id: PROGRESS-002
type: progress
status: in-progress
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - milestones.md
depends_on: []
supersedes: []
---

# 变更日志

> 项目级变更记录。每个重要事件一行。**这里写"项目层面发生了什么"，不是单文档的版本号**——文档自身的 changelog 在文档底部。

## Why

项目走过几个月后，团队会问："那个决策是什么时候做的？""那个功能是什么时候上线的？""那次重大改动的背景是什么？"

文档自身的 changelog 太分散，里程碑文档太宏观。需要一份**时间线**——一眼能看到项目演化的全貌。

参考格式：[Keep a Changelog](https://keepachangelog.com/)。

---

## 编写约定

- 倒序时间排列（最新在最上）
- 每个条目格式：`日期 · 类型 · 简短描述（≤ 80 字符）`
- 类型限定为：`docs` `decision` `feature` `content` `infra` `release` `pivot`
- 重要条目可加详细段落
- 不删除旧条目（追溯用）

---

## 2026

### 2026-05-23

#### 📝 docs · 项目文档体系建立

初始化 docs/ 目录，完成 M0 里程碑的核心交付：

- **vision 三件套**：product-philosophy、design-principles、glossary
- **架构四件套**：information-architecture、data-model、tech-stack、system-overview
- **5 个核心功能 (F01-F05)**：node-page、memory-strength、question-types、knowledge-map、active-recall
- **内容工程**：content-pipeline + node-catalog
- **3 个 ADR**：tool-not-habit、state-not-task、markdown-as-content-store
- **进度跟踪**：milestones + 本文档

#### 🎯 decision · ADR-001 工具而非习惯机器

确立产品定位为"工具"，不走多邻国式习惯养成路径。明确不做 streak/勋章/排行榜/daily goal。

**背景**：与用户的早期讨论中明确目标用户是自带动机的应试者、临床者、兴趣者；游戏化反而稀释严肃感。

#### 🎯 decision · ADR-002 用记忆强度替代 due date

底层保留 FSRS 算法（科学），上层呈现改为连续记忆强度（哲学）。彻底去除"过期/逾期/今日复习"等任务式概念。

#### 🎯 decision · ADR-003 内容用 Markdown + Git

不用 CMS、不用数据库存内容。所有节点和题目用 Markdown / JSON 文件，Git 版本管理，LLM 直接生成 PR。

#### 🏛 docs · 5 层信息架构确立

把原始中医资料拆解为 L1 世界观 / L2 实体 / L3 关系 / L4 事实 / L5 应用 五层。每层对应不同学习模式。

#### 📋 content · 30 个 MVP 节点清单确立

确定第一批节点：4 个 L1 + 5 五脏 + 3 六腑 + 3 气血津液 + 6 六淫 + 2 八纲 + 2 关系 + 4 要药 + 1 经穴。预估覆盖原资料 60% 题目。

---

## 早期里程碑（追溯）

### 2026-05-23 · 早期 · 产品方向确立

通过 5 轮对话明确产品方向：

1. **第 1 轮**：用户问"24h 内如何快速记忆这份资料" → 探索学习方法论
2. **第 2 轮**：用户澄清"探索高效记忆路径" → 信息架构 × 记忆机制分析
3. **第 3 轮**：用户透露在做 web app → 产品定位讨论（差异化、多邻国借鉴/不借鉴、视觉化机会）
4. **第 4 轮**：用户决定先做文字版 → 数据模型 + UI 结构具体化
5. **第 5 轮**：用户提出"不要强加时间尺度" → 状态而非任务的根本转变（→ ADR-002）
6. **第 6 轮**：用户要求落地文档 → M0 启动

这次对话直接产生了 [ADR-001](../04-decisions/ADR-001-tool-not-habit.md) 和 [ADR-002](../04-decisions/ADR-002-state-not-task.md) 的核心论证。

---

## 模板：如何添加新条目

```markdown
### YYYY-MM-DD

#### {emoji} {type} · {简短标题}

可选的详细段落（< 200 字）。如果是重要决策，引用对应 ADR。
```

### 类型 emoji 对照

| 类型 | emoji | 用法 |
|---|---|---|
| docs | 📝 | 文档新增/重大修改 |
| decision | 🎯 | 重要决策（通常配 ADR） |
| feature | ✨ | 功能上线 |
| fix | 🐛 | 错误修复 |
| content | 📋 | 内容新增/更新 |
| infra | 🏗 | 基础设施变更 |
| release | 🚀 | 发布版本 |
| pivot | 🔄 | 方向调整 |
| arch | 🏛 | 架构变更 |

## Related Docs

- [`milestones.md`](milestones.md) — 里程碑级目标
- 各文档底部的 changelog 表 — 单文档版本变更

## Changelog (本文档自身)

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初稿，建立变更日志体系 + M0 初始条目 | — |
