---
id: ARCH-004
type: architecture
status: agreed
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - information-architecture.md
  - data-model.md
  - tech-stack.md
depends_on:
  - data-model.md
  - tech-stack.md
supersedes: []
---

# 系统全景

> 数据如何流动、组件如何分工、构建期与运行期边界在哪里。这份文档是「鸟瞰图」——细节都在被引用的文档里。

## Why

新加入项目的人需要 5 分钟内理解：内容从哪来、用户怎么用、数据怎么流。光看代码会被细节淹没，光看 PRD 又抓不到结构。这份是中间层。

---

## 三个时间维度

系统有三个互不重叠的时间维度，分别对应不同的组件：

```
1. 内容生产期（一次性 / 偶发）
   原始资料.docx → LLM 抽取 → 人工审校 → Markdown + JSON

2. 构建期（每次部署）
   Markdown 文件 → 解析 + 校验 → 派生数据（图谱/索引）

3. 运行期（用户每次访问）
   静态内容 + 用户进度（DB） → UI 渲染 → 用户交互 → 进度更新
```

混淆这三个维度是新人最常犯的错（"为什么我改了 Markdown 用户看不到？"——因为没构建）。

---

## 完整数据流

```
┌────────────────────────────────────────────────────────────────┐
│                    内容生产期（人 + LLM）                       │
│                                                                │
│   中医.docx                                                    │
│       │                                                        │
│       ▼                                                        │
│   ingest-from-docx.ts ─── 调用 LLM API ─── 输出草稿            │
│       │                                                        │
│       ▼                                                        │
│   content/nodes/**/*.md (status: draft)                        │
│   content/questions/*.json                                     │
│       │                                                        │
│       ▼                                                        │
│   人工审校 ─── 改 status: reviewed                              │
│       │                                                        │
│       ▼                                                        │
│   git commit / PR                                              │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                       构建期（CI / 本地）                       │
│                                                                │
│   content/**/*.md  ────►  scripts/validate-content.ts          │
│   content/questions/*.json  │ 解析 frontmatter                 │
│                             │ 解析 [[wiki-link]]               │
│                             │ 校验引用完整性                    │
│                             ▼                                  │
│                       scripts/build-graph.ts                   │
│                             │ 构建邻接表                        │
│                             │ 构建搜索索引                      │
│                             ▼                                  │
│                       content/.build/                          │
│                         ├── graph.json                         │
│                         ├── search-index.json                  │
│                         └── node-index.json                    │
│                             │                                  │
│                             ▼                                  │
│                       Next.js build                            │
│                             │                                  │
│                             ▼                                  │
│                       静态 + 服务端 bundle                      │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                       运行期（用户浏览器 + 服务器）              │
│                                                                │
│   用户访问 /nodes/liver                                         │
│       │                                                        │
│       ├──► Server Component 读 graph.json + node markdown      │
│       │    ↓                                                   │
│       │    渲染节点页 HTML（含 frontmatter 模板表 + body）      │
│       │                                                        │
│       └──► API 调用 /api/progress/liver                         │
│            ↓                                                   │
│            读 user_node_progress （SQLite/PG）                  │
│            返回 memory_strength + tier                          │
│       │                                                        │
│   用户点击「测试自己」                                          │
│       │                                                        │
│       ├──► Client Component 加载 content/questions/ 中挂载到 liver │
│       │    的题目                                              │
│       │                                                        │
│       └──► 用户作答                                            │
│            │                                                   │
│            ├──► 本地立即判分 + 显示反馈                          │
│            │                                                   │
│            └──► POST /api/attempts                              │
│                 ↓                                              │
│                 写 user_question_attempts                       │
│                 触发 FSRS 计算 → 更新 user_node_progress        │
└────────────────────────────────────────────────────────────────┘
```

---

## 组件分层

### 内容层（静态）
- `content/nodes/**/*.md` — 节点内容
- `content/questions/*.json` — 按领域拆分的题库
- `content/.build/` — 构建产物（gitignore）

**所有学习者共享，不变。**

### 用户数据层（动态）
- `user_node_progress` — 每用户每节点的记忆强度
- `user_question_attempts` — 答题历史
- `user_sessions` — 会话日志（行为分析用）

**每个用户独立。**

### 服务层（无状态）
- 内容加载（`src/lib/content/`）
- 进度计算（`src/lib/progress/`）
- SRS 引擎（`src/lib/srs/`，封装 `ts-fsrs`）
- 校验/构建脚本（`scripts/`）

### 表现层
- Server Components：节点页、知识地图主页（数据重 + JS 轻）
- Client Components：题目作答、白纸召回、SRS 复习流（交互重）

---

## 模块依赖图

```
                    ┌─────────────────┐
                    │   UI / Pages    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐
       │ Content  │   │ Progress │   │   SRS    │
       │ Loader   │   │ Service  │   │  Engine  │
       └────┬─────┘   └────┬─────┘   └─────┬────┘
            │              │               │
            ▼              ▼               │
     ┌──────────┐    ┌──────────┐          │
     │ Markdown │    │   ORM    │◄─────────┘
     │  Files   │    │ (Prisma) │
     └──────────┘    └────┬─────┘
                          ▼
                    ┌──────────┐
                    │ SQLite / │
                    │ Postgres │
                    └──────────┘
```

**依赖方向单向**：UI → 服务 → 存储。禁止反向依赖（服务层不能 import UI 类型）。

---

## 关键路径（用户视角）

### 路径 A：首次进入
```
打开 /              （主页 = 知识地图）
  ├─ Server: 读 graph.json + 用户 progress 表
  ├─ 渲染地图：所有节点 + 当前记忆强度颜色
  └─ 用户视觉扫一遍知识体系
```

### 路径 B：学习新节点
```
点击「肝」节点
  ├─ Server: 读 liver.md + frontmatter
  ├─ 渲染节点页（模板表、讲解、相关节点链接）
  ├─ 用户阅读 + 思考
  └─ 点击「测试自己」
       ├─ Client: 加载挂载到 liver 的题目（前 5 题）
       ├─ 用户作答 → 本地判分 → 显示 Why
       └─ POST /api/attempts → 更新 memory_strength
```

### 路径 C：定向复习（用户自己选）
```
主页扫到「脾」颜色变橙
  ├─ 用户点击「脾」
  ├─ 进入节点页（看到 memory_strength: 42 ⚠ 衰减中）
  └─ 用户选择「快速复习」
       ├─ Client: 加载该节点的高频核心题（按错误率排序）
       └─ 完成后 memory_strength 回升
```

### 路径 D：SRS 推荐（不强制）
```
主页底部「需要补强 10 个节点」（可点开，不催）
  ├─ 用户主动点开
  ├─ 系统按 FSRS 算法排序，给出推荐学习序列
  └─ 用户可以选择全部做、做一部分、或忽略
```

---

## 关键约束

### 单一事实源
- 节点内容的事实源是 `content/nodes/*.md` —— 任何 UI 显示的内容都从这里来
- 用户进度的事实源是数据库
- 不允许在 UI 层硬编码任何节点内容

### 内容不可分叉
- 同一时间所有用户看到完全相同的内容版本
- 不支持「用户编辑节点内容」——这是教科书产品，不是 wiki

### 用户数据本地化
- 用户的进度只能由本人访问
- 不做社交、不做对比、不做排行（见 [`../00-vision/design-principles.md`](../00-vision/design-principles.md) 原则 5）

---

## 已知风险

| 风险 | 缓解 |
|---|---|
| 内容构建时间随节点数增长 | MVP 阶段 <500 节点，<5s 构建；上千时考虑增量构建 |
| Markdown 双向链接的死链 | CI 强制校验阻止合入 |
| FSRS 算法不适合中医内容特点（概念深度 vs 词汇广度） | 留出参数调优空间，必要时引入自定义 forgetting curve |
| 单体应用扩展性 | MVP 阶段不预先优化；用户 >10k 时再讨论拆分 |

## Open Questions

- [ ] 是否需要「构建预览」环境（PR 自动部署预览）？Vercel 默认支持，但需要为内容编辑者打开权限。
- [ ] 内容更新时已学过该节点的用户是否要看到「该节点已更新」提示？倾向于不做（避免打扰），但如果内容修正了错误则需要通知。

## Related Docs

- [`information-architecture.md`](information-architecture.md) — 内容的概念结构
- [`data-model.md`](data-model.md) — 每个存储位置的 schema 细节
- [`tech-stack.md`](tech-stack.md) — 每个组件使用什么技术
- [`../03-content/content-pipeline.md`](../03-content/content-pipeline.md) — 内容生产期的详细流程

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初稿，绘制三个时间维度的数据流和组件依赖 | — |
