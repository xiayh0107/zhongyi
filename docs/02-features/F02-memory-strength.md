---
id: F02
type: feature
status: draft
version: 0.1
created: 2026-05-23
updated: 2026-05-23
priority: P0
milestone: M2
related:
  - F01-node-page.md
  - F04-knowledge-map.md
  - ../01-architecture/data-model.md
  - ../00-vision/design-principles.md
  - ../04-decisions/ADR-002-state-not-task.md
depends_on:
  - F01-node-page.md
  - ../01-architecture/data-model.md
supersedes: []
---

# F02 · 记忆强度引擎

> 用「记忆强度（0-100 的连续值）」取代传统 SRS 的「到期日 / due date」。这是把「状态而非任务」原则落到底层数据的关键模块。

## Why

传统 SRS（Anki、Duolingo）按"天"为单位算 due date：到期了 → 推到复习队列 → 用户必须做完。这套机制有两个问题：

1. **强制日节奏**：把所有用户压缩到同一种学习模式
2. **"过期"框架**：让用户感到"亏欠"，催回压力大

记忆强度引擎换一个抽象：**每个节点对每个用户有一个连续的"强度值"**，随时间衰减，主动检索时回升。用户回来时看到的是「现在状态如何」，不是「你欠了多少」。

这不是放弃 SRS 的科学基础——底层仍然是 FSRS 算法（被多项研究证明优于 SM-2 约 30%）。改变的是**呈现层和心智模型**。

---

## 核心抽象

```
记忆强度 (memory_strength): 0 ── 100
                            ↑     ↑
                            │     最强（刚成功检索）
                            完全遗忘
```

- **范围**：0-100，浮点
- **衰减**：随时间按 forgetting curve 单调递减
- **提升**：用户成功检索时跳升
- **计算**：基于 FSRS 算法的 stability / difficulty 派生

---

## 用户视角

用户**不直接看到** "memory_strength = 72.3" 这样的数字（太精确反而无意义）。看到的是：

1. **状态档位（4 档）**：
   - 未学（visit_count = 0）
   - 学过（60 ≤ 强度 < 85）
   - 熟练（强度 ≥ 85 且成功检索 ≥ 3 次）
   - 衰减中（曾达 60+，现在 < 60）

2. **横向强度条**（StatusBar 组件）—— 长度即强度、颜色即档位、衰减附 ▼：

   | 档位 | 视觉示意 | 颜色（变体 A） |
   |---|---|---|
   | 未学 | `┄┄┄┄┄┄┄┄` 空条，虚线边 | 灰 `#aea798` |
   | 学过 | `■■■■■■░░░░` | 黛青 `#436b80` |
   | 熟练 | `■■■■■■■■■›` 末尾 › | 松绿 `#5f7c4d` |
   | 衰减中 | `■■■■░░░░░░ ▼` | 赭石 `#a06d2e` |

   **三重编码**（长度 + 颜色 + 形状）色盲友好。完整实现见 [`/design/tokens.jsx`](../../../design/tokens.jsx) 的 `StatusBar` 组件。

3. **强度数值**（可选显示）：四舍五入到整数

4. **趋势提示**（可选）：「上周这里强度 90，本周 78，开始衰减」

**用户绝不看到的**：
- ❌ "due in 2 days"
- ❌ "overdue by 5 days"
- ❌ "复习次数 / 应复习次数"

---

## 算法层

### 底层使用 FSRS

```typescript
import { fsrs, generatorParameters, Card, Rating } from 'ts-fsrs';

const params = generatorParameters({
  // 关键：使用日级精度的算法，但输出按小时精度的强度
  request_retention: 0.9,
  maximum_interval: 36500,
});
const f = fsrs(params);

// 每次答题后调用
const card: Card = loadCardFromDB(userId, nodeId);
const result = f.next(card, new Date(), userAnswerRating);
// userAnswerRating: Again(1) | Hard(2) | Good(3) | Easy(4)

saveCardToDB(userId, nodeId, result.card);
```

### 派生 memory_strength

FSRS 自带 `stability`（记忆稳定性，单位是天）。把它映射到 0-100：

```typescript
function deriveMemoryStrength(card: Card, now: Date = new Date()): number {
  if (!card.last_review) return 0;

  const daysSinceReview = (now.getTime() - card.last_review.getTime()) / 86400000;

  // FSRS 的遗忘曲线公式
  const retrievability = Math.pow(1 + daysSinceReview / (9 * card.stability), -1);

  // 映射到 0-100
  return Math.round(retrievability * 100);
}
```

**关键性质**：这个函数是**纯函数**——给定 card 状态和当前时间，输出确定。意味着：

- 用户每次打开 app，前端实时计算当前强度（不需要服务器推 due date）
- 用户停一年回来，强度自然衰减到接近 0
- 不存在"过期"——只有"强度低"

### 答题 → Rating 映射

FSRS 接受 4 档输入。我们的题型如何映射：

| 用户答题结果 | Rating |
|---|---|
| 答错 | Again (1) |
| 答对但需要思考超过 X 秒 | Hard (2) |
| 答对且时间合理 | Good (3) |
| 答对且 < Y 秒（秒答） | Easy (4) |

阈值 X, Y 需要内容工程经验校准，初始值：X=15s（Hard 阈值）、Y=5s（Easy 阈值）。

**白纸召回**（F05）的 Rating 计算更复杂：
- 关键词召回率 100% → Easy
- 70-99% → Good
- 30-69% → Hard
- < 30% → Again

---

## 节点强度 vs 题目强度

一个节点挂多道题。强度是按**节点**还是按**题目**算？

**决策**：**双层都算**。
- 题目层：每道题独立 FSRS card（用于精准复习单题）
- 节点层：所有挂载题目的 stability 平均 / 加权 → 节点强度

实现：
```typescript
function computeNodeStrength(userId: string, nodeId: string): number {
  const questions = getQuestionsForNode(nodeId);
  const cards = questions.map(q => getCard(userId, q.id));
  const strengths = cards.map(c => deriveMemoryStrength(c));

  // 加权平均：难题权重更高
  return weightedAverage(strengths, questions.map(q => q.difficulty));
}
```

---

## 计算时机

**重要：所有强度计算都是即时派生的，不存数据库。**

数据库存的是 FSRS 内部状态（stability、difficulty、last_review）。强度值是请求时按当前时间实时算。

好处：
- 用户停一年回来打开 app，强度自然显示为接近 0（无需 cron job 更新）
- 不存在"陈旧数据"问题
- 简化数据库 schema

性能：
- 单节点强度计算 < 1ms（纯数学，无 I/O）
- 知识地图 500 节点全量计算 < 50ms

---

## 推荐复习的逻辑

用户在地图上看到「需要补强（10 个节点）」——这 10 个怎么挑？

```typescript
function getRecommendedReview(userId: string, limit = 10): NodeId[] {
  const allProgress = loadUserProgress(userId);
  return allProgress
    .filter(p => p.visit_count > 0)  // 学过的才算
    .map(p => ({
      nodeId: p.nodeId,
      strength: deriveMemoryStrength(p.card),
      // 衰减斜率：当前低且历史曾高的优先
      urgency: (p.peak_strength - currentStrength) / Math.max(daysSincePeak, 1),
    }))
    .sort((a, b) => b.urgency - a.urgency)
    .slice(0, limit)
    .map(x => x.nodeId);
}
```

**用户主动点开「需要补强」时才计算**。不主动推送、不发通知。

---

## 数据依赖

读：
- `user_node_progress`（FSRS 状态字段）
- `user_question_attempts`（用于历史趋势分析，可选）

写：
- `user_node_progress`（每次答题后更新 FSRS 状态）
- `user_question_attempts`（每次答题记录）

详见 [`../01-architecture/data-model.md`](../01-architecture/data-model.md)。

---

## 验收标准

MVP：

- [ ] FSRS 算法集成（`ts-fsrs` 包）
- [ ] 答题后正确更新 FSRS 内部状态
- [ ] 实时派生 memory_strength（0-100）
- [ ] 4 档 mastery_tier 派生函数
- [ ] 节点页显示当前强度
- [ ] 「需要补强」列表按 urgency 排序
- [ ] 用户答题时间 → Rating 的映射工作
- [ ] 单元测试：给定 FSRS state 和时间，强度计算确定

非 MVP：

- [ ] 强度趋势图（最近 30 天）
- [ ] FSRS 参数按用户个性化（先用默认值）
- [ ] 白纸召回的 Rating 映射（属 F05）

---

## 反模式（不做什么）

- ❌ 不计算 / 不显示 "due date"
- ❌ 不显示 "overdue" 状态
- ❌ 不用 streak / 连续天数
- ❌ 不预先 cron job 更新所有用户强度——纯派生
- ❌ 不强推「该复习了」通知（除非用户显式订阅）

---

## 设计依据

- 原则 1（状态 > 任务）：用强度数值 + 颜色，不用"该复习"
- 原则 2（行为驱动 > 预设节奏）：连续函数 + 实时派生，无日节奏
- ADR-002（state-not-task）：核心论证文档

## Open Questions

- [ ] FSRS 的默认参数对中医内容（概念深、关联多）是否合适？需要积累用户数据后调优。
- [ ] 节点强度 vs 题目强度的加权公式，是否需要让用户感知到？倾向于隐藏。
- [ ] 「衰减中」档位的阈值（60）是否合适？太低用户感觉不到衰减，太高频繁报警。需要 A/B 测试。
- [ ] 用户跳过题目（不答就退出）算什么？倾向于不计入 Rating，仅记录 attempt。

## Related Docs

- [`F01-node-page.md`](F01-node-page.md) — 节点页如何显示强度
- [`F03-question-types.md`](F03-question-types.md) — 答题反馈如何调用 FSRS
- [`F04-knowledge-map.md`](F04-knowledge-map.md) — 地图上的强度可视化
- [`../01-architecture/data-model.md`](../01-architecture/data-model.md) — FSRS 状态字段
- [`../04-decisions/ADR-002-state-not-task.md`](../04-decisions/ADR-002-state-not-task.md) — 此功能的根本论证

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.2 | 2026-05-23 | 状态可视化升级：用 StatusBar 横向强度条替代 ○● 符号 | — |
| 0.1 | 2026-05-23 | 初稿，确立连续强度模型 + FSRS 集成 | — |
