// F01 节点页 — 设计来源：design/a-node.jsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { getNode, getQuestionsForNode, getBacklinks } from "@/lib/content/loader";
import { renderMarkdown } from "@/lib/content/markdown";
import { auth } from "@/auth";
import {
  getNodeProgress,
  recordVisit,
  type NodeProgressSnapshot,
} from "@/lib/progress";
import { getRecommendedReview } from "@/lib/progress/recommend";
import { getRecentAttempts, type RecentAttempt } from "@/lib/progress/attempts";
import { StatusBar } from "@/components/status-bar";
import { TemplateTable } from "@/components/template-table";
import { TOKENS_A } from "@/design/tokens";
import { ReviewRecommendations } from "@/components/review-recommendations";
import { RecentAttempts } from "@/components/recent-attempts";
import { WikiLinkHover, type WikiLinkData } from "@/components/wiki-link-hover";
import { getContentGraph } from "@/lib/content/loader";

const LAYER_LABEL: Record<string, string> = {
  L1: "L1 · 世界观",
  L2: "L2 · 实体",
  L3: "L3 · 关系",
  L4: "L4 · 事实",
  L5: "L5 · 应用",
};

export default async function NodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const node = getNode(id);
  if (!node) notFound();

  const questions = getQuestionsForNode(id);
  const backlinks = getBacklinks(id);

  // 记录访问 + 取进度 + 推荐补强（仅排除当前节点）
  const session = await auth();
  let progress: NodeProgressSnapshot | null = null;
  let recommendations: Awaited<ReturnType<typeof getRecommendedReview>> = [];
  let recentAttempts: RecentAttempt[] = [];
  if (session?.user?.id) {
    await recordVisit(session.user.id, id);
    progress = await getNodeProgress(session.user.id, id);
    const all = await getRecommendedReview(session.user.id, 6);
    recommendations = all.filter((r) => r.nodeId !== id).slice(0, 4);
    recentAttempts = await getRecentAttempts(session.user.id, id, 5);
  }

  const bodyHtml = await renderMarkdown(node.body);

  // 收集页面上所有 wiki-link 目标供 hover 预览
  const graph = getContentGraph();
  const linkTargetIds = new Set<string>([
    ...node.outgoing_links,
    ...node.relations.map((r) => r.target),
    ...backlinks,
  ]);
  const linkTargets: WikiLinkData[] = Array.from(linkTargetIds).map((tid) => {
    const target = graph.nodes.get(tid);
    return target
      ? { id: tid, title: target.title, summary: target.summary, exists: true }
      : { id: tid, title: tid, summary: "", exists: false };
  });

  // 关系按类型分组
  const relations = node.relations;
  const paired = relations.filter((r) => r.type === "paired_with");
  const generates = relations.filter((r) => r.type === "generates");
  const restrains = relations.filter((r) => r.type === "restrains");
  const related = relations.filter((r) => r.type === "related_to");
  const treats = relations.filter((r) => r.type === "treats");

  return (
    <div
      className="min-h-full"
      style={{ background: TOKENS_A.bg, color: TOKENS_A.ink }}
    >
      <TopBar />

      <div className="mx-auto" style={{ maxWidth: 920, padding: "32px 24px 80px" }}>
        {/* Breadcrumb */}
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: TOKENS_A.ink3,
            letterSpacing: "0.12em",
            marginBottom: 18,
          }}
        >
          <Link href="/" style={{ color: TOKENS_A.ink3, textDecoration: "none" }}>
            知识地图
          </Link>{" "}
          / {LAYER_LABEL[node.layer]} /{" "}
          {node.category ?? "—"} /{" "}
          <span style={{ color: TOKENS_A.ink2 }}>{node.title}</span>
        </div>

        {/* Title + state */}
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1
              className="font-serif font-medium"
              style={{
                fontSize: 44,
                lineHeight: 1.15,
                letterSpacing: "0.02em",
                marginBottom: 8,
                color: TOKENS_A.ink,
              }}
            >
              {node.title}
            </h1>
            <p
              className="font-serif"
              style={{ fontSize: 17, color: TOKENS_A.ink2, lineHeight: 1.6 }}
            >
              {node.summary}
            </p>
          </div>

          {progress && (
            <div className="flex items-center gap-3">
              <span
                className="font-mono"
                style={{
                  fontSize: 11,
                  color: TOKENS_A.ink3,
                  letterSpacing: "0.12em",
                }}
              >
                强度
              </span>
              <StatusBar
                tier={progress.tier}
                strength={progress.strength}
                width={72}
                showValue
              />
            </div>
          )}
        </div>

        {/* CTA + Template + Body */}
        <div className="mt-10 grid gap-8" style={{ gridTemplateColumns: "1fr 320px" }}>
          <div>
            <article
              className="prose-zh"
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: TOKENS_A.ink,
              }}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {/* Related nodes */}
            {(paired.length + generates.length + restrains.length + related.length + treats.length > 0) && (
              <section
                className="mt-12 pt-8"
                style={{ borderTop: `1px solid ${TOKENS_A.line}` }}
              >
                <h2
                  className="font-serif font-medium"
                  style={{ fontSize: 18, marginBottom: 16, color: TOKENS_A.ink }}
                >
                  相关节点
                </h2>
                <RelationGroup label="表里" items={paired} />
                <RelationGroup label="相生" items={generates} />
                <RelationGroup label="相克" items={restrains} />
                <RelationGroup label="主治" items={treats} />
                <RelationGroup label="关联" items={related} />
                {backlinks.length > 0 && (
                  <div className="mt-4">
                    <span
                      className="font-mono"
                      style={{ fontSize: 11, color: TOKENS_A.ink3, letterSpacing: "0.12em" }}
                    >
                      被引用：
                    </span>
                    {backlinks.map((b) => (
                      <Link
                        key={b}
                        href={`/nodes/${b}`}
                        className="wiki-link ml-2"
                        data-node-id={b}
                        style={{
                          color: TOKENS_A.ink,
                          borderBottom: `1.5px solid ${TOKENS_A.s_untouched}`,
                          textDecoration: "none",
                          fontSize: 14,
                        }}
                      >
                        {b}
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-6 sticky top-6 self-start">
            {questions.length > 0 ? (
              <Link
                href={`/nodes/${id}/quiz`}
                className="block text-center"
                style={{
                  background: TOKENS_A.ink,
                  color: TOKENS_A.paper,
                  padding: "14px 18px",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                }}
              >
                测试自己 · {questions.length} 题
              </Link>
            ) : (
              <div
                className="block text-center"
                style={{
                  background: TOKENS_A.paper,
                  color: TOKENS_A.ink3,
                  padding: "14px 18px",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  border: `1px dashed ${TOKENS_A.line2}`,
                }}
              >
                这个节点暂未配题
              </div>
            )}

            <TemplateTable template={node.template} />

            {recentAttempts.length > 0 && <RecentAttempts items={recentAttempts} />}

            {recommendations.length > 0 && (
              <ReviewRecommendations items={recommendations} />
            )}

            {!session && (
              <p
                style={{
                  fontSize: 12,
                  color: TOKENS_A.ink3,
                  lineHeight: 1.7,
                }}
              >
                <Link href="/login" style={{ color: TOKENS_A.ink, textDecoration: "underline" }}>
                  登录
                </Link>{" "}
                后保存你的学习进度。
              </p>
            )}
          </aside>
        </div>
      </div>

      <WikiLinkHover targets={linkTargets} />
    </div>
  );
}

function RelationGroup({
  label,
  items,
}: {
  label: string;
  items: { target: string; note?: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-3">
      <span
        className="font-mono"
        style={{
          fontSize: 11,
          color: TOKENS_A.ink3,
          letterSpacing: "0.12em",
        }}
      >
        {label}：
      </span>
      {items.map((r) => (
        <span key={r.target} className="ml-2">
          <Link
            href={`/nodes/${r.target}`}
            className="wiki-link"
            data-node-id={r.target}
            style={{
              color: TOKENS_A.ink,
              borderBottom: `1.5px solid ${TOKENS_A.s_untouched}`,
              textDecoration: "none",
              fontSize: 14,
              paddingBottom: 1,
            }}
          >
            {r.target}
          </Link>
          {r.note && (
            <span style={{ fontSize: 12, color: TOKENS_A.ink3, marginLeft: 6 }}>
              ({r.note})
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function TopBar() {
  return (
    <div
      className="h-14 px-8 flex items-center justify-between"
      style={{ borderBottom: `1px solid ${TOKENS_A.line}`, background: TOKENS_A.bg }}
    >
      <Link
        href="/"
        className="font-serif"
        style={{
          fontSize: 16,
          color: TOKENS_A.ink,
          letterSpacing: "0.04em",
          textDecoration: "none",
        }}
      >
        Fast Memory · 中医
      </Link>
    </div>
  );
}

// SEO / metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const node = getNode(id);
  if (!node) return { title: "节点不存在 · Fast Memory" };
  return {
    title: `${node.title} · Fast Memory`,
    description: node.summary,
  };
}
