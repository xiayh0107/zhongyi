// F03 答题流 — 支持 single_choice / multiple_choice / fill_in_blank / match

import Link from "next/link";
import { notFound } from "next/navigation";
import { getNode, getQuestionsForNode } from "@/lib/content/loader";
import { QuizPlayer } from "./quiz-player";
import { pickQuestions } from "./mix";
import type { PlayableQuestion } from "./types";
import { TOKENS_A } from "@/design/tokens";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const node = getNode(id);
  if (!node) notFound();

  const all = getQuestionsForNode(id);
  const picked = pickQuestions(all, 5);

  // 转换为 PlayableQuestion 形态（脱掉 zod 校验后的运行时类型）
  const playable: PlayableQuestion[] = [];
  for (const q of picked) {
    if (q.type === "single_choice") {
      playable.push({ id: q.id, type: q.type, stem: q.stem, options: q.options });
    } else if (q.type === "multiple_choice") {
      playable.push({ id: q.id, type: q.type, stem: q.stem, options: q.options });
    } else if (q.type === "fill_in_blank") {
      playable.push({ id: q.id, type: q.type, stem: q.stem });
    } else if (q.type === "match") {
      playable.push({
        id: q.id,
        type: q.type,
        stem: q.stem,
        options: q.options,
      });
    } else if (q.type === "sort") {
      playable.push({ id: q.id, type: q.type, stem: q.stem, options: q.options });
    }
    // spell/derive/blank_recall 暂未支持，跳过（M3 范围）
  }

  if (playable.length === 0) {
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
            这个节点暂无可练习的题目
          </h1>
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
            测试自己
          </span>
          <span style={{ color: TOKENS_A.line2 }}>·</span>
          <Link
            href={`/nodes/${id}`}
            className="font-serif"
            style={{
              fontSize: 15,
              color: TOKENS_A.ink,
              borderBottom: `1.5px solid ${TOKENS_A.s_mastered}`,
              paddingBottom: 1,
              textDecoration: "none",
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

      <div className="mx-auto" style={{ maxWidth: 820, padding: "56px 32px 64px" }}>
        <QuizPlayer
          nodeId={id}
          nodeTitle={node.title}
          questions={playable}
        />
      </div>
    </div>
  );
}
