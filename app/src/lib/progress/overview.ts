// 主页的「状态概览」+「最近继续」数据
// 一次取所有数据，避免主页多次 round-trip

import { prisma } from "@/lib/db";
import { getContentGraph } from "@/lib/content/loader";
import { deriveMemoryStrength, type Card } from "@/lib/srs";
import { tierFromProgress } from "./helpers";
import type { Tier } from "@/design/tokens";

export type OverviewCounts = {
  total: number;
  untouched: number;
  learned: number;
  mastered: number;
  fading: number;
};

export type NodeStatus = {
  nodeId: string;
  tier: Tier;
  strength: number;
};

function rowToCard(row: {
  fsrsStability: number | null;
  fsrsDifficulty: number | null;
  lastReviewed: Date | null;
  fsrsState: string | null;
}): Card {
  return {
    due: new Date(),
    stability: row.fsrsStability ?? 0,
    difficulty: row.fsrsDifficulty ?? 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: 0,
    last_review: row.lastReviewed ?? undefined,
    learning_steps: 0,
  } as Card;
}

/**
 * 主页一次性取：所有节点的当前 tier 映射 + 4 档分布 + 最近正在做的会话节点。
 */
export async function getOverview(userId: string | null): Promise<{
  counts: OverviewCounts;
  statusByNode: Map<string, NodeStatus>;
  resumeNodeId: string | null;
}> {
  const graph = getContentGraph();
  const totalNodes = graph.nodes.size;

  if (!userId) {
    return {
      counts: {
        total: totalNodes,
        untouched: totalNodes,
        learned: 0,
        mastered: 0,
        fading: 0,
      },
      statusByNode: new Map(),
      resumeNodeId: null,
    };
  }

  const rows = await prisma.userNodeProgress.findMany({ where: { userId } });
  const statusByNode = new Map<string, NodeStatus>();
  const counts: OverviewCounts = {
    total: totalNodes,
    untouched: totalNodes,
    learned: 0,
    mastered: 0,
    fading: 0,
  };

  for (const row of rows) {
    if (!graph.nodes.has(row.nodeId)) continue;
    const strength = deriveMemoryStrength(rowToCard(row));
    const tier = tierFromProgress({
      strength,
      visitCount: row.visitCount,
      successCount: row.successCount,
      peakStrength: row.peakStrength,
    });
    statusByNode.set(row.nodeId, { nodeId: row.nodeId, tier, strength });
    if (tier !== "untouched") counts.untouched -= 1;
    if (tier === "learned") counts.learned += 1;
    else if (tier === "mastered") counts.mastered += 1;
    else if (tier === "fading") counts.fading += 1;
  }

  // 最近访问的节点（用于「继续上次」入口）
  const recent = await prisma.userQuestionAttempt.findFirst({
    where: { userId },
    orderBy: { attemptedAt: "desc" },
    select: { nodeId: true },
  });

  return {
    counts,
    statusByNode,
    resumeNodeId: recent?.nodeId ?? null,
  };
}
