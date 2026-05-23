// 完整 mastery_tier 派生 — 综合 strength、success_count、visit_count、peak_strength
// 设计依据：docs/02-features/F02-memory-strength.md "状态档位（4 档）" 章节

import type { Tier } from "@/design/tokens";

export type ProgressForTier = {
  strength: number;
  visitCount: number;
  successCount: number;
  peakStrength: number;
};

/**
 * 严格档位规则（与 F02 文档一致）：
 *   untouched  → visit_count = 0
 *   mastered   → strength ≥ 85 且 success_count ≥ 3
 *   learned    → strength ≥ 60（含未达 mastered 标准的高分情形）
 *   fading     → 曾达到 学过/熟练（peak ≥ 60），现 strength < 60
 *
 * 这与 tokens.ts 的 tierFromStrength（简化版）有一处差异：
 * "strength ≥ 85 但 success_count < 3" 在这里仍是 learned，
 * 简化版会标 mastered。两个函数各有用途——UI 单点用简化、统计/筛选用完整。
 */
export function tierFromProgress(p: ProgressForTier): Tier {
  if (p.visitCount === 0) return "untouched";
  if (p.strength >= 85 && p.successCount >= 3) return "mastered";
  if (p.strength >= 60) return "learned";
  if (p.peakStrength >= 60) return "fading";
  return "untouched";
}

/**
 * 衰减紧迫度 — 用于推荐复习排序。
 * 值越高越紧迫（越应该先复习）。
 *
 * 启发式：
 *   urgency = (peak - current) / max(daysSinceReview, 1)
 *
 * 直觉：
 *   - 曾经很熟（peak 高）现在掉得多（current 低）= 紧迫
 *   - 但如果刚复习过（days 小）= 不紧迫（即使下降）
 *   - 从未学过的不在此函数范围（应单独 filter visit_count > 0）
 */
export function urgencyScore(p: {
  strength: number;
  peakStrength: number;
  lastReviewed: Date | null;
}): number {
  const gap = Math.max(0, p.peakStrength - p.strength);
  if (gap === 0) return 0;
  const days = p.lastReviewed
    ? Math.max(
        1,
        (Date.now() - p.lastReviewed.getTime()) / 86_400_000,
      )
    : 1;
  return gap / days;
}
