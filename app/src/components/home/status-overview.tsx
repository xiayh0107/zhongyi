// 主页状态概览 — 4 档分布条形 + 数量
// 设计来源：design/a-home.jsx 的 StatusRowA + DistributionBar

import { TOKENS_A, TIERS } from "@/design/tokens";
import type { OverviewCounts } from "@/lib/progress/overview";

export function StatusOverview({ counts }: { counts: OverviewCounts }) {
  const parts = [
    { tier: "mastered" as const, n: counts.mastered },
    { tier: "learned" as const, n: counts.learned },
    { tier: "fading" as const, n: counts.fading },
    { tier: "untouched" as const, n: counts.untouched },
  ];

  return (
    <div
      style={{
        background: TOKENS_A.paper,
        border: `1px solid ${TOKENS_A.line}`,
        padding: "20px 24px",
      }}
    >
      <div className="flex items-baseline justify-between" style={{ marginBottom: 16 }}>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: TOKENS_A.ink3,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Overview · 状态概览
        </span>
        <span
          className="font-mono"
          style={{ fontSize: 11, color: TOKENS_A.ink3 }}
        >
          共 {counts.total} 节点
        </span>
      </div>

      {/* 分布条形 */}
      <div
        className="flex w-full"
        style={{
          height: 8,
          border: `1px solid ${TOKENS_A.line}`,
          background: TOKENS_A.sheet,
          marginBottom: 16,
        }}
      >
        {parts.map((p) => {
          if (p.n === 0) return null;
          const w = (p.n / counts.total) * 100;
          return (
            <div
              key={p.tier}
              style={{
                width: `${w}%`,
                background: TOKENS_A[TIERS[p.tier].key],
              }}
            />
          );
        })}
      </div>

      {/* 4 档 legend */}
      <div className="grid grid-cols-4 gap-3">
        {parts.map((p) => (
          <div key={p.tier} className="flex items-center gap-2">
            <span
              className="inline-block"
              style={{
                width: 10,
                height: 10,
                background: TOKENS_A[TIERS[p.tier].key],
              }}
            />
            <span
              style={{ fontSize: 12, color: TOKENS_A.ink2 }}
            >
              {TIERS[p.tier].label}
            </span>
            <span
              className="font-mono tabular-nums"
              style={{
                fontSize: 12,
                color: TOKENS_A.ink,
                marginLeft: "auto",
              }}
            >
              {p.n}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
