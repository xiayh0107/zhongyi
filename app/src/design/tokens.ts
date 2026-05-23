// Design tokens — 变体 A（MVP 唯一变体，详见 docs/04-decisions/ADR-005）
// 移植自 /design/tokens.jsx · 保留色值，去掉 window 全局，加 TypeScript 类型。

export const TOKENS_A = {
  bg:        "#f6f2e9",   // page bg (subtle warm)
  paper:     "#fbf8f1",   // card / surface
  sheet:     "#ffffff",   // crisp inner sheet
  ink:       "#1f1c17",
  ink2:      "#534f47",
  ink3:      "#8a847a",
  line:      "#e0d9c8",
  line2:     "#cdc4af",
  accent:    "#365240",   // deep pine — used for CTA / focused state
  rule:      "#cbc1aa",
  // 4 status tiers
  s_untouched: "#aea798",
  s_learned:   "#436b80",
  s_mastered:  "#5f7c4d",
  s_fading:    "#a06d2e",
  chartTrack:  "#ece5d3",
} as const;

export const TIERS = {
  untouched: { label: "未学",   key: "s_untouched", glyph: "○" },
  learned:   { label: "学过",   key: "s_learned",   glyph: "─" },
  mastered:  { label: "熟练",   key: "s_mastered",  glyph: "═" },
  fading:    { label: "衰减中", key: "s_fading",    glyph: "▼" },
} as const;

export type Tier = keyof typeof TIERS;

/**
 * 简化派生：仅从 strength + 是否曾达 60 推断档位。
 * 用于 UI 单点显示（如 wiki-link hover），不需要 success_count 等元数据。
 *
 * 完整派生（含 success_count 阈值）见 lib/progress/helpers.ts 的 tierFromProgress。
 */
export function tierFromStrength(
  s: number | null | undefined,
  everReached: boolean,
): Tier {
  if (s == null) return "untouched";
  if (s >= 85) return "mastered";
  if (s >= 60) return "learned";
  if (everReached) return "fading";
  return "untouched";
}

/** Tailwind class 友好的 token 名（与 globals.css @theme 中的 var 名对应） */
export const TOKEN_VAR = {
  bg:          "var(--color-bg)",
  paper:       "var(--color-paper)",
  sheet:       "var(--color-sheet)",
  ink:         "var(--color-ink)",
  ink2:        "var(--color-ink-2)",
  ink3:        "var(--color-ink-3)",
  line:        "var(--color-line)",
  line2:       "var(--color-line-2)",
  accent:      "var(--color-accent)",
  s_untouched: "var(--color-tier-untouched)",
  s_learned:   "var(--color-tier-learned)",
  s_mastered:  "var(--color-tier-mastered)",
  s_fading:    "var(--color-tier-fading)",
  chartTrack:  "var(--color-chart-track)",
} as const;
