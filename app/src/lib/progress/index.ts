// 用户进度服务 — 把 FSRS card 持久化到 Prisma 的 UserNodeProgress 表

import { prisma } from "@/lib/db";
import {
  emptyCard,
  reviewCard,
  deriveMemoryStrength,
  ratingFromAttempt,
  type Card,
} from "@/lib/srs";
import { tierFromStrength, type Tier } from "@/design/tokens";

/**
 * 从 UserNodeProgress 行恢复 FSRS Card。
 * 数据库存的是 stability / difficulty / state / last_reviewed，
 * 转换为 ts-fsrs 期望的 Card 形状。
 */
function progressRowToCard(row: {
  fsrsStability: number | null;
  fsrsDifficulty: number | null;
  fsrsState: string | null;
  lastReviewed: Date | null;
}): Card {
  const c = emptyCard();
  if (row.lastReviewed) c.last_review = row.lastReviewed;
  if (row.fsrsStability != null) c.stability = row.fsrsStability;
  if (row.fsrsDifficulty != null) c.difficulty = row.fsrsDifficulty;
  // FSRS 7 用 State 枚举（0..3），DB 存的是字符串
  if (row.fsrsState) {
    const map: Record<string, number> = {
      new: 0,
      learning: 1,
      review: 2,
      relearning: 3,
    };
    c.state = (map[row.fsrsState] ?? 0) as Card["state"];
  }
  return c;
}

function cardStateToString(state: Card["state"]): string {
  const map = ["new", "learning", "review", "relearning"];
  return map[state] ?? "new";
}

export type NodeProgressSnapshot = {
  nodeId: string;
  strength: number;
  tier: Tier;
  peakStrength: number;
  visitCount: number;
  successCount: number;
  lastReviewed: Date | null;
};

/**
 * 取用户在某节点的当前进度快照。未访问过返回 untouched 默认值。
 */
export async function getNodeProgress(
  userId: string,
  nodeId: string,
): Promise<NodeProgressSnapshot> {
  const row = await prisma.userNodeProgress.findUnique({
    where: { userId_nodeId: { userId, nodeId } },
  });
  if (!row) {
    return {
      nodeId,
      strength: 0,
      tier: "untouched",
      peakStrength: 0,
      visitCount: 0,
      successCount: 0,
      lastReviewed: null,
    };
  }
  const card = progressRowToCard(row);
  const strength = deriveMemoryStrength(card);
  const tier = tierFromStrength(strength, row.peakStrength >= 60);
  return {
    nodeId,
    strength,
    tier,
    peakStrength: row.peakStrength,
    visitCount: row.visitCount,
    successCount: row.successCount,
    lastReviewed: row.lastReviewed,
  };
}

/**
 * 用户首次访问某节点（或再次访问）—— 更新 visit_count + first_visited
 */
export async function recordVisit(userId: string, nodeId: string) {
  await prisma.userNodeProgress.upsert({
    where: { userId_nodeId: { userId, nodeId } },
    create: {
      userId,
      nodeId,
      visitCount: 1,
      firstVisited: new Date(),
    },
    update: {
      visitCount: { increment: 1 },
    },
  });
}

/**
 * 答题后更新节点的 FSRS 卡片 + 强度。
 * 返回更新后的强度，用于 UI 显示「72 → 81 ↑」。
 */
export async function recordAttempt(opts: {
  userId: string;
  nodeId: string;
  questionId: string;
  correct: boolean;
  userAnswer: string;
  timeMs: number | null;
}): Promise<{ before: number; after: number; tier: Tier }> {
  const { userId, nodeId, questionId, correct, userAnswer, timeMs } = opts;

  // 1. 写 attempt 记录
  await prisma.userQuestionAttempt.create({
    data: {
      userId,
      nodeId,
      questionId,
      correct,
      userAnswer,
      timeMs,
    },
  });

  // 2. 读当前进度
  const existing = await prisma.userNodeProgress.findUnique({
    where: { userId_nodeId: { userId, nodeId } },
  });

  const oldCard = existing ? progressRowToCard(existing) : emptyCard();
  const beforeStrength = deriveMemoryStrength(oldCard);

  // 3. FSRS 更新
  const rating = ratingFromAttempt({ correct, timeMs });
  const newCard = reviewCard(oldCard, rating);
  const afterStrength = deriveMemoryStrength(newCard);
  const peakStrength = Math.max(existing?.peakStrength ?? 0, afterStrength);

  // 4. upsert 进度
  await prisma.userNodeProgress.upsert({
    where: { userId_nodeId: { userId, nodeId } },
    create: {
      userId,
      nodeId,
      lastReviewed: newCard.last_review,
      visitCount: 1,
      successCount: correct ? 1 : 0,
      peakStrength,
      fsrsStability: newCard.stability,
      fsrsDifficulty: newCard.difficulty,
      fsrsState: cardStateToString(newCard.state),
    },
    update: {
      lastReviewed: newCard.last_review,
      successCount: correct ? { increment: 1 } : undefined,
      peakStrength,
      fsrsStability: newCard.stability,
      fsrsDifficulty: newCard.difficulty,
      fsrsState: cardStateToString(newCard.state),
    },
  });

  const tier = tierFromStrength(afterStrength, peakStrength >= 60);

  return {
    before: beforeStrength,
    after: afterStrength,
    tier,
  };
}
