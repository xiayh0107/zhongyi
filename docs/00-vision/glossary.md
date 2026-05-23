---
id: VISION-003
type: vision
status: agreed
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - ../01-architecture/information-architecture.md
  - ../01-architecture/data-model.md
depends_on: []
supersedes: []
---

# 术语表

> 项目中所有非通用术语的统一定义。文档中使用术语时**必须按此定义**，避免「同名不同义」。

## 知识结构术语

### 节点（Node）
学习的最小单位。一个原子概念（如「肝」「风邪」「附子」）。每个节点对应 app 中的一个页面，包含讲解、模板属性、关联节点和检索题目。详见 [`../01-architecture/information-architecture.md`](../01-architecture/information-architecture.md)。

### 模板（Template）
节点的结构化属性集合。例如五脏节点的模板属性为「五行/在志/在液/在体/其华/开窍/相表里」7 个字段。模板让同类节点的对比和检索成为可能。

### 层（Layer）
节点在信息架构中的层级。共 5 层：
- **L1 世界观**：阴阳、五行、整体观、辨证论治
- **L2 实体**：五脏、六腑、气血津液、六淫等
- **L3 关系**：脏腑相生相克、相表里等
- **L4 事实**：要药、要穴、方剂、舌脉
- **L5 应用**：病-证-方推理链

### 边 / 关系（Edge / Relation）
节点之间的连接。带类型（如 `相表里`、`相生`、`治疗`、`包含`）。

### 知识地图（Knowledge Map）
用户视角的节点全集 + 当前掌握状态的可视化。**不等于**后台的知识图（Knowledge Graph）——前者是 UI 呈现，后者是数据结构。

---

## 学习与记忆术语

### 记忆强度（Memory Strength）
每个用户在每个节点上的连续值（0-100），随时间按遗忘曲线衰减，每次成功检索会提升。**取代「due date / 到期」概念**——本产品不使用"过期"框架。

### 主动检索（Active Recall）
用户从大脑中提取信息的过程，对应「答题」「白纸召回」等动作。区别于「被动阅读」（看讲解）。

### 白纸召回（Blank-page Recall）
检索的最强形式：给一个概念名（如"肝"），用户在空白文本框中写出所有能想起来的属性，系统对比模板给反馈。

### 检索练习（Retrieval Practice）
学界术语，泛指任何形式的主动检索（含答题、白纸召回、教别人等）。本文档中与「主动检索」互用。

### SRS / 间隔重复（Spaced Repetition System）
按记忆衰减曲线安排复习的算法体系。本产品使用 **FSRS** 算法（Free Spaced Repetition Scheduler），不使用 SuperMemo SM-2。详见 [`../02-features/F02-memory-strength.md`](../02-features/F02-memory-strength.md)。

### 状态档位（Mastery Tier）
节点掌握度的离散分类（4 档）：
- **未学**（untouched）：用户从未访问
- **学过**（learned）：访问过但记忆强度 ≥ 60
- **熟练**（mastered）：记忆强度 ≥ 85 且至少 3 次成功检索
- **衰减中**（fading）：曾达到 学过/熟练，但记忆强度 < 60

注意：这 4 档是**呈现层**的简化。底层数据是连续记忆强度值。

---

## 内容工程术语

### 原始资料（Source Material）
用户提供的未结构化文档（当前为「中医.docx」）。

### 结构化节点（Structured Node）
从原始资料抽取并按 schema 整理后的节点数据（Markdown + frontmatter）。

### 题目挂载（Question Mounting）
把一道题关联到一个或多个节点的过程。一题可挂多节点。

### 内容审校（Content Review）
LLM 生成的结构化内容必须经过人工审校才能上线。审校状态在 [`../03-content/node-catalog.md`](../03-content/node-catalog.md) 跟踪。

---

## 文档体系术语

### ADR（Architecture Decision Record）
架构决策记录。每个重要决策一份。**不可变**——决策被推翻时写新 ADR、引用旧 ADR，不修改旧文档。

### Frontmatter
每份文档头部的 YAML 元数据块。包含 id / type / status / version / created / updated / related / depends_on / supersedes 字段。

### 文档状态（Doc Status）
- **draft**：草稿，未达成共识
- **agreed**：已确认，可作为设计依据
- **in-progress**：对应的实现正在进行
- **done**：对应实现已完成
- **revisiting**：正在被重新审视（可能很快被新 ADR 替代）

---

## 用户与目标

### 应试者（Exam Taker）
首要用户群。医学院学生、执业考试备考者。

### 维护型用户（Maintenance User）
非应试场景下定期回来巩固/查阅的用户。冲刺型 / 维护型是用户**模式**而非用户**类型**——同一用户在不同时期可能切换。

### 北极星指标（North Star Metric）
单一最重要指标：**用户在需要时打开 app，能在 5 分钟内开始有效检索练习**。详见 [`product-philosophy.md`](product-philosophy.md)。

---

## 反模式（明确不用的词）

以下术语在本项目中**禁止使用**或**仅在反例中出现**，避免设计漂移：

- ❌ "Daily streak" / "连续打卡"
- ❌ "每日目标" / "Daily goal"
- ❌ "任务" / "Tasks"（指代用户学习行为时；UI 内的开发任务可以用）
- ❌ "完成度" / "Completion rate"（暗示有终点）
- ❌ "Due date" / "到期"（用「记忆强度」替代）
- ❌ "关卡" / "Level"（用「节点」替代）
- ❌ "等级 / 段位 / 经验值"

## Open Questions

- [ ] 「掌握度」和「记忆强度」是否应该统一？目前前者是 UI 档位、后者是底层连续值，分开是否会引起混淆？

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初稿，建立基础术语表 | — |
