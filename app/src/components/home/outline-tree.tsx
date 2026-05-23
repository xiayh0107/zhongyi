// 主页大纲树 — 按 layer+category 分组
// 设计来源：design/a-home.jsx 的 OutlineTreeA

import Link from "next/link";
import { StatusBar } from "@/components/status-bar";
import { TOKENS_A } from "@/design/tokens";
import type { OutlineGroup } from "@/lib/content/outline";
import type { NodeStatus } from "@/lib/progress/overview";

export function OutlineTree({
  groups,
  statusByNode,
}: {
  groups: OutlineGroup[];
  statusByNode: Map<string, NodeStatus>;
}) {
  return (
    <div id="outline" className="flex flex-col gap-7">
      {groups.map((group) => {
        const learned = group.nodes.filter((n) => {
          const s = statusByNode.get(n.nodeId);
          return s && s.tier !== "untouched";
        }).length;

        return (
          <section key={`${group.layer}-${group.category ?? "x"}`}>
            <header
              className="flex items-baseline justify-between"
              style={{
                marginBottom: 12,
                paddingBottom: 6,
                borderBottom: `1px solid ${TOKENS_A.line}`,
              }}
            >
              <div>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: TOKENS_A.ink3,
                    letterSpacing: "0.18em",
                    marginRight: 12,
                  }}
                >
                  {group.layer}
                </span>
                <span
                  className="font-serif"
                  style={{ fontSize: 18, color: TOKENS_A.ink, fontWeight: 500 }}
                >
                  {group.label}
                </span>
              </div>
              <span
                className="font-mono tabular-nums"
                style={{ fontSize: 11, color: TOKENS_A.ink3 }}
              >
                {learned} / {group.nodes.length}
              </span>
            </header>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {group.nodes.map((node) => {
                const status = statusByNode.get(node.nodeId);
                return (
                  <li key={node.nodeId}>
                    <Link
                      href={`/nodes/${node.nodeId}`}
                      className="flex items-center justify-between gap-3 py-1 hover:opacity-80"
                      style={{ textDecoration: "none", color: TOKENS_A.ink }}
                    >
                      <span className="font-serif" style={{ fontSize: 15 }}>
                        {node.title}
                      </span>
                      <StatusBar
                        tier={status?.tier ?? "untouched"}
                        strength={status?.strength ?? 0}
                        width={48}
                        size="sm"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
