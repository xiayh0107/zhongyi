// F05 白纸召回入口页

import Link from "next/link";
import { notFound } from "next/navigation";
import { getNode } from "@/lib/content/loader";
import { RecallPlayer } from "./recall-player";
import { TOKENS_A } from "@/design/tokens";

export default async function RecallPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const node = getNode(id);
  if (!node) notFound();

  const hasKeypoints =
    !!node.recall_keypoints &&
    (node.recall_keypoints.required.length > 0 ||
      node.recall_keypoints.optional.length > 0);

  if (!hasKeypoints) {
    return (
      <div
        className="min-h-full flex items-center justify-center text-center px-6"
        style={{ background: TOKENS_A.bg, color: TOKENS_A.ink }}
      >
        <div>
          <h1
            className="font-serif font-medium"
            style={{ fontSize: 24, marginBottom: 12 }}
          >
            「{node.title}」尚未配置白纸召回关键点
          </h1>
          <p style={{ fontSize: 13, color: TOKENS_A.ink2, marginBottom: 24 }}>
            白纸召回需要节点 frontmatter 中的 recall_keypoints 字段。
          </p>
          <Link
            href={`/nodes/${id}`}
            style={{ color: TOKENS_A.ink, textDecoration: "underline" }}
          >
            回到节点
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-full"
      style={{ background: TOKENS_A.bg, color: TOKENS_A.ink }}
    >
      <div
        className="h-14 px-8 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${TOKENS_A.line}`, background: TOKENS_A.bg }}
      >
        <div className="flex items-baseline gap-4">
          <span
            className="font-mono"
            style={{
              fontSize: 12,
              color: TOKENS_A.ink3,
              letterSpacing: "0.12em",
            }}
          >
            白纸召回 · BLANK RECALL
          </span>
          <span style={{ color: TOKENS_A.line2 }}>·</span>
          <Link
            href={`/nodes/${id}`}
            className="font-serif"
            style={{
              fontSize: 15,
              color: TOKENS_A.ink,
              textDecoration: "none",
              borderBottom: `1.5px solid ${TOKENS_A.s_mastered}`,
              paddingBottom: 1,
            }}
          >
            {node.title}
          </Link>
        </div>
        <Link
          href={`/nodes/${id}`}
          className="font-mono"
          style={{
            fontSize: 11,
            color: TOKENS_A.ink3,
            letterSpacing: "0.12em",
            textDecoration: "none",
          }}
        >
          ✕ 退出
        </Link>
      </div>

      <div className="mx-auto" style={{ maxWidth: 720, padding: "48px 24px 80px" }}>
        <RecallPlayer nodeId={id} nodeTitle={node.title} />
      </div>
    </div>
  );
}
