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

### 2026-05-23（第八批 · M1 全部完成）

#### ✨ feature · M1 最小学习闭环跑通

剩余 11 项 done 标准一次性做完：

- **M1-2 Prisma 7 + SQLite** — Prisma 7 重大变化（schema 不含 url，用 prisma.config.ts + driver adapter）。better-sqlite3 driver。
- **M1-3 Zod 4 schemas** — 复制 _schemas/ 到 app/src/types/，修复 zod 4 `.errors → .issues` API 变化
- **M1-4 内容加载层** — gray-matter + remark + 双向链接构建期解析 + 反向索引
- **M1-7 3 个示范节点 + 30 道题** — 肝 / 风邪 / 附子；30 道题涵盖 single_choice + multi + fill + 跨节点
- **M1-5 Auth.js v5 + magic link 控制台占位** — Nodemailer provider + sendVerificationRequest override；完整链路验证（DB 自动建 User）
- **M1-6 设计 tokens + 登录三页** — 移植 design/tokens.jsx → tokens.ts；Tailwind v4 `@theme` 内嵌 tokens；/login + /login/check-email + /login/error 三页
- **M1-8 节点页路由** — `/nodes/[id]`：面包屑 + 标题 + StatusBar + 模板表 + body + 相关节点四组 + 反向引用
- **M1-9 答题流** — `/nodes/[id]/quiz`：single_choice + 进度点 + 即时反馈 + Why 卡片 + 强度变化展示
- **M1-10 FSRS 集成** — ts-fsrs 5.4.1，封装 reviewCard / deriveMemoryStrength / ratingFromAttempt（含时间阈值）
- **M1-11 记忆强度派生** — 纯函数计算 + StatusBar 三重编码（长度 + 颜色 + ▼）
- **M1-12 CI** — GitHub Actions：install + Prisma generate + content:validate + lint + typecheck + build

构建验证：`pnpm build` 全绿，8 个路由全部编译成功。

#### 🏛 arch · Prisma 7 / Tailwind 4 / Zod 4 升级笔记

文档原写的版本（Next 14、Prisma 6）已被实际安装版本（Next 16、Prisma 7、Tailwind 4、Zod 4）超越。这些大版本都有 breaking change：

- **Prisma 7**：schema 不含 `url`，移到 `prisma.config.ts`；PrismaClient 通过 driver adapter（如 `@prisma/adapter-better-sqlite3`）连数据库
- **Tailwind 4**：不再用 `tailwind.config.ts`，改用 CSS 中的 `@theme { --color-* }`
- **Zod 4**：`result.error.errors` → `result.error.issues`
- **React 19**：`react-hooks/purity` 不允许在 useRef 初始值里调用不纯函数；`react-hooks/set-state-in-effect` 更严格

`_schemas/*` 文档副本同步更新到这些 API。

---

### 2026-05-23（第七批 · M1 启动 · Next.js 脚手架）

#### 🏗 infra · Next.js 项目脚手架创建

在仓库根 `app/` 子目录创建 Next.js 项目：
- Next.js **16.2.6**（比初版文档的 14 更新）+ App Router + Turbopack
- React **19.2.4**
- Tailwind CSS **4.3.0**（v4 不再用 tailwind.config.ts）
- TypeScript 5.9.3 + ESLint 9 + src 目录 + `@/*` import alias

Dev server 验证：HTTP 200，Turbopack 启动 200ms ⚡。

Next.js 16 自动生成 `app/AGENTS.md` + `app/CLAUDE.md` 警告 AI agents：This is NOT the Next.js you know（需要查最新文档，不能依赖训练数据）。

#### 🏛 arch · tech-stack v0.2

更新 tech-stack 反映实际版本：
- 版本号全部对齐
- 目录结构改为「仓库根 + app/ 子目录」
- 加邮件层（Resend / 控制台占位）
- 关键选型说明加入版本警告

#### 🎯 decision · 邮件服务 M1 用控制台占位

为加快 M1 开发，magic link 暂时输出到 dev console 而非真发邮件。开发可继续推进，Resend 集成放到 M1 后期或上线前。

---

### 2026-05-23（第六批 · 设计师第二轮交付）

#### 🎨 design · 第二轮设计交付（4 份新文件 + 26 个新画板）

设计师按 [`ROUND-2-BRIEF.md`](../../design/ROUND-2-BRIEF.md) 完整交付：

- `a-login.jsx` — F00 三页：登录入口（4 态）+ 检查邮箱（2 态）+ 链接失败（3 reason）+ 手机端
- `a-email.html` — Email HTML 模板（inline style + table，兼容主流客户端）
- `a-states.jsx` — 新用户主页 + 节点暂无题 + 节点/题目 skeleton + 404/500/Offline
- `a-recall.jsx` — F05 白纸召回三态

**Brief 完成度 12/12 + 多做 2 项**（节点暂无题、Offline 手机版）。约束（A tokens、6 原则、12 反模式、拒绝过度安抚）全部遵守。

评价：A+，无需返修，可直接用于 M1 开发。详见 [`/design/REVIEW.md`](../../design/REVIEW.md) 第二轮章节。

#### 🐛 process · AI 设计工具全量同步问题

设计师用的 AI 工具会做"全量同步"——上传时只覆盖它知道的文件类型，可能误删 `.md`。本次交付后观察到 design/README.md / REVIEW.md / ROUND-2-BRIEF.md 被删除，已通过 `git restore` 恢复。

已在 design/README.md 加入协作提醒；未来 review 时把这条流程化（每次交付先 git status 检查删除项）。

---

### 2026-05-23（第五批 · 设计师第二轮任务简报）

#### 📝 design · ROUND-2-BRIEF 发布

新增 [`/design/ROUND-2-BRIEF.md`](../../design/ROUND-2-BRIEF.md)——给设计团队的下一轮工作清单。

任务范围（P0 部分 M1 必须）：
- F00 登录三页（登录入口 / 检查邮箱 / 登录失败）
- F00 Email HTML 模板
- 空状态系列（未登录主页 / 新用户引导）
- 加载态系列（节点 / 题目流 / 邮件发送中——首选 skeleton）
- 错误页（404 节点不存在 / 500 服务器错误 / 网络断开）

P1（M3 之前）：
- F05 白纸召回三态（进入前 / 进行中 / 提交后反馈）

约束：严格沿用 A 变体 tokens；不新增颜色/字体；复用首轮组件；6 条原则 + 12 项反模式全部有效。

新增强约束：
- 错误/空/loading 态避免"过度安抚"（说清发生了什么 + 能做什么）
- 等待要诚实（不假装 AI 在思考）

工作量估计 5-6 天（P0 3-4 天）。

---

### 2026-05-23（第四批 · 变体决策 + 状态可视化文档同步）

#### 🎯 decision · ADR-005 变体 A "含蓄专业" 作为 MVP

确定 MVP 采用变体 A。理由：易用性优先、扩展性强、专业感匹配目标用户。变体 B 保留代码作为未来"古籍主题"皮肤选项（tokens 已支持运行时切换）。

#### 📝 docs · 状态可视化升级同步到 docs

把"○● 符号编码"升级为"横向强度条 + 颜色 + ▼ 三重编码"，同步到：
- `_meta/design-brief.md` v0.2
- `F01-node-page.md` v0.2
- `F02-memory-strength.md` v0.2
- `F04-knowledge-map.md` v0.2（含 DistributionBar 新增说明）

文档与设计实现现在一致。关闭 [`REVIEW Open Issue #1 & #2`](../../design/REVIEW.md)。

---

### 2026-05-23（第三批 · 设计交付与评审）

#### 🎨 design · 首轮设计交付物入库

设计团队基于 `design-brief.md` 完成首轮设计探索，交付物在 `/design/`：

- 两个视觉变体：**A 含蓄专业** / **B 古典书页**
- 每个变体覆盖 F04 主页 / F01 节点页 / F03 题目流，桌面 + 手机
- 一份完整的 design system（色板、字体、状态条、组件基元）
- 共用 tokens 结构，支持运行时变体切换

设计师明显内化了 design-brief —— 代码注释里出现 "NO timer, NO score" 这种自觉避坑。**12 项反模式 · 0 项违反**。

#### 📝 design · 状态可视化系统升级

设计师把状态可视化从「○● 符号」升级为「**横向强度条**（长度=强度）+ 颜色 + ▼ 标记」三重编码：
- 信息密度更高（一眼看到具体强度）
- 列表对齐更整齐
- 仍色盲友好

决定采用升级版。docs 中相关章节待同步（[`/design/REVIEW.md`](../../design/REVIEW.md) Open Issue #1）。

#### 📝 docs · 设计追溯文档

- `/design/README.md` — 设计稿入口
- `/design/REVIEW.md` — 对照 design-brief 的逐项评审 + 变体推荐
- 更新 `_meta/design-brief.md` 末尾，指向设计交付物
- 更新里程碑：M0.5 设计交付节点

#### 🎯 待决策

- **变体选择**：建议 A 为主、B 作为皮肤备选（详见 REVIEW）。等团队/产品确认，确认后写 ADR-005

---

### 2026-05-23（第二批 · 账户与设计简报）

#### 🚀 release · 首次 push 到 GitHub

仓库上线：https://github.com/xiayh0107/zhongyi （Public）

#### 🎯 decision · ADR-004 用 Email Magic Link 作为认证方式

MVP 用 Email Magic Link（Auth.js + Resend），无密码、最小信息收集。OAuth 留到 MVP 后。

#### 🏛 arch · 账户与认证系统设计

新增 [`01-architecture/auth-and-account.md`](../01-architecture/auth-and-account.md)。完整覆盖：User/Account/Session/VerificationToken 表、认证流程、隐私边界、用户数据生命周期、删除/导出权利。

#### 🏛 arch · data-model 扩展到 v0.2

补充 4 张用户认证表；明确"文件存内容、数据库存用户"的边界；progress 表加 peak_strength 字段；user_sessions 重命名为 LearningSession（避免与认证 Session 混淆）。

#### 📝 docs · 设计简报（给设计团队的入口）

新增 [`_meta/design-brief.md`](../_meta/design-brief.md)：6 条原则速查、**反模式清单**、视觉风格方向、4 条用户旅程、状态可视化系统、技术约束。设计师只需读这一份 + 5 份必读详情即可开工。

#### 🏗 infra · 可执行 Schema 文件

新增 `01-architecture/_schemas/`：
- `schema.prisma`：完整 Prisma 数据库 schema（账户 + 进度）
- `node.frontmatter.zod.ts`：节点 frontmatter 的 Zod 校验
- `question.zod.ts`：题目 JSON 的 Zod 校验（8 种题型 discriminated union）

开发者可以直接复制到项目代码使用。

#### ✅ progress · M0 文档体系完成

整体 M0 状态变更：🟦 in-progress → 🟩 done。进入 M1。

---

### 2026-05-23（第一批 · M0 启动）

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
