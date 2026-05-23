// 状态条 — 长度即强度、颜色即档位、衰减附 ▼
// 三重编码（长度+颜色+形状）色盲友好
// 设计来源：design/tokens.jsx 的 StatusBar 组件

import { TIERS, TOKENS_A, type Tier } from "@/design/tokens";

export type StatusBarProps = {
  tier?: Tier;
  /** 0-100 */
  strength?: number;
  /** 像素宽度 */
  width?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
};

export function StatusBar({
  tier = "untouched",
  strength = 0,
  width = 56,
  size = "md",
  showValue = false,
}: StatusBarProps) {
  const tierDef = TIERS[tier];
  const color = TOKENS_A[tierDef.key];
  const h = size === "sm" ? 4 : size === "lg" ? 8 : 5;
  const fillW =
    tier === "untouched"
      ? 0
      : Math.max(6, Math.round(width * Math.min(1, Math.max(0.08, strength / 100))));

  return (
    <span className="inline-flex items-center gap-1.5 font-inherit">
      <span
        className="relative inline-block"
        style={{
          width,
          height: h,
          background: tier === "untouched" ? "transparent" : TOKENS_A.chartTrack,
          border: tier === "untouched" ? `1px dashed ${TOKENS_A.line2}` : "none",
          borderRadius: 0,
        }}
      >
        {tier !== "untouched" && (
          <span
            className="absolute left-0 top-0"
            style={{ width: fillW, height: h, background: color }}
          />
        )}
        {tier === "mastered" && (
          <span
            className="absolute leading-none"
            style={{
              right: -7,
              top: -1,
              fontSize: 9,
              color,
              letterSpacing: 0,
            }}
          >
            ›
          </span>
        )}
      </span>
      {tier === "fading" && (
        <span style={{ fontSize: 9, color, lineHeight: 1 }}>▼</span>
      )}
      {showValue && (
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: size === "sm" ? 10 : 11,
            color: TOKENS_A.ink2,
            letterSpacing: 0,
          }}
        >
          {tier === "untouched" ? "--" : Math.round(strength)}
        </span>
      )}
    </span>
  );
}

/** 流文本中用的小圆点 */
export function TierDot({
  tier = "untouched",
  size = 10,
}: {
  tier?: Tier;
  size?: number;
}) {
  const tierDef = TIERS[tier];
  const color = TOKENS_A[tierDef.key];
  if (tier === "untouched") {
    return (
      <span
        className="inline-block rounded-full"
        style={{
          width: size,
          height: size,
          border: `1px solid ${TOKENS_A.line2}`,
        }}
      />
    );
  }
  return (
    <span
      className="relative inline-block rounded-full"
      style={{ width: size, height: size, background: color }}
    >
      {tier === "fading" && (
        <span
          className="absolute"
          style={{ top: -1, right: -5, fontSize: 8, color }}
        >
          ▼
        </span>
      )}
    </span>
  );
}
