"use server";

import { auth } from "@/auth";
import { getNode } from "@/lib/content/loader";
import { matchRecall, type RecallMatchResult } from "@/lib/content/recall-match";
import { recordAttempt } from "@/lib/progress";

export type SelfRating = "hard" | "good" | "easy";

export type RecallSubmitResult = {
  match: RecallMatchResult;
  /** server 端建议的对错判定（用户可在自评时覆盖） */
  suggestedCorrect: boolean;
  /** 反映强度变化（仅登录时） */
  before: number;
  after: number;
  loggedIn: boolean;
};

/**
 * 提交白纸召回 — 只算判定，不写 DB（写入由 finalizeSelfRating 在用户自评后做）。
 */
export async function evaluateRecall(input: {
  nodeId: string;
  userText: string;
  timeMs: number;
}): Promise<RecallSubmitResult & { sessionToken: string }> {
  const node = getNode(input.nodeId);
  if (!node) throw new Error(`Node ${input.nodeId} not found`);

  const match = matchRecall(input.userText, node);

  // server 端启发式判定（covers ≥ 0.5 算"基本对"，否则算错）
  const suggestedCorrect = match.coverage >= 0.5;

  const session = await auth();
  // session token 用来 finalize 时定位本次 evaluation（简化：直接把所需数据原样回传）
  // 这里把 userText + timeMs + nodeId 作为后续 finalize 的 hidden state
  const sessionToken = JSON.stringify({
    nodeId: input.nodeId,
    timeMs: input.timeMs,
    coverage: match.coverage,
  });

  return {
    match,
    suggestedCorrect,
    before: 0, // 评估阶段不写入 → before/after 在 finalize 时计算
    after: 0,
    loggedIn: !!session?.user?.id,
    sessionToken,
  };
}

/**
 * 用户自评后写入 FSRS。
 * 把自评映射到对错 + 时间，调用 recordAttempt（题目 ID 用一个特殊的 q-recall- 前缀）。
 */
export async function finalizeSelfRating(input: {
  sessionToken: string;
  rating: SelfRating;
}): Promise<{
  before: number;
  after: number;
  loggedIn: boolean;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { before: 0, after: 0, loggedIn: false };
  }

  const ctx = JSON.parse(input.sessionToken) as {
    nodeId: string;
    timeMs: number;
    coverage: number;
  };

  // 自评 → 对错 + 时间装填以触发 FSRS Rating 映射
  // 映射策略（与 ratingFromAttempt 互补）：
  //   hard → 答错 → Rating.Again
  //   good → 答对 + 标准时间 → Rating.Good
  //   easy → 答对 + 短时间 → Rating.Easy
  const correct = input.rating !== "hard";
  let timeMs = ctx.timeMs;
  if (input.rating === "easy") timeMs = Math.min(timeMs, 4000); // 强制 < 5s
  else if (input.rating === "good") {
    timeMs = Math.min(Math.max(timeMs, 6000), 12000); // 5-15s 区间
  }

  const { before, after } = await recordAttempt({
    userId: session.user.id,
    nodeId: ctx.nodeId,
    // 用伪 question id 表示这是一次白纸召回
    questionId: `recall-${ctx.nodeId}`,
    correct,
    userAnswer: `recall:${input.rating}:coverage=${ctx.coverage.toFixed(2)}`,
    timeMs,
  });

  return { before, after, loggedIn: true };
}
