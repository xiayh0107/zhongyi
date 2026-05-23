// 答题历史查询 — 节点页侧栏「最近答题」

import { prisma } from "@/lib/db";
import { getContentGraph } from "@/lib/content/loader";

export type RecentAttempt = {
  id: string;
  questionId: string;
  stem: string;
  correct: boolean;
  attemptedAt: Date;
  timeMs: number | null;
};

export async function getRecentAttempts(
  userId: string,
  nodeId: string,
  limit = 5,
): Promise<RecentAttempt[]> {
  const rows = await prisma.userQuestionAttempt.findMany({
    where: { userId, nodeId },
    orderBy: { attemptedAt: "desc" },
    take: limit,
  });

  if (rows.length === 0) return [];

  const graph = getContentGraph();
  const questionsById = new Map(graph.questions.map((q) => [q.id, q]));

  return rows.map((r) => ({
    id: r.id,
    questionId: r.questionId,
    stem: questionsById.get(r.questionId)?.stem ?? "(题目已删除)",
    correct: r.correct,
    attemptedAt: r.attemptedAt,
    timeMs: r.timeMs,
  }));
}
