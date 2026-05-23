---
id: ARCH-002
type: architecture
status: agreed
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - information-architecture.md
  - ../03-content/content-pipeline.md
  - ../02-features/F02-memory-strength.md
  - ../04-decisions/ADR-003-markdown-as-content-store.md
depends_on:
  - information-architecture.md
supersedes: []
---

# 数据模型

> 三个核心实体：**Node（节点）/ Question（题目）/ Progress（进度）**。整个产品的数据层就是这三张表 + 一种文件存储方式。

## Why

数据模型是契约。所有功能、内容、UI 都依赖它。它**不能频繁变**——任何 schema 变更都要走 ADR 流程。

模型设计目标（按优先级）：
1. 让原始资料能完整结构化进入
2. 支撑所有计划的功能（题型、SRS、双向链接、地图）
3. 人类可读可写（用 Markdown + frontmatter，Git 友好）
4. 性能可接受（MVP 阶段，<10k 节点不优化）

---

## 三个核心抽象

```
┌──────────┐ has_many ┌──────────┐ tracks ┌──────────┐
│   Node   │─────────→│ Question │←──────│ Progress │
└──────────┘          └──────────┘        └──────────┘
     ↑                                          │
     │ tracks                                   │
     └──────────────────────────────────────────┘
```

- **Node**：内容侧，所有学习者共享
- **Question**：内容侧，挂在节点上
- **Progress**：用户侧，每个用户在每个节点 / 题目上的状态

---

## Node Schema

存储为 Markdown 文件 + YAML frontmatter，路径即 ID。

### 路径约定
```
content/
  nodes/
    L1-vision/
      yin-yang.md
      five-elements.md
    L2-entities/
      zang-fu/
        liver.md
        kidney.md
      qi-blood/
        qi.md
      six-evils/
        wind.md
    L3-relations/
      liver-kidney-同源.md
    L4-facts/
      herbs/
        fu-zi.md
      formulas/
        ma-huang-tang.md
      acupoints/
        he-gu.md
    L5-applications/
      jaundice-syndromes.md
```

文件路径 = 节点 ID（去掉 `.md`）。例：`L2-entities/zang-fu/liver`。

### Frontmatter Schema

```yaml
---
id: liver                              # 必填，文件名（kebab-case 或拼音）
title: 肝                              # 必填，显示名
layer: L2                              # 必填，L1/L2/L3/L4/L5
category: zang-fu                      # 选填，二级分类
summary: 主疏泄，主藏血                 # 必填，一句话
template:                              # 选填，结构化属性（按 layer 不同）
  五行: 木
  在志: 怒
  在液: 泪
  在体: 筋
  其华: 爪
  开窍: 目
  表里腑: 胆
  通应季节: 春
relations:                             # 选填，到其他节点的边
  - type: paired_with
    target: gallbladder
  - type: generates
    target: heart
  - type: related_to
    target: liver-kidney-同源
question_ids:                          # 选填，挂载的题目 ID 列表
  - q-liver-001
  - q-liver-002
source:                                # 选填，原始资料追溯
  file: 中医.docx
  lines: [232, 597, 1464-1470]
status: reviewed                       # draft / generated / reviewed
created: 2026-05-23
updated: 2026-05-23
---
```

### Markdown Body

```markdown
# 肝

> 主疏泄，主藏血。五脏之一，五行属木，体阴而用阳，为"将军之官"。

## 系统联系
（自动渲染 template 表格，body 中可省略）

## 主要功能

### 主疏泄
指肝具有疏通、畅达全身气机...
- 调畅气机
- 维持血液和津液运行
- ...

### 主藏血
...

## 临床要点
肝病常见证型：肝郁气滞、肝阳上亢、肝风内动、肝血虚...
（每个证名是 [[wiki-link]]，自动生成跳转）
```

**约定**：
- `[[node-id]]` 语法用于双向链接，构建期解析
- 标题层级：H1 = 节点名，H2 = 主章节
- Body 是讲解内容；模板属性、关系、题目挂载在 frontmatter

---

## Question Schema

存储为单一 JSON / YAML 文件（或拆分按类别）。MVP 阶段建议单文件 `content/questions.json`，方便批量编辑。

### Schema

```typescript
interface Question {
  id: string;                    // 全局唯一，如 "q-liver-001"
  node_ids: string[];            // 关联节点（一题可挂多节点）
  type: QuestionType;
  stem: string;                  // 题干（Markdown 支持）
  options?: string[];            // 选择题选项
  answer: any;                   // 类型随 type 变化
  why: string;                   // 解析（必填，给"Why?"按钮用）
  difficulty: 1 | 2 | 3;         // 1=基础, 2=进阶, 3=综合
  source?: {
    file: string;
    line: number;
    original_number?: string;    // 如 "单选-7"
  };
  status: 'draft' | 'generated' | 'reviewed';
  created: string;               // ISO 日期
  updated: string;
}

type QuestionType =
  | 'single_choice'      // 单选
  | 'multiple_choice'    // 多选
  | 'fill_in_blank'      // 填空
  | 'match'              // 匹配/连线
  | 'sort'               // 排序
  | 'spell'              // 拼写（输入药名等）
  | 'derive'             // 推导题（自由输入 + 关键词匹配）
  | 'blank_recall';      // 白纸召回
```

### 各题型的 answer 字段

| type | options | answer |
|---|---|---|
| single_choice | `string[]` | `number`（索引） |
| multiple_choice | `string[]` | `number[]` |
| fill_in_blank | — | `string[]`（多个可接受答案） |
| match | `{left: string[], right: string[]}` | `[[0,2],[1,0],...]`（左右索引对） |
| sort | `string[]`（待排序项） | `number[]`（正确顺序索引） |
| spell | — | `string[]`（接受多种写法） |
| derive | — | `{keywords: string[], min_match: number}` |
| blank_recall | — | `{required: string[], optional: string[]}` |

### 例

```json
{
  "id": "q-liver-001",
  "node_ids": ["liver"],
  "type": "single_choice",
  "stem": "肝在志为？",
  "options": ["喜", "怒", "思", "悲", "恐"],
  "answer": 1,
  "why": "肝五行属木，木性条达。怒则气上，怒为肝之志。详见 [[liver]] 的系统联系。",
  "difficulty": 1,
  "source": { "file": "中医.docx", "line": 597, "original_number": "单选-250" },
  "status": "reviewed",
  "created": "2026-05-23",
  "updated": "2026-05-23"
}
```

---

## Progress Schema

用户侧数据，存数据库（SQLite for MVP，PostgreSQL for prod）。

### 表：`user_node_progress`

```sql
CREATE TABLE user_node_progress (
  user_id          TEXT NOT NULL,
  node_id          TEXT NOT NULL,
  memory_strength  REAL NOT NULL DEFAULT 0,    -- 0-100，连续值
  last_reviewed    TIMESTAMP,
  first_visited    TIMESTAMP,
  visit_count      INTEGER NOT NULL DEFAULT 0,
  -- FSRS 内部状态
  fsrs_stability   REAL,
  fsrs_difficulty  REAL,
  fsrs_state       TEXT,                       -- "new"|"learning"|"review"|"relearning"
  PRIMARY KEY (user_id, node_id)
);
```

### 表：`user_question_attempts`

```sql
CREATE TABLE user_question_attempts (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL,
  question_id  TEXT NOT NULL,
  node_id      TEXT NOT NULL,
  correct      BOOLEAN NOT NULL,
  user_answer  TEXT,                  -- JSON-encoded
  time_ms      INTEGER,
  attempted_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_attempts_user_node ON user_question_attempts(user_id, node_id);
```

### 表：`user_sessions`

```sql
CREATE TABLE user_sessions (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at   TIMESTAMP,
  -- 用于行为分析，不用来强制节奏
  node_count INTEGER,
  question_count INTEGER
);
```

### 派生：状态档位

`mastery_tier` 不存数据库，按 `memory_strength + visit_count + 历史最高强度` 实时派生：

```typescript
function masteryTier(p: Progress): 'untouched' | 'learned' | 'mastered' | 'fading' {
  if (p.visit_count === 0) return 'untouched';
  if (p.memory_strength < 60 && p.peak_strength >= 60) return 'fading';
  if (p.memory_strength >= 85 && p.success_count >= 3) return 'mastered';
  return 'learned';
}
```

---

## 文件 vs 数据库的边界

| 数据类型 | 存哪 | 理由 |
|---|---|---|
| Node 讲解内容 | Markdown 文件 | 人类可写 / Git 版本管理 / LLM 可生成 |
| Node frontmatter | Markdown 文件 | 同上 |
| Question 题目 | JSON 文件 | 批量编辑 / 结构化校验 |
| User progress | SQLite/PostgreSQL | 高频读写 / 用户隔离 |
| User attempts | SQLite/PostgreSQL | 同上 |
| Session 行为日志 | SQLite/PostgreSQL | 分析需要 |

详见 [`../04-decisions/ADR-003-markdown-as-content-store.md`](../04-decisions/ADR-003-markdown-as-content-store.md)。

---

## 构建期处理

启动时（或文件变更时）执行：

1. 扫描 `content/nodes/**/*.md`，解析 frontmatter + body
2. 解析所有 `[[wiki-link]]`，构建双向链接表
3. 解析 `relations` 字段，构建关系图
4. 校验：所有引用的 `node_ids` / `target` 是否存在
5. 校验：所有 `question.node_ids` 是否在节点表中
6. 生成派生数据：邻接表、层级索引、搜索索引（FlexSearch）
7. 输出：`content/.build/graph.json`、`search-index.json`

构建失败会阻止部署。

---

## 校验规则（必须通过）

| 规则 | 含义 |
|---|---|
| `node.id` 全局唯一 | 文件路径决定 ID，重名报错 |
| `node.layer ∈ {L1..L5}` | 层级合法 |
| `relations[].target` 必须存在 | 死链阻止构建 |
| 同一对节点之间不能有重复 `relation type` | 防止冗余 |
| `question.node_ids` 至少有一个 | 题目必须有归属 |
| `question.answer` 类型与 `question.type` 匹配 | 类型安全 |
| L2 实体节点必须有 `template` 字段 | 模板化要求 |

校验逻辑实现在 `scripts/validate-content.ts`，CI 强制运行。

## Open Questions

- [ ] Question 是否需要支持「多正确答案路径」？比如某些填空题的同义表达。当前 `string[]` 已支持，但匹配算法的细节（精确 vs 模糊）需要在 F03 文档中确定。
- [ ] Progress 中是否需要记录"用户笔记"？倾向于先不做，避免引入笔记编辑器的复杂度。
- [ ] 是否需要 `tags`（自由标签）字段？目前用 `category` + `relations` 已够，倾向于不加。

## Related Docs

- [`information-architecture.md`](information-architecture.md) — 5 层架构的概念定义
- [`../02-features/F02-memory-strength.md`](../02-features/F02-memory-strength.md) — `memory_strength` 字段的计算逻辑
- [`../02-features/F03-question-types.md`](../02-features/F03-question-types.md) — 各题型的交互细节
- [`../03-content/content-pipeline.md`](../03-content/content-pipeline.md) — 数据如何从原始资料填进来
- [`../04-decisions/ADR-003-markdown-as-content-store.md`](../04-decisions/ADR-003-markdown-as-content-store.md) — 为什么用 Markdown 不用数据库

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初稿，定义 Node/Question/Progress 三大 schema | — |
