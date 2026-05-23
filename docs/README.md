# Fast Memory · 项目文档

> 一个把碎片资料重构为可点亮知识网络的快速学习 Web App。当前首个内容域：中医学考试资料。

## 这是什么

这份文档体系记录这个项目的**所有设计决策、架构、功能、内容工程与进度**。它不是事后补的说明书，而是项目的「事实源（source of truth）」。每个开发环节都从这里出发，也回到这里更新。

## 怎么读这份文档

按角色选入口：

| 你是 | 从这里开始 |
|---|---|
| 第一次看到这个项目 | 本文件 → [`00-vision/product-philosophy.md`](00-vision/product-philosophy.md) → [`01-architecture/system-overview.md`](01-architecture/system-overview.md) |
| 要做某个功能 | [`02-features/_index.md`](02-features/_index.md) 找对应 F## 文档 |
| 要修改技术架构 | [`01-architecture/`](01-architecture/) + 写一份新 ADR |
| 要新增/修改内容（节点、题目） | [`03-content/content-pipeline.md`](03-content/content-pipeline.md) |
| 想知道当前进度 | [`05-progress/milestones.md`](05-progress/milestones.md) |
| 想理解某个奇怪的设计 | [`04-decisions/_index.md`](04-decisions/_index.md) 找对应 ADR |

## 怎么改这份文档

**核心原则：所有改动都留痕。**

1. **小改（typo / 措辞 / 补充示例）**：直接改，更新文档 frontmatter 的 `updated` 字段
2. **中改（新增章节 / 调整结构）**：更新 `version` 字段（次版本号 +1），在文档底部 Changelog 补一行
3. **大改（推翻设计 / 改变方向）**：
   - 把原文档状态改为 `revisiting`
   - 写一份新 ADR 记录决策过程
   - 在新文档的 frontmatter `supersedes` 字段引用被替代的文档
   - 不要直接删除旧文档——保留以便追溯

## 文档体系一览

```
docs/
├── README.md                          ← 你在这里
├── _meta/document-template.md         所有新文档的标准模板
│
├── 00-vision/                         不变层：哲学、原则、术语
├── 01-architecture/                   少变层：信息架构、数据模型、技术栈
├── 02-features/                       迭代单位：每个功能一份
├── 03-content/                        内容工程：从原始资料到结构化数据
├── 04-decisions/                      ADR：重要决策的不可变记录
└── 05-progress/                       里程碑 + 变更日志
```

## 文档之间怎么联动

每份文档头部有标准 frontmatter：

```yaml
---
id: F02                                 # 唯一编号
type: feature                           # vision | architecture | feature | decision | content | progress
status: draft                           # draft | agreed | in-progress | done | revisiting
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:                                # 相关文档（双向引用，互相补全）
  - ../01-architecture/data-model.md
depends_on:                             # 强依赖（被依赖文档变更需要同步评审）
  - F01-node-page.md
supersedes: []                          # 替代了哪些旧文档
---
```

改动任一份文档时：
1. 看本文档的 `depends_on`——下游文档需要同步评估
2. 看哪些文档在 `related` 里引用了本文档——上游文档需要通知
3. 状态字段必须更新

## 当前项目状态

- **阶段**：M0 文档体系搭建
- **下一里程碑**：M1 数据骨架 + 单节点页跑通
- 详见 [`05-progress/milestones.md`](05-progress/milestones.md)

## 写作风格约定

- 中文为主，技术术语保留英文
- 每份文档开头一句话定位
- 列表 + 表格 > 长段落
- 关键决策必须给出 *why*，不只是 *what*
- 不写未经决策的"将来打算"——那放在 `06-experiments/`（按需创建）

---

文档体系本身参考：[Diátaxis](https://diataxis.fr/) + [ADR](https://adr.github.io/) + [Architecture as Code](https://arc42.org/)。
