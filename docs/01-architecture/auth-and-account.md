---
id: ARCH-005
type: architecture
status: agreed
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - data-model.md
  - tech-stack.md
  - ../04-decisions/ADR-004-email-magic-link-auth.md
  - ../00-vision/product-philosophy.md
depends_on:
  - data-model.md
  - ../04-decisions/ADR-004-email-magic-link-auth.md
supersedes: []
---

# 账户与认证系统

> 完整的账户系统设计：表结构、认证流程、隐私边界、用户数据生命周期。

## Why

用户独立记录学习进度需要账户系统。账户系统是**基础设施**——一旦上线，迁移成本极高（涉及用户数据）。必须一次性想清楚：存什么、不存什么、如何认证、如何退出、如何删除账户。

[ADR-004](../04-decisions/ADR-004-email-magic-link-auth.md) 决定了认证方式（Email Magic Link）。本文档把决策落到具体设计。

---

## 设计原则

1. **最小信息收集**：只存登录所必需 + 用户主动填写的，不收集行为画像之外的信息
2. **隐私默认**：用户的 progress / attempts 默认私有，不展示给他人
3. **可删除**：用户必须能完全删除自己的账户和数据
4. **可导出**：用户必须能导出自己的所有数据（合规要求 + 信任）
5. **明确边界**：哪些是登录系统的数据、哪些是学习系统的数据，分清

---

## 表结构

四张表为 Auth.js 标准（Email Provider 模式），一张是我们自己的 `User` 扩展。

### Table: `User`

我们扩展的用户表（不是 Auth.js 内置的，但 Auth.js 会引用它）。

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?              // Auth.js 字段，magic link 点击时填
  name          String?                // 用户主动填写的昵称（可选）
  image         String?                // 用户主动上传的头像（可选，MVP 不做）

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  // 用户设置
  prefersLocale       String?  @default("zh-CN")
  prefersTheme        String?  @default("system")  // system | light | dark
  reminderOptIn       Boolean  @default(false)     // 用户显式开启才发邮件提醒

  // 关联
  accounts            Account[]
  sessions            Session[]
  nodeProgress        UserNodeProgress[]
  attempts            UserQuestionAttempt[]
  appSessions         UserSession[]              // 学习行为 session（与认证 session 不同）

  @@index([email])
}
```

**关键设计**：
- `email` 是唯一标识
- `name` / `image` 都是可选——MVP 不强制收集
- 不存任何"行为画像"（如年龄、学历、目标考试等）——侵犯隐私且没用上

### Table: `Account`（Auth.js 标准）

预留给将来的 OAuth 关联（GitHub / Google 等）。MVP 仅 Email 时此表为空。

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String  // "oauth" | "email"
  provider          String  // "email" | "github" | "google" | ...
  providerAccountId String

  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

### Table: `Session`（Auth.js 标准）

用户的登录会话。

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

**注意**：这是「认证 session」，与学习行为的 `UserSession`（在 [`data-model.md`](data-model.md)）是不同的概念。**命名容易混淆，建议代码层加注释或考虑重命名学习 session 为 `LearningSession`。**

### Table: `VerificationToken`（Auth.js 标准）

Magic Link 用：发出但未被点击的链接 token。

```prisma
model VerificationToken {
  identifier String   // email
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

- 点击链接后立即删除该 token
- 过期 token 由定时任务清理（每天）

---

## 认证流程

### A. 首次注册 / 登录（统一流程）

```
1. 用户访问 /login
   ↓
2. 输入邮箱
   ↓
3. POST /api/auth/signin/email { email }
   ├── 生成随机 token (32 字节)
   ├── 写入 VerificationToken 表
   └── 调用 Resend 发送邮件，邮件含链接：
       https://app.example.com/api/auth/callback/email?token=...&email=...
   ↓
4. 用户在邮箱点击链接
   ↓
5. GET /api/auth/callback/email?token=...
   ├── 验证 token 存在 + 未过期 + 邮箱匹配
   ├── 删除 VerificationToken
   ├── 在 User 表查找 email：
   │   ├── 存在 → 复用 user.id
   │   └── 不存在 → 创建 User 新行
   ├── 设置 User.emailVerified = now()
   ├── 创建 Session
   └── 设置 cookie，重定向到 /
   ↓
6. 主页加载，看到自己的 progress
```

**注意**：注册和登录是同一个流程——用户根本不需要知道"这是第几次"。

### B. 持续会话

- Session cookie 长期保存（30 天）
- 用户活跃时不需要重新验证
- 30 天不活跃 → Session 过期，下次访问要求重新发 magic link

### C. 退出登录

```
POST /api/auth/signout
  ├── 删除当前 Session
  ├── 清除 cookie
  └── 重定向到 /login
```

「所有设备退出」（高级）：
```
POST /api/account/signout-all
  └── 删除该 user 的所有 Session
```

### D. 切换账号

MVP 不专门做"切换账号"按钮。流程：退出 → 输入新邮箱 → 收新链接。

### E. 邮箱变更

MVP 不做。理由：复杂度高（要验证新邮箱）+ 使用频次极低。要切换邮箱的用户走"删除账号 + 新邮箱注册"流程（接受 progress 重置）。

### F. 删除账户

```
DELETE /api/account
  ├── 二次确认（防止误操作）
  ├── 删除 User 行（级联删 progress、attempts、appSessions、accounts、sessions）
  ├── 不保留任何残留数据
  └── 发邮件确认
```

**硬删除，不是软删除。**理由：隐私优先 > 数据分析需求。

### G. 数据导出

```
GET /api/account/export
  └── 返回 JSON 文件，含：
      - User 基本信息
      - 所有 UserNodeProgress
      - 所有 UserQuestionAttempt
      - 所有 LearningSession 行为日志
```

用户随时可导出。导出格式稳定（可以未来导入其他系统 / Anki / 自建工具）。

---

## 权限边界

### 数据可见性

| 数据 | 谁能看 |
|---|---|
| 节点内容、题目 | 所有人（含未登录） |
| 自己的 progress、attempts、sessions | 仅本人 |
| 他人的任何数据 | 任何人都不能（不做社交） |
| 用户邮箱 | 仅用户本人 + 平台管理员（审计需要时） |
| 聚合统计（如"X 节点的总学习人数"） | 可考虑展示，但 MVP 不做 |

### 未登录用户

可访问：
- 落地页 / 介绍
- 所有节点页（看内容）
- 单个测试题（试用，不保存）

不可访问：
- 主页（知识地图）—— 需要登录看自己的状态
- 任何与个人状态相关的页面
- 进度保存 —— 答题不存

未登录答题时显示提示："登录后保存你的进度 →"，但**不强制弹窗打断**。

---

## 隐私 & 合规

### 数据存储位置

- MVP：Vercel + Vercel Postgres（数据中心位置默认 US）
- 中国用户合规风险：低（个人学习数据非敏感个人信息），但 ICP / 数据出境长远要考虑
- 长远：可能需要中国境内部署 + 海外部署双套（如目标市场分化）

### 隐私政策（待写）

需要在 MVP 上线前写一份简短隐私政策，覆盖：

- 我们存什么（邮箱 + 学习记录）
- 我们不存什么（不收集年龄、地理位置、设备信息超出技术必需、第三方追踪）
- 数据如何用（仅服务于学习功能本身，无广告、无数据销售）
- 用户的权利（导出、删除）
- 数据保留时间（账户存续期间保留）
- 联系方式

### Cookie 使用

最小化：
- `next-auth.session-token`：必需（认证）
- `next-auth.csrf-token`：必需（安全）
- **没有第三方追踪 cookie**
- **没有 Google Analytics 等第三方**

可考虑自建轻量分析（仅记录页面访问，不关联用户身份）。

### 邮件发送规范

只发以下邮件：
1. **Magic link 登录邮件**（用户触发，必发）
2. **账户删除确认邮件**（用户触发，必发）
3. **重要安全通知**（如检测到异常登录，谨慎使用）

**不发**：
- ❌ 营销邮件
- ❌ "你 3 天没学了"催回邮件
- ❌ 产品更新通知（除非用户在设置中开启 reminderOptIn）

---

## 用户数据生命周期

```
注册 → 活跃 → 不活跃 → ... → 删除
  ↓      ↓       ↓              ↓
  全套数据   增量              清空
  创建    progress             所有
         attempts              数据
```

**关键策略**：
- 不活跃用户**不主动清理**——他们的数据保留，等他们回来还能用
- 主动删除是用户决策，平台不强制
- 「不活跃」不是"流失"——见 [`../00-vision/product-philosophy.md`](../00-vision/product-philosophy.md)：考完不回来是产品成功

---

## 技术实现要点

### Auth.js 配置（简化版）

```typescript
// src/auth.ts
import NextAuth from "next-auth"
import Email from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Resend } from "resend"
import { prisma } from "@/lib/db"

const resend = new Resend(process.env.RESEND_API_KEY)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Email({
      from: "Fast Memory <login@yourdomain.com>",
      async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
          from: "Fast Memory <login@yourdomain.com>",
          to: identifier,
          subject: "登录 Fast Memory",
          html: renderLoginEmail({ url }),  // 自定义 HTML
        })
      },
    }),
  ],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
  },
})
```

### 邮件 HTML 模板

简洁、无装饰：

```html
<div style="font-family: -apple-system, system-ui; max-width: 480px;">
  <h1 style="font-size: 20px;">登录 Fast Memory</h1>
  <p>点击下方按钮登录：</p>
  <a href="{{url}}" style="display: inline-block; padding: 12px 24px;
     background: #1f2937; color: white; text-decoration: none;
     border-radius: 6px;">登录</a>
  <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
    链接 15 分钟内有效。如果不是你本人操作，请忽略此邮件。
  </p>
</div>
```

### 速率限制

防滥用：
- 同一邮箱每 60 秒最多请求 1 次 magic link
- 同一 IP 每分钟最多 10 次
- 用 Vercel KV 或 Redis 实现

---

## 边界情况

### 邮箱拼写错误

用户输入了错误的邮箱（比如 `test@gmial.com`）：
- 我们仍发邮件（不知道目标存在与否）
- 用户收不到 → 显示"未收到邮件？检查垃圾箱或重新输入邮箱"
- 创建的 User 是"幽灵账号"，无法登录，最终被清理

**缓解**：注册时显示提示"请确认邮箱地址正确"。

### 邮件未送达 / 进垃圾箱

- 提示文案：「未收到？检查垃圾邮件 / 30 秒后可重新发送」
- 后台监控 Resend 的 bounce 率
- 关键邮箱服务（QQ、163）做送达测试

### 多人共用邮箱

我们允许多个浏览器同时登录同一账号。**不强制单点登录**。

### 账户被盗

Magic Link 模式下"被盗"成本极高（攻击者需要邮箱访问权）。但仍提供：
- 「所有设备退出」按钮
- Session 列表（显示活跃 session 的设备 / 时间 / IP，可单独 revoke）—— 非 MVP

---

## 验收标准

MVP 必须：

- [ ] 邮箱输入 → 收到 magic link 邮件
- [ ] 点击邮件链接 → 登录成功
- [ ] 首次登录自动创建 User
- [ ] Session 持续 30 天
- [ ] 退出登录工作
- [ ] 账户删除工作（含级联删除）
- [ ] 数据导出工作（返回 JSON）
- [ ] 未登录用户能浏览节点但不能保存进度
- [ ] 速率限制（防滥用）
- [ ] 邮箱拼写错误时的友好提示

MVP+：

- [ ] 数据导出包含完整学习历史
- [ ] 「所有设备退出」按钮
- [ ] Session 列表查看
- [ ] 用户设置页（昵称、主题、邮件提醒开关）

非 MVP：

- [ ] OAuth 关联（GitHub / Google）
- [ ] 邮箱变更流程
- [ ] 异常登录通知

## Open Questions

- [ ] 是否允许"匿名学习模式"作为试用？让访客在不注册的情况下用 localStorage 暂存进度，注册后自动迁移到账户？复杂度增加但首次体验更顺。倾向于先不做。
- [ ] 用户的 progress 数据要不要做云端 + 本地双写（local-first）？提供离线体验。MVP 阶段决定纯云端。
- [ ] 隐私政策的具体文案谁写？需要法务还是产品？倾向于产品起草、法务 review。
- [ ] 用户主动开启 `reminderOptIn` 后发什么内容？这容易滑向 push 催回（违反 [`../00-vision/design-principles.md`](../00-vision/design-principles.md) 原则 2）。倾向于仅作为"开放接口"，MVP 实际不发邮件，将来谨慎设计。

## Related Docs

- [`../04-decisions/ADR-004-email-magic-link-auth.md`](../04-decisions/ADR-004-email-magic-link-auth.md) — 认证方式决策
- [`data-model.md`](data-model.md) — 用户数据 schema 整体
- [`tech-stack.md`](tech-stack.md) — Auth.js、Resend、Prisma
- [`../00-vision/product-philosophy.md`](../00-vision/product-philosophy.md) — 隐私友好与"工具"定位
- [`_schemas/`](_schemas/) — 可执行的 Prisma schema 完整文件

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 初稿，完整账户系统设计 | — |
