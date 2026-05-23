// 推荐复习 & 探索 — 主页和节点页的「想做点什么？」入口背后的算法

import { prisma } from "@/lib/db";
import { deriveMemoryStrength, type Card } from "@/lib/srs";
import { urgencyScore, tierFromProgress } from "./helpers";
import { getContentGraph } from "@/lib/content/loader";
import type { Tier } from "@/design/tokens";

export type RecommendedNode = {
  nodeId: string;
  title: string;
  summary: string;
  strength: number;
  tier: Tier;
  urgency: number;
};

function rowToCard(row: {
  fsrsStability: number | null;
  fsrsDifficulty: number | null;
  lastReviewed: Date | null;
  fsrsState: string | null;
}): Card {
  // 部分字段——足够用 deriveMemoryStrength
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
 * 推荐补强：用户访问过但当前强度偏低的节点，按 urgency 排序。
 */
export async function getRecommendedReview(
  userId: string,
  limit = 10,
): Promise<RecommendedNode[]> {
  const rows = await prisma.userNodeProgress.findMany({
    where: { userId, visitCount: { gt: 0 } },
  });

  const graph = getContentGraph();
  const scored: RecommendedNode[] = [];

  for (const row of rows) {
    const node = graph.nodes.get(row.nodeId);
    if (!node) continue; // 节点已删除，跳过
    const strength = deriveMemoryStrength(rowToCard(row));
    const tier = tierFromProgress({
      strength,
      visitCount: row.visitCount,
      successCount: row.successCount,
      peakStrength: row.peakStrength,
    });
    if (tier !== "fading" && tier !== "learned") continue;
    if (tier === "learned" && strength >= 75) continue; // 高分 learned 不需要补强
    const urgency = urgencyScore({
      strength,
      peakStrength: row.peakStrength,
      lastReviewed: row.lastReviewed,
    });
    scored.push({
      nodeId: row.nodeId,
      title: node.title,
      summary: node.summary,
      strength,
      tier,
      urgency,
    });
  }

  return scored.sort((a, b) => b.urgency - a.urgency).slice(0, limit);
}

/**
 * 推荐探索：从用户已学节点的相邻未学节点中挑一个。
 * 启发式：最近学过的节点的邻居优先；如果用户从未学过任何节点，返回 L1 公理节点。
 */
export async function recommendNewNode(userId: string): Promise<string | null> {
  const graph = getContentGraph();

  const visited = await prisma.userNodeProgress.findMany({
    where: { userId, visitCount: { gt: 0 } },
    orderBy: { lastReviewed: "desc" },
    take: 20,
  });

  const visitedIds = new Set(visited.map((v) => v.nodeId));

  if (visited.length === 0) {
    // 兜底：选第一个 L1 节点
    for (const node of graph.nodes.values()) {
      if (node.layer === "L1") return node.id;
    }
    // 没 L1：选第一个 L2
    for (const node of graph.nodes.values()) {
      if (node.layer === "L2") return node.id;
    }
    return null;
  }

  // 从最近学过的节点向外辐射
  for (const v of visited) {
    const node = graph.nodes.get(v.nodeId);
    if (!node) continue;
    const candidates = [
      ...node.outgoing_links,
      ...node.relations.map((r) => r.target),
    ];
    for (const cid of candidates) {
      if (!visitedIds.has(cid) && graph.nodes.has(cid)) return cid;
    }
  }

  // 实在没有相邻未学：选任意未学节点
  for (const [nid] of graph.nodes) {
    if (!visitedIds.has(nid)) return nid;
  }

  return null;
}
