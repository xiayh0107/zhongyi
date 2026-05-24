---
id: ARCH-003
type: architecture
status: agreed
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - system-overview.md
  - data-model.md
  - ../04-decisions/ADR-003-markdown-as-content-store.md
depends_on: []
supersedes: []
---

# 技术栈

> MVP 阶段的技术选型。**原则：选无聊的、成熟的、能让两个人一周内跑起来的东西。**

## Why

技术栈是工程上的「不可逆决策」之一。早期选错代价很高（迁移成本），但过度纠结也是浪费。本文档列出选型 + 简短 *why*，新人加入能在 30 分钟内 onboard 技术栈。

每个选型有 **default**（默认选项）和 **fallback**（备选/将来可能切换）。

---

## 全栈一览（实际安装版本）

| 层 | 选型 | 实际版本 | 备选 |
|---|---|---|---|
| 前端框架 | **Next.js (App Router + Turbopack)** | 16.2.6 | Vue/Nuxt |
| React | React 19 | 19.2.4 | — |
| UI 库 | **Tailwind CSS v4** + Radix UI | 4.3.0 | shadcn/ui |
| 状态管理 | React Server Components + Zustand | TBD | Jotai |
| 动画 | Framer Motion | TBD | （MVP 可不用） |
| 内容存储 | Markdown + frontmatter，Git 管理 | — | — |
| 内容解析 | `gray-matter` + `remark` + `unified` | TBD | MDX |
| 搜索 | FlexSearch（客户端） | TBD | Algolia |
| 用户数据库 | SQLite（MVP） → PostgreSQL（生产） | TBD | Turso |
| ORM | Prisma | TBD | Drizzle |
| 认证 | Auth.js (NextAuth v5) + Email Magic Link | TBD | Clerk |
| 邮件 | Resend（生产）/ 控制台占位（M1 开发期） | TBD | AWS SES |
| SRS 算法 | `ts-fsrs` | TBD | 自实现简化版 |
| 部署 | Vercel | — | Cloudflare Pages / Fly.io |
| 内容生产 | LLM API + 自研脚本 | — | — |
| 测试 | Vitest + Playwright | TBD | — |
| 类型系统 | TypeScript 严格模式 | 5.9.3 | — |

**版本更新（2026-05-23）**：脚手架创建时实际安装的版本比文档初稿（Next.js 14）更新——Next.js 已升到 16、React 升到 19、Tailwind 升到 4。这些是 breaking change 较多的大版本，注意：

- **Tailwind 4**：不再用 `tailwind.config.ts`，改用 CSS 中的 `@import "tailwindcss"` + `@theme` 指令
- **Next.js 16**：脚手架自动生成 `AGENTS.md` / `CLAUDE.md` 提醒 AI agents "this is NOT the Next.js you know"——开发时务必通过 `node_modules/next/dist/docs/` 或 context7 MCP 查最新 API
- **React 19**：Server Components 默认更激进，部分 hook 改名（useActionState 等）

---

## 关键选型说明

### Next.js 16 (App Router + Turbopack)
**为什么**：
- 服务端渲染对 SEO 和首屏快
- App Router 的 React Server Components 让"内容主导"的页面（节点页就是）几乎不需要客户端 JS
- Turbopack 取代 Webpack，dev server 启动从秒级到 200ms（实测）
- Vercel 一键部署
- 中文生态成熟

**为什么 16 而不是文档原写的 14**：脚手架创建时 npm registry 上的最新版就是 16。Next.js 13→14→15→16 一年一大版，跟随最新版避免后期升级压力。

**不选 Vue**：纯团队偏好；如果团队 Vue 更强，切换没有架构层面阻力。

### Markdown 而非 CMS / 数据库
详见 [`../04-decisions/ADR-003-markdown-as-content-store.md`](../04-decisions/ADR-003-markdown-as-content-store.md)。简要：
- 内容是项目的核心资产，必须 Git 版本管理
- LLM 直接生成 PR，审校者用任何编辑器改
- 不需要 CMS 后台，省一个系统

### ts-fsrs（FSRS 算法）
**为什么不用 SM-2（Anki 经典算法）**：
- FSRS 是 2022-2023 开源的新算法，准确率比 SM-2 高约 30%
- TypeScript 实现成熟（`ts-fsrs` npm 包）
- 参数可调，支持按记忆强度的连续计算（符合「状态而非任务」原则）

**为什么不自实现**：MVP 阶段精力应该在产品和内容，不在算法。

### SQLite → PostgreSQL
- 开发期 SQLite 文件 + Prisma，零配置
- 用户数到 1k+ 或需要并发写时切 PostgreSQL
- Prisma 让切换只需改 connection string

### FlexSearch（客户端搜索）
- MVP 阶段节点数 <500，全文索引 <2MB，客户端足够
- 零服务器、零延迟
- 支持中文（CJK 分词）
- 用户数据量上来后切 Meilisearch / Algolia

---

## 不用什么（明确反选）

### ❌ 不用 React Native / Flutter
MVP 不做原生 app，PWA 已经够用。

### ❌ 不用 GraphQL
节点和题目的查询模式非常固定，REST + Server Components 已经够。GraphQL 引入的复杂度不划算。

### ❌ 不用 Redux
状态管理需求集中在 UI 局部（题目作答中的临时状态），Zustand 足够轻量。

### ❌ 不用 microservices
单体 Next.js + 一个数据库，10x 当前规模都不需要拆。

### ❌ 不用复杂的 CI/CD
Vercel 自动部署 + GitHub Actions 跑 lint/test/build，够了。

### ❌ 不引入 Tailwind 之外的 CSS 框架
设计系统从 Tailwind + Radix 自建，不引入 Material UI / Ant Design 等重型库。

---

## 目录结构（约定）

仓库根：
```
fast-memory/
├── docs/                          ← 本文档体系
├── design/                        ← 设计交付物（jsx + html 设计稿）
└── app/                           ← Next.js 应用（M1 创建）
```

`app/` 内部（脚手架已创建 + 计划扩展）：
```
app/
├── content/                       ← 学习内容（Markdown + JSON）
│   ├── nodes/
│   ├── questions/
│   │   ├── foundations.json
│   │   └── ...
│   ├── questions.json              ← legacy fallback placeholder
│   └── .build/                    ← 构建产物，gitignore
├── scripts/                       ← 构建/校验脚本
│   ├── validate-content.ts
│   ├── build-graph.ts
│   └── ingest-from-docx.ts        ← 内容工程脚本
├── src/
│   ├── app/                       ← Next.js App Router
│   │   ├── page.tsx               ← 主页（知识地图）
│   │   ├── nodes/[id]/page.tsx    ← 节点页
│   │   ├── login/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   │   ├── srs/                   ← FSRS 封装
│   │   ├── content/               ← 内容加载层
│   │   └── progress/              ← 进度计算
│   ├── design/                    ← tokens.ts / 共享 UI 基元
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── tests/
└── package.json
```

---

## 环境与版本约定

| 工具 | 要求 | 实测 |
|---|---|---|
| Node.js | ≥ 20 LTS | 22.17.0 ✓ |
| pnpm | ≥ 9 | 10.24.0 ✓ |
| TypeScript | ≥ 5.4 | 5.9.3 ✓ |
| Next.js | 16.x | 16.2.6 ✓ |

**pnpm 而非 npm/yarn**：磁盘占用低、依赖解析快、monorepo 友好（将来可能拆包）。

---

## 性能预算（MVP）

| 指标 | 目标 |
|---|---|
| 节点页首屏渲染 (TTI) | < 1.5s |
| 节点间跳转 | < 200ms |
| 答题反馈延迟 | < 100ms（应该零延迟，本地计算） |
| 知识地图加载 | < 2s（含图谱数据） |
| 全站包大小（gzip） | < 200KB |

超出预算时的优先级：**保留功能 > 优化加载**（不为了打分牺牲核心体验）。

## Open Questions

- [ ] 是否需要从一开始就支持移动端？倾向于 PWA 响应式优先，原生 app 等 PMF 后再说。
- [ ] 用户数据要不要支持「本地优先 + 云同步」（local-first）？这会显著简化离线体验，但增加架构复杂度。MVP 阶段决定纯云端。
- [ ] LLM API 调用是否需要做缓存层？内容生产阶段调用量大但一次性，似乎不需要常驻缓存。

## Related Docs

- [`system-overview.md`](system-overview.md) — 这些技术如何组装成系统
- [`data-model.md`](data-model.md) — 数据库 schema 和 Markdown 格式细节
- [`../04-decisions/ADR-003-markdown-as-content-store.md`](../04-decisions/ADR-003-markdown-as-content-store.md) — 内容存储的决策过程

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.2 | 2026-05-23 | M1 脚手架实际安装；更新版本到 Next.js 16 / React 19 / Tailwind 4；目录结构改为 app/ 子目录；加邮件层、版本警告说明 | — |
| 0.1 | 2026-05-23 | 初稿，确立 Next.js + Markdown + SQLite + FSRS 技术栈 | — |
