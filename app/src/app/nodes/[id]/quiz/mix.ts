// 题型混合策略 — 从候选题里挑 N 道
// 设计：F03 文档「题型混合策略」章节

import type { Question } from "@/types/question";

const PLAYABLE_TYPES = new Set([
  "single_choice",
  "multiple_choice",
  "fill_in_blank",
  "match",
  "sort",
]);

// 主动调取型（强检索）：题目里至少 1 道这类
const RECALL_HEAVY = new Set([
  "fill_in_blank",
  "match",
  "sort",
]);

/**
 * 从候选题里选 N 道，保证：
 * 1. 类型多样：尽量覆盖多种题型
 * 2. 不连续 3 题同类型
 * 3. 若可能，至少包含 1 道主动调取类型
 * 4. 简单优先：先 single_choice，再插入复杂题型
 *
 * 这是 MVP 简化版——未来可叠加 FSRS 强度排序（弱者优先）。
 */
export function pickQuestions(candidates: Question[], n = 5): Question[] {
  const playable = candidates.filter((q) => PLAYABLE_TYPES.has(q.type));
  if (playable.length === 0) return [];

  // 按 type 分组
  const byType = new Map<string, Question[]>();
  for (const q of playable) {
    if (!byType.has(q.type)) byType.set(q.type, []);
    byType.get(q.type)!.push(q);
  }

  const order: string[] = [];
  const result: Question[] = [];

  // round-robin 拣选——每轮从每类抽一道
  while (result.length < n) {
    let pickedThisRound = false;
    for (const [type, qs] of byType) {
      if (qs.length === 0) continue;
      // 连续 3 题相同类型 → 跳过
      if (order.length >= 2 && order[order.length - 1] === type && order[order.length - 2] === type) {
        continue;
      }
      const q = qs.shift()!;
      result.push(q);
      order.push(type);
      pickedThisRound = true;
      if (result.length >= n) break;
    }
    if (!pickedThisRound) break; // 所有类型都没题了
  }

  // 如果不够 N 道，无视类型连续性继续填
  if (result.length < n) {
    for (const [, qs] of byType) {
      while (qs.length > 0 && result.length < n) {
        result.push(qs.shift()!);
      }
    }
  }

  // 保证至少一道 recall-heavy 类型（如果候选中有）
  const hasRecall = result.some((q) => RECALL_HEAVY.has(q.type));
  if (!hasRecall) {
    const recallCandidate = playable.find(
      (q) => RECALL_HEAVY.has(q.type) && !result.includes(q),
    );
    if (recallCandidate && result.length >= 1) {
      // 替换最后一道非 recall 题
      const lastNonRecallIdx = result
        .map((q, i) => ({ q, i }))
        .reverse()
        .find((x) => !RECALL_HEAVY.has(x.q.type))?.i;
      if (lastNonRecallIdx != null) {
        result[lastNonRecallIdx] = recallCandidate;
      }
    }
  }

  return result.slice(0, n);
}
