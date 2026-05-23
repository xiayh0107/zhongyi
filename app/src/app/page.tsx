// F04 知识地图（主页）— 设计来源：design/a-home.jsx
// 状态概览 + 想做点什么 4 入口 + 大纲树（分组按 layer/category）

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getOverview } from "@/lib/progress/overview";
import { buildOutline, getNodeMeta } from "@/lib/content/outline";
import {
  getRecommendedReview,
  recommendNewNode,
} from "@/lib/progress/recommend";
import { StatusOverview } from "@/components/home/status-overview";
import { EntryCards } from "@/components/home/entry-cards";
import { OutlineTree } from "@/components/home/outline-tree";
import { WikiLinkHover, type WikiLinkData } from "@/components/wiki-link-hover";
import { TOKENS_A } from "@/design/tokens";

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.id) {
    // 未登录直接到登录页（落地页是 Open Question，MVP 不做）
    redirect("/login");
  }

  const userId = session.user.id;
  const overview = await getOverview(userId);
  const groups = buildOutline();

  // 推荐
  const newNodeId = await recommendNewNode(userId);
  const recommended = newNodeId
    ? (() => {
        const n = getNodeMeta(newNodeId);
        return n ? { id: n.id, title: n.title } : null;
      })()
    : null;
  const resumeNode = overview.resumeNodeId
    ? (() => {
        const n = getNodeMeta(overview.resumeNodeId);
        return n ? { id: n.id, title: n.title } : null;
      })()
    : null;

  // 推荐补强（右侧栏）
  const reviewItems = await getRecommendedReview(userId, 5);

  // hover 预览数据
  const linkTargets: WikiLinkData[] = [];
  const seen = new Set<string>();
  for (const g of groups) {
    for (const n of g.nodes) {
      if (seen.has(n.nodeId)) continue;
      seen.add(n.nodeId);
      const meta = getNodeMeta(n.nodeId);
      if (meta) {
        linkTargets.push({
          id: meta.id,
          title: meta.title,
          summary: meta.summary,
          exists: true,
        });
      }
    }
  }

  return (
    <div
      className="min-h-full"
      style={{ background: TOKENS_A.bg, color: TOKENS_A.ink }}
    >
      <TopBar email={session.user.email ?? ""} signOut={signOutAction} />

      <div className="grid" style={{ gridTemplateColumns: "1fr 360px" }}>
        {/* ── 左：状态 + 入口 + 大纲 ── */}
        <main style={{ padding: "40px 56px 80px" }}>
          {/* 问候 */}
          <div
            className="flex items-baseline justify-between"
            style={{ marginBottom: 32 }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: TOKENS_A.ink3,
                  letterSpacing: "0.2em",
                }}
              >
                {todayLabel()}
              </div>
              <div
                className="font-serif"
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  marginTop: 6,
                  color: TOKENS_A.ink,
                }}
              >
                你好
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 36 }}>
            <StatusOverview counts={overview.counts} />
          </div>

          <div style={{ marginBottom: 36 }}>
            <EntryCards
              fadingCount={overview.counts.fading}
              recommended={recommended}
              resumeNode={resumeNode}
            />
          </div>

          <div style={{ marginTop: 56 }}>
            <h2
              className="font-serif font-medium"
              style={{
                fontSize: 22,
                color: TOKENS_A.ink,
                marginBottom: 20,
              }}
            >
              你的知识地图
            </h2>
            <OutlineTree groups={groups} statusByNode={overview.statusByNode} />
          </div>
        </main>

        {/* ── 右：推荐补强侧栏 ── */}
        <aside
          style={{
            background: TOKENS_A.paper,
            borderLeft: `1px solid ${TOKENS_A.line}`,
            padding: "40px 32px",
          }}
        >
          <ReviewSidebar items={reviewItems} />
        </aside>
      </div>

      <WikiLinkHover targets={linkTargets} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────

function ReviewSidebar({
  items,
}: {
  items: Awaited<ReturnType<typeof getRecommendedReview>>;
}) {
  return (
    <div>
      <h3
        className="font-mono"
        style={{
          fontSize: 10,
          color: TOKENS_A.ink3,
          letterSpacing: "0.2em",
          marginBottom: 14,
          textTransform: "uppercase",
        }}
      >
        Review · 需要补强
      </h3>
      {items.length === 0 ? (
        <p
          style={{
            fontSize: 13,
            color: TOKENS_A.ink2,
            lineHeight: 1.7,
          }}
        >
          目前没有衰减中的节点。当某节点强度下降到 60 以下时会出现在这里。
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((it) => (
            <li key={it.nodeId}>
              <Link
                href={`/nodes/${it.nodeId}`}
                className="block hover:opacity-80 wiki-link"
                data-node-id={it.nodeId}
                style={{
                  textDecoration: "none",
                  color: TOKENS_A.ink,
                  padding: "8px 0",
                  borderBottom: `1px dotted ${TOKENS_A.line2}`,
                }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-serif" style={{ fontSize: 15 }}>
                    {it.title}
                  </span>
                  <span
                    className="font-mono tabular-nums"
                    style={{ fontSize: 11, color: TOKENS_A.ink2 }}
                  >
                    {it.strength}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: TOKENS_A.ink3,
                    marginTop: 2,
                    lineHeight: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {it.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TopBar({
  email,
  signOut,
}: {
  email: string;
  signOut: () => Promise<void>;
}) {
  return (
    <div
      className="h-14 px-8 flex items-center justify-between"
      style={{ borderBottom: `1px solid ${TOKENS_A.line}`, background: TOKENS_A.bg }}
    >
      <div
        className="font-serif"
        style={{
          fontSize: 17,
          color: TOKENS_A.ink,
          letterSpacing: "0.04em",
        }}
      >
        Fast Memory · 中医
      </div>
      <div className="flex items-center gap-5">
        <Link
          href="/search"
          className="font-mono"
          style={{
            fontSize: 11,
            color: TOKENS_A.ink3,
            letterSpacing: "0.12em",
            textDecoration: "none",
          }}
        >
          🔍 搜索
        </Link>
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            color: TOKENS_A.ink3,
            letterSpacing: "0.08em",
          }}
        >
          {email}
        </span>
        <form action={signOut}>
          <button
            type="submit"
            className="font-mono"
            style={{
              fontSize: 11,
              color: TOKENS_A.ink3,
              letterSpacing: "0.12em",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            退出
          </button>
        </form>
      </div>
    </div>
  );
}

function todayLabel() {
  const d = new Date();
  const cnMonth = [
    "一", "二", "三", "四", "五", "六",
    "七", "八", "九", "十", "十一", "十二",
  ];
  return `${d.getFullYear()} · ${cnMonth[d.getMonth()]}月${d.getDate()}日`;
}
