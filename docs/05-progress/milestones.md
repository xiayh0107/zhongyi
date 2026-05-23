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
🟩 **M0.5 设计交付** · 完成
🟩 **M1 数据骨架 + 账户 + 节点页** · 完成（12/12）
🟩 **M2 题型扩展 + 双向链接** · 完成（8/8）
🟩 **M3 知识地图 + 白纸召回** · 完成（30 节点 / 250 题 / 主页 / 搜索 / F05 三态 / 关键词匹配）

下一个：🟦 **M4 内容扩展 + 应用层**（L5 应用层节点：黄疸 / 心悸 / 中风 / 水肿 等病-证-方推理链）

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

### 状态：完成（变体 A · ADR-005）

---

## M1 · 数据骨架 + 账户系统 + 单节点页 ✅

> 跑通**最小学习闭环**：用户能注册、打开一个节点、看到讲解、做几道题、看到强度变化。

### Done 标准

**基础设施**：
- [x] Next.js 项目初始化（app/ 子目录，Next 16 + Tailwind 4 + TypeScript）
- [x] Prisma 7 + SQLite + better-sqlite3 driver adapter
- [x] 复制 schema.prisma + zod schemas
- [x] CI：lint + typecheck + content validation + build（.github/workflows/ci.yml）

**F00 账户与认证**（设计在 [`../01-architecture/auth-and-account.md`](../01-architecture/auth-and-account.md)）：
- [x] Auth.js v5 配置（Nodemailer Provider + Prisma Adapter）
- [x] 开发期 magic link 控制台占位（Resend 集成放到上线前）
- [x] Magic link 登录流程跑通（已端到端验证：邮箱 → 控制台输出链接 → 点击 → 创建用户）
- [x] Session 30 天保持
- [x] 登录页 / 检查邮箱页 / 错误页（按 design/a-login.jsx 实现）
- [ ] 退出登录（M2 补）
- [ ] 账户删除接口（M2 补）
- [ ] 数据导出接口（M2 补）
- [ ] 速率限制（M2 补）

**内容**：
- [x] 3 个示范节点（肝 + 风邪 + 附子），含 frontmatter、body、template、relations、recall_keypoints
- [x] 30 道题（30 single_choice + 1 multi + 1 fill_in_blank + 跨节点）

**功能（F01 部分实现）**：
- [x] 节点页 URL 路由 `/nodes/{id}`
- [x] 渲染 frontmatter 模板表 + body markdown + [[wiki-link]]
- [x] 「测试自己」按钮，链到 `/nodes/{id}/quiz`
- [x] 答题 → 显示反馈 + Why
- [x] FSRS card 状态读写
- [x] 节点页显示当前 memory_strength（StatusBar 组件）

**功能（F02 部分实现）**：
- [x] FSRS 算法集成（ts-fsrs 5.4.1）
- [x] 答题 → Rating 映射（含时间阈值 Hard 15s / Easy 5s）
- [x] memory_strength 实时派生函数（纯函数 + 运行时算 + 不需要 cron）

### 不做（M1 范围外）
- 知识地图主页（M3）
- 双向链接 hover 预览（M2）
- 多种题型（M2）
- 白纸召回（M3）
- OAuth 登录（MVP 后）
- 用户设置页（MVP+）

### 交付物
- 用户可注册并登录（magic link 输出到 dev 控制台）
- 可访问 `/nodes/liver` 等节点页
- 答题闭环工作，强度变化可见
- 完整 CI（lint + typecheck + content validate + build）

---

## M2 · 题型扩展 + 双向链接 ✅

> 学习闭环丰富、节点之间串起来。

### Done 标准

**题型（F03 完整）**：
- [x] 实现 multiple_choice、fill_in_blank、match
- [x] 实现 sort 题型（上/下移按钮，避免引入 dnd 库）
- [x] 题型混合策略（pickQuestions：round-robin + 避连续 + 保底 recall-heavy）
- [x] 答题历史显示（节点页侧栏「最近答题」）

**双向链接（F01 完善）**：
- [x] body 中的 [[wiki-link]] 解析渲染（已在 M1 实现）
- [x] 反向引用列表（"被引用：" 节点列表，已在 M1 实现）
- [x] hover 显示目标节点 summary 卡片（WikiLinkHover 客户端组件）

**内容**：
- [x] 节点数达到 10 个（五脏 5 + 六淫 4 + 1 单味药）
- [x] 题目数 = 100 道（涵盖 single/multi/fill/match/sort 五种题型）

**FSRS（F02 完善）**：
- [x] 完整 4 档 mastery_tier 派生（tierFromProgress：含 visit_count + success_count + peak_strength）
- [x] 推荐复习算法（getRecommendedReview · 按 urgency 排序）

### 交付物
- 10 个节点 + 100 题
- 5 种题型可用，类型混合自动调度
- 推荐补强侧栏 + 答题历史侧栏 + 双向链接 hover 预览
- mastery 派生考虑历史成功次数

---

## M3 · 知识地图 + 白纸召回 ✅

> MVP 准备就绪：网络化学习 + 检索最强形式。

### Done 标准

**知识地图（F04 完整）**：
- [x] 主页 `/`：状态概览 + 4 入口 + 大纲树（按 layer/category 分组）
- [x] 状态可视化（StatusBar 三重编码已在 M1/M2 完成）
- [x] 推荐"探索新节点"算法（recommendNewNode：相邻未学优先）
- [x] 全局搜索（FlexSearch，title + summary + body 全文索引）

**白纸召回（F05 完整）**：
- [x] 输入界面（textarea，向上计时，字数行数显示）
- [x] 关键词匹配算法（normalize + aliases + 切片）
- [x] 命中 / 你没写出 / 选填遗漏 / 待评估 四组反馈
- [x] 用户自评（不太行/还可以/不错）→ FSRS Rating

**内容**：
- [x] 节点数达到 30（4 L1 + 5+5 L2 + 3 L2 气血 + 2 L2 八纲 + 2 L3 关系 + 3 L4 要药 + 1 L4 经穴 + 之前 5+4+1 已有）
- [x] 题目数 = 250（83 道在第三批批量产出含跨节点综合题）
- [x] 所有 L2/L4 节点均有 recall_keypoints

### 交付物
- 完整 MVP：30 节点 / 250 题 / 5 种题型 / 主页地图 / 全局搜索 / 推荐复习 / 答题历史 / 白纸召回 / 双向链接 hover
- 10 个路由：`/`, `/login`*3, `/api/auth/*`, `/search`, `/nodes/[id]`*3
- 可对外发布

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
🟩 M0.5  设计交付（首轮 + 第二轮）  ██████████████ 100%
🟩 M1    数据骨架 + 账户 + 节点页   ██████████████ 100% (12/12)
🟩 M2    题型 + 双向链接            ██████████████ 100% (8/8)
🟩 M3    知识地图 + 白纸召回        ██████████████ 100%
⬜ M4    内容扩展 + 应用层          ░░░░░░░░░░░░░░   0%
```

**M3 完成 = MVP 可发布**。30 节点 / 250 题 / 5 种题型 / 主页 / 搜索 / 白纸召回 全部就绪。

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
| 0.7 | 2026-05-23 | M3 全部完成（主页 + 搜索 + 白纸召回 + 30 节点 + 250 题）= MVP 可发布 | — |
| 0.6 | 2026-05-23 | M2 全部 8 项完成（题型扩展 + 双向链接 + 推荐 + 内容到 10/100） | — |
| 0.5 | 2026-05-23 | M1 全部 12 项完成；准备进入 M2 | — |
| 0.4 | 2026-05-23 | M1 启动；Next.js 脚手架完成；标记 done 项 | — |
| 0.3 | 2026-05-23 | 加入 M0.5 设计交付里程碑 | — |
| 0.2 | 2026-05-23 | M0 完成；M1 加入账户系统 done 项；扩展 design-brief、ADR-004、auth-and-account、_schemas/ 到 M0 范围 | — |
| 0.1 | 2026-05-23 | 初稿，定义 M0-M4 里程碑 | — |
