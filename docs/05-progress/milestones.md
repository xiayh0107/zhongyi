---
id: PROGRESS-001
type: progress
status: in-progress
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - changelog.md
  - ../02-features/_index.md
  - ../03-content/node-catalog.md
depends_on: []
supersedes: []
---

# 里程碑

> 项目的阶段性目标 + 当前进度。**不写时间表**——里程碑由"完成的内容"定义，不由"日期"定义。

## Why

时间表是开发者强加的预设节奏。和我们对用户的态度一致：**我们也不给自己强加日历压力**。里程碑用「完成了什么」定义，做完一个进入下一个。

里程碑回答的问题：
- 当前在哪个阶段？
- 该阶段的 "done" 标准是什么？
- 完成后能给用户什么？

---

## 当前状态

🟩 **M0 文档体系搭建** · 完成
🟩 **M0.5 首轮设计交付** · 完成（待团队确认变体选择）

下一个：🟦 **M1 数据骨架 + 账户系统 + 单节点页跑通**

---

## M0 · 文档体系搭建 ✅

> 把项目从"在脑子里"变成"在文档里"。

### Done 标准
- [x] docs/ 目录结构建立
- [x] README.md 入口完成
- [x] 文档模板（`_meta/document-template.md`）
- [x] vision 三件套（philosophy、principles、glossary）
- [x] 架构层（IA、data-model、tech-stack、system-overview、**auth-and-account**）
- [x] 5 个核心功能文档（F01-F05）+ F00 引用到 auth-and-account
- [x] 内容工程文档（pipeline + catalog）
- [x] 4 个 ADR（tool-not-habit、state-not-task、markdown-store、**magic-link-auth**）
- [x] 可执行 schemas（schema.prisma + node.zod + question.zod）
- [x] **设计简报**（design-brief.md，给设计团队的入口）
- [x] milestones + changelog
- [x] Git 仓库初始化 + push 到 https://github.com/xiayh0107/zhongyi
- [ ] 团队共识：所有 status: agreed 文档被相关方审过（持续进行）

### 交付物

完整 docs/ 目录（28 份文档 + 3 份 schema 文件），覆盖：
- 产品哲学和设计原则
- 信息架构、数据模型、账户系统
- 5 个核心功能的设计 + F00 账户
- 内容生产流程
- 4 个关键决策记录
- 设计师专属入口（design-brief.md）
- 可执行 Prisma + Zod schemas

任何新加入项目的人能通过 docs/ 在 1 小时内 onboard。
设计师能通过 design-brief.md 直接开工。

### 状态：完成

---

## M0.5 · 首轮设计交付 ✅

> 设计团队基于 `_meta/design-brief.md` 完成首轮探索，证明 brief 可执行、原则可落地。

### Done 标准

- [x] 设计团队读完 design-brief（5 份必读文档）
- [x] 交付 A/B 两个视觉变体探索
- [x] 每个变体覆盖 F04/F01/F03 三个核心页面
- [x] 桌面 + 手机两套尺寸
- [x] 完整 design system（tokens / 字体 / 状态条 / 组件基元）
- [x] 共用 tokens 结构，支持运行时变体切换
- [x] 0 项反模式违反（12 项全部通过）
- [x] 写 `/design/README.md`（入口）
- [x] 写 `/design/REVIEW.md`（评审 + 推荐）
- [ ] 团队决策变体选择（A / B / 其他）→ 写 ADR-005

### 交付物

- `/design/` 完整可交互的 HTML 设计稿
- 设计 tokens + 核心组件可直接复用到开发
- 评审文档明确开发优先级和 Open Issues

### 仍待跟进

- F00 登录页设计（M1 必须）
- F05 白纸召回设计（M3）
- 空状态 / 加载态 / 错误态
- 状态可视化升级同步到 docs（[`Open Issue #1`](../../design/REVIEW.md)）

### 状态：完成（待变体决策）

---

## M1 · 数据骨架 + 账户系统 + 单节点页

> 跑通**最小学习闭环**：用户能注册、打开一个节点、看到讲解、做几道题、看到强度变化。

### Done 标准

**基础设施**：
- [ ] Next.js 项目初始化（按 [`../01-architecture/tech-stack.md`](../01-architecture/tech-stack.md)）
- [ ] Prisma 配置 + SQLite 本地数据库
- [ ] 复制 [`../01-architecture/_schemas/schema.prisma`](../01-architecture/_schemas/schema.prisma) 到 `prisma/schema.prisma` 并执行 migrate
- [ ] 复制 zod schemas 到 `src/types/`
- [ ] CI：lint + test + content validation

**F00 账户与认证**（设计在 [`../01-architecture/auth-and-account.md`](../01-architecture/auth-and-account.md)）：
- [ ] Auth.js v5 配置（Email Provider）
- [ ] Resend 邮件服务集成
- [ ] Magic link 登录流程（输入邮箱 → 发邮件 → 点链接 → 登录）
- [ ] Session 30 天保持
- [ ] 退出登录
- [ ] 账户删除接口（含级联删除）
- [ ] 数据导出接口（JSON）
- [ ] 速率限制（防滥用）
- [ ] 登录页 / 检查邮箱页 / 错误页

**内容**：
- [ ] 完成 3 个示范节点（建议：肝 + 风邪 + 附子）
  - 含 frontmatter、body、template、relations、recall_keypoints
- [ ] 这 3 个节点的题目（约 30 道）

**功能（F01 部分实现）**：
- [ ] 节点页 URL 路由 `/nodes/{id}`
- [ ] 渲染 frontmatter 模板表 + body
- [ ] 「测试自己」按钮（先链到题目流，题型只做 single_choice）
- [ ] 答题 → 显示反馈 + Why
- [ ] FSRS card 状态读写
- [ ] 节点页显示当前 memory_strength

**功能（F02 部分实现）**：
- [ ] FSRS 算法集成（ts-fsrs）
- [ ] 答题 → Rating 映射
- [ ] memory_strength 实时派生函数

### 不做（M1 范围外）
- 知识地图主页（M3）
- 双向链接（M2）
- 多种题型（M2）
- 白纸召回（M3）
- OAuth 登录（MVP 后）
- 用户设置页（MVP+）

### 交付物
- 用户可以注册并登录
- 可访问 URL 形如 `/nodes/liver` 看到节点页
- 答题闭环工作
- 强度变化能看到
- 用户可以删除账户、导出数据

---

## M2 · 题型扩展 + 双向链接

> 让学习闭环更丰富、节点之间能串起来。

### Done 标准

**题型（F03 完整）**：
- [ ] 实现 multiple_choice、fill_in_blank、match
- [ ] 至少实现 sort 或 spell 中一个
- [ ] 题型混合策略
- [ ] 答题历史显示

**双向链接（F01 完善）**：
- [ ] body 中的 [[wiki-link]] 解析渲染
- [ ] 反向引用页（"哪些节点引用了我"）
- [ ] hover 显示目标节点 summary 卡片

**内容**：
- [ ] 节点数达到 10 个（覆盖五脏 + 部分六淫）
- [ ] 题目数 ≥ 100

**FSRS（F02 完善）**：
- [ ] 完整 4 档 mastery_tier 派生
- [ ] 推荐复习算法（按 urgency 排序）

### 交付物
- 在 10 个节点间自由跳转
- 4+ 种题型可用
- 推荐复习清单可用

---

## M3 · 知识地图 + 白纸召回

> MVP 准备就绪：网络化学习 + 检索最强形式。

### Done 标准

**知识地图（F04 完整）**：
- [ ] 主页：状态概览 + 4 个入口 + 大纲树
- [ ] 状态可视化（4 档颜色 + 符号）
- [ ] 推荐"探索新节点"算法
- [ ] 搜索（FlexSearch）

**白纸召回（F05 完整）**：
- [ ] 输入界面（无线索 + 计时）
- [ ] 关键词匹配算法
- [ ] 命中/遗漏/额外 三组反馈
- [ ] 用户自评 → FSRS Rating

**内容**：
- [ ] 节点数达到 30（MVP 节点清单全部完成）
- [ ] 题目数 ≥ 250
- [ ] 所有 L2 节点的 recall_keypoints 完成

### 交付物
- 完整的 MVP，可对外发布

---

## M4 · 内容扩展 + 应用层

> 从 MVP 走向真正"覆盖大部分考点"的产品。

### Done 标准

**内容**：
- [ ] 节点数达到 60（含方剂、舌脉、L3 关系节点）
- [ ] 题目数 ≥ 400
- [ ] L5 应用层节点（黄疸/心悸/中风/水肿/痹证/鼓胀）

**功能**：
- [ ] F06 节点对比页（如有需要）
- [ ] 性能优化（按需）

### 交付物
- 覆盖原资料 ~90% 考点
- 可用于真实考试备考

---

## M5+ · 后续探索

按用户反馈决定优先级，可能包括：

- 多模态：人体经络图、舌象图、五行交互图、思维导图（开始落实早期讨论的视觉化计划）
- 学习路径推荐（基于个体行为）
- 团队协作 / 共享笔记
- 移动端 PWA 深度优化
- 多个内容域扩展（其他医学考试 / 其他学科）

**这些条目不构成承诺，仅作为未来探索方向。**

---

## 进度跟踪规则

1. 每完成一个 done 项，**当天**勾选并更新 [`changelog.md`](changelog.md)
2. 完成一个里程碑后：
   - 修改本文档对应 M 的状态符号（🟦 → 🟩）
   - 在 changelog 写一条总结
   - 启动下一里程碑（状态改为 🟦 in-progress）
3. 重新评估优先级时：
   - 不要直接改本文档历史里程碑
   - 在文档底部补充一段 "Reassessment YYYY-MM-DD" 记录变化原因

---

## 状态图例

| 符号 | 状态 |
|---|---|
| ⬜ | 未开始 |
| 🟦 | 进行中 |
| 🟩 | 已完成 |
| 🟥 | 暂停 / 被阻塞 |

---

## 当前里程碑分布

```
🟩 M0    文档体系搭建              ██████████████ 100%
🟩 M0.5  首轮设计交付              ██████████████ 100% (待变体决策)
⬜ M1    数据骨架 + 账户 + 节点页   ░░░░░░░░░░░░░░   0%
⬜ M2    题型 + 双向链接            ░░░░░░░░░░░░░░   0%
⬜ M3    知识地图 + 白纸召回        ░░░░░░░░░░░░░░   0%
⬜ M4    内容扩展 + 应用层          ░░░░░░░░░░░░░░   0%
```

**M0 + M0.5 已完成**。准备进入 M1（开发可与设计补稿 F00/F05 并行）。

## Open Questions

- [ ] M3 完成 = MVP 可发布？还是 M4 才算？这取决于产品是先小范围试用还是直接公开发布。倾向于 M3 内部试用、M4 公开。
- [ ] 是否需要"用户测试"作为单独里程碑节点？目前合并在 M3 之内。

## Related Docs

- [`changelog.md`](changelog.md) — 每个 done 项的变更记录
- [`../02-features/_index.md`](../02-features/_index.md) — 功能与里程碑的映射
- [`../03-content/node-catalog.md`](../03-content/node-catalog.md) — 节点完成进度

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.3 | 2026-05-23 | 加入 M0.5 设计交付里程碑 | — |
| 0.2 | 2026-05-23 | M0 完成；M1 加入账户系统 done 项；扩展 design-brief、ADR-004、auth-and-account、_schemas/ 到 M0 范围 | — |
| 0.1 | 2026-05-23 | 初稿，定义 M0-M4 里程碑 | — |
