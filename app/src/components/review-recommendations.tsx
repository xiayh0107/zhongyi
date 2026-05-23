// 节点页侧栏推荐补强 — 显示用户其他衰减中节点

import Link from "next/link";
import { StatusBar } from "./status-bar";
import { TOKENS_A, type Tier } from "@/design/tokens";

type Item = {
  nodeId: string;
  title: string;
  summary: string;
  strength: number;
  tier: Tier;
};

export function ReviewRecommendations({ items }: { items: Item[] }) {
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
        Review · 需要补强
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((it) => (
          <li key={it.nodeId}>
            <Link
              href={`/nodes/${it.nodeId}`}
              className="block hover:opacity-80"
              style={{ textDecoration: "none", color: TOKENS_A.ink }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif" style={{ fontSize: 15 }}>
                  {it.title}
                </span>
                <StatusBar
                  tier={it.tier}
                  strength={it.strength}
                  width={48}
                  size="sm"
                />
              </div>
              <p
                className="line-clamp-1"
                style={{
                  fontSize: 12,
                  color: TOKENS_A.ink3,
                  marginTop: 2,
                  lineHeight: 1.5,
                }}
              >
                {it.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
