// 节点页侧栏 — 最近答题列表

import { TOKENS_A } from "@/design/tokens";
import type { RecentAttempt } from "@/lib/progress/attempts";

function timeAgo(d: Date) {
  const diff = Date.now() - d.getTime();
  const m = diff / 60_000;
  if (m < 1) return "刚刚";
  if (m < 60) return `${Math.floor(m)} 分钟前`;
  const h = m / 60;
  if (h < 24) return `${Math.floor(h)} 小时前`;
  const d2 = h / 24;
  if (d2 < 30) return `${Math.floor(d2)} 天前`;
  return d.toLocaleDateString("zh-CN");
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

export function RecentAttempts({ items }: { items: RecentAttempt[] }) {
  if (items.length === 0) return null;
  return (
    <div
      style={{
        background: TOKENS_A.paper,
        border: `1px solid ${TOKENS_A.line}`,
        padding: "14px 16px",
      }}
    >
      <div
        className="font-mono"
        style={{
          fontSize: 10,
          color: TOKENS_A.ink3,
          letterSpacing: "0.2em",
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        Recent · 最近答题
      </div>
      <ul className="flex flex-col gap-2.5">
        {items.map((a) => (
          <li key={a.id} className="flex items-start gap-2">
            <span
              style={{
                color: a.correct ? TOKENS_A.s_mastered : TOKENS_A.s_fading,
                fontSize: 13,
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              {a.correct ? "✓" : "✕"}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className="font-serif"
                style={{
                  fontSize: 13,
                  color: TOKENS_A.ink,
                  lineHeight: 1.5,
                }}
              >
                {truncate(a.stem, 32)}
              </p>
              <p
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: TOKENS_A.ink3,
                  marginTop: 2,
                  letterSpacing: "0.08em",
                }}
              >
                {timeAgo(a.attemptedAt)}
                {a.timeMs != null && ` · ${(a.timeMs / 1000).toFixed(1)}s`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
