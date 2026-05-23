"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { submitAnswer, type ClientAnswer, type Feedback } from "./actions";
import { TYPE_LABEL, type PlayableQuestion } from "./types";
import {
  SingleChoiceView,
  MultipleChoiceView,
  FillInBlankView,
  MatchView,
  SortView,
  getSingleAnswer,
  getMultiAnswer,
  getFillAnswer,
  getMatchAnswer,
  getSortAnswer,
} from "./question-views";
import { StatusBar } from "@/components/status-bar";
import { TOKENS_A } from "@/design/tokens";

// ─────────────────────────────────────────────────────────
// 本地题型 state（按 type 分支）
// ─────────────────────────────────────────────────────────

type LocalState =
  | { type: "single_choice"; picked: number | null }
  | { type: "multiple_choice"; picked: Set<number> }
  | { type: "fill_in_blank"; value: string }
  | {
      type: "match";
      pairs: Map<number, number>;
      selectedLeft: number | null;
    }
  | { type: "sort"; order: number[] };

function initStateFor(q: PlayableQuestion): LocalState {
  switch (q.type) {
    case "single_choice":
      return { type: "single_choice", picked: null };
    case "multiple_choice":
      return { type: "multiple_choice", picked: new Set() };
    case "fill_in_blank":
      return { type: "fill_in_blank", value: "" };
    case "match":
      return { type: "match", pairs: new Map(), selectedLeft: null };
    case "sort":
      // 初始 order = options 索引序列（用户必须重新排）
      return { type: "sort", order: q.options.map((_, i) => i) };
  }
}

function buildAnswer(state: LocalState, q: PlayableQuestion): ClientAnswer | null {
  switch (state.type) {
    case "single_choice":
      return getSingleAnswer(state.picked);
    case "multiple_choice":
      return getMultiAnswer(state.picked);
    case "fill_in_blank":
      return getFillAnswer(state.value);
    case "match":
      return q.type === "match"
        ? getMatchAnswer(state.pairs, q.options.left.length)
        : null;
    case "sort":
      return getSortAnswer(state.order);
  }
}

// ─────────────────────────────────────────────────────────
// 主组件
// ─────────────────────────────────────────────────────────

export function QuizPlayer({
  nodeId,
  nodeTitle,
  questions,
}: {
  nodeId: string;
  nodeTitle: string;
  questions: PlayableQuestion[];
}) {
  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const current = questions[idx];

  const [state, setState] = useState<LocalState>(() => initStateFor(current));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const startedAtRef = useRef<number>(0);
  const [, startTransition] = useTransition();
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const [latestStrength, setLatestStrength] = useState<{ before: number; after: number } | null>(
    null,
  );

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, [idx]);

  if (done) {
    return <QuizSummary
      nodeId={nodeId}
      nodeTitle={nodeTitle}
      stats={stats}
      latestStrength={latestStrength}
      onRestart={() => {
        setIdx(0);
        setState(initStateFor(questions[0]));
        setStats({ correct: 0, total: 0 });
        setFeedback(null);
        setDone(false);
        startedAtRef.current = Date.now();
      }}
    />;
  }

  function submit() {
    const answer = buildAnswer(state, current);
    if (!answer || feedback) return;
    const timeMs = Date.now() - startedAtRef.current;
    startTransition(async () => {
      const f = await submitAnswer({
        nodeId,
        questionId: current.id,
        userAnswer: answer,
        timeMs,
      });
      setFeedback(f);
      setStats((s) => ({
        correct: s.correct + (f.correct ? 1 : 0),
        total: s.total + 1,
      }));
      setLatestStrength({ before: f.before, after: f.after });
    });
  }

  function next() {
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      const nextIdx = idx + 1;
      setIdx(nextIdx);
      setState(initStateFor(questions[nextIdx]));
      setFeedback(null);
      startedAtRef.current = Date.now();
    }
  }

  // 题型分支的输入回调
  function onPick(i: number) {
    if (feedback || state.type !== "single_choice") return;
    setState({ type: "single_choice", picked: i });
  }
  function onToggle(i: number) {
    if (feedback || state.type !== "multiple_choice") return;
    const next = new Set(state.picked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setState({ type: "multiple_choice", picked: next });
  }
  function onTextChange(v: string) {
    if (feedback || state.type !== "fill_in_blank") return;
    setState({ type: "fill_in_blank", value: v });
  }
  function onLeftClick(li: number) {
    if (feedback || state.type !== "match") return;
    setState({ ...state, selectedLeft: state.selectedLeft === li ? null : li });
  }
  function onRightClick(ri: number) {
    if (feedback || state.type !== "match") return;
    if (state.selectedLeft == null) return;
    const next = new Map(state.pairs);
    // 移除任何已用此右项的旧映射
    for (const [l, r] of next) if (r === ri) next.delete(l);
    next.set(state.selectedLeft, ri);
    setState({ type: "match", pairs: next, selectedLeft: null });
  }
  function onClearMatch() {
    if (feedback || state.type !== "match") return;
    setState({ type: "match", pairs: new Map(), selectedLeft: null });
  }
  function onSortMove(fromPos: number, direction: -1 | 1) {
    if (feedback || state.type !== "sort") return;
    const toPos = fromPos + direction;
    if (toPos < 0 || toPos >= state.order.length) return;
    const next = [...state.order];
    [next[fromPos], next[toPos]] = [next[toPos], next[fromPos]];
    setState({ type: "sort", order: next });
  }

  const answer = buildAnswer(state, current);
  const canSubmit = !!answer && !feedback;

  return (
    <div>
      {/* 进度点 */}
      <div className="flex items-center justify-between" style={{ marginBottom: 32 }}>
        <span
          className="font-mono"
          style={{ fontSize: 11, color: TOKENS_A.ink3, letterSpacing: "0.1em" }}
        >
          第 {idx + 1} / {total} 题
        </span>
        <div className="flex gap-1.5">
          {questions.map((_, i) => {
            const status = i < idx ? "done" : i === idx ? "current" : "pending";
            return (
              <span
                key={i}
                style={{
                  width: 18,
                  height: 4,
                  background:
                    status === "done"
                      ? TOKENS_A.s_mastered
                      : status === "current"
                        ? TOKENS_A.ink
                        : TOKENS_A.line,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 题型标签 */}
      <div
        style={{
          fontSize: 10,
          color: TOKENS_A.ink3,
          letterSpacing: "0.22em",
          marginBottom: 14,
        }}
      >
        题型 · {TYPE_LABEL[current.type]}
      </div>

      {/* 题干 */}
      <h2
        className="font-serif font-medium"
        style={{
          fontSize: 26,
          lineHeight: 1.5,
          color: TOKENS_A.ink,
          marginBottom: 32,
        }}
      >
        {current.stem}
      </h2>

      {/* 题型分支 */}
      <div style={{ marginBottom: 24 }}>
        {current.type === "single_choice" && state.type === "single_choice" && (
          <SingleChoiceView
            question={current}
            picked={state.picked}
            feedback={feedback}
            onPick={onPick}
          />
        )}
        {current.type === "multiple_choice" && state.type === "multiple_choice" && (
          <MultipleChoiceView
            question={current}
            picked={state.picked}
            feedback={feedback}
            onToggle={onToggle}
          />
        )}
        {current.type === "fill_in_blank" && state.type === "fill_in_blank" && (
          <FillInBlankView
            value={state.value}
            feedback={feedback}
            onChange={onTextChange}
            onSubmit={submit}
          />
        )}
        {current.type === "match" && state.type === "match" && (
          <MatchView
            question={current}
            pairs={state.pairs}
            selectedLeft={state.selectedLeft}
            feedback={feedback}
            onLeftClick={onLeftClick}
            onRightClick={onRightClick}
            onClear={onClearMatch}
          />
        )}
        {current.type === "sort" && state.type === "sort" && (
          <SortView
            question={current}
            order={state.order}
            feedback={feedback}
            onMove={onSortMove}
          />
        )}
      </div>

      {/* Why 反馈 */}
      {feedback && (
        <div
          className="mb-6"
          style={{
            background: TOKENS_A.paper,
            border: `1px solid ${TOKENS_A.line}`,
            padding: "16px 20px",
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              color: TOKENS_A.ink3,
              letterSpacing: "0.22em",
              marginBottom: 8,
            }}
          >
            WHY
          </div>
          <p style={{ fontSize: 14, color: TOKENS_A.ink, lineHeight: 1.8 }}>
            {feedback.why}
          </p>
          {feedback.loggedIn && feedback.before !== feedback.after && (
            <div
              className="flex items-center gap-2"
              style={{ marginTop: 12, fontSize: 12, color: TOKENS_A.ink2 }}
            >
              <span>强度：</span>
              <StatusBar
                tier={
                  feedback.after >= 85
                    ? "mastered"
                    : feedback.after >= 60
                      ? "learned"
                      : "fading"
                }
                strength={feedback.after}
                width={56}
                showValue
              />
              <span className="font-mono">
                ({feedback.before} → {feedback.after}
                {feedback.after > feedback.before ? " ↑" : " ↓"})
              </span>
            </div>
          )}
          {!feedback.loggedIn && (
            <div className="mt-3" style={{ fontSize: 12, color: TOKENS_A.ink3 }}>
              <Link
                href="/login"
                style={{ color: TOKENS_A.ink, textDecoration: "underline" }}
              >
                登录
              </Link>{" "}
              后保存你的进度。
            </div>
          )}
        </div>
      )}

      {/* 操作 */}
      <div className="flex items-center justify-between">
        <Link
          href={`/nodes/${nodeId}`}
          style={{
            fontSize: 12,
            color: TOKENS_A.ink3,
            letterSpacing: "0.12em",
            textDecoration: "none",
          }}
        >
          ✕ 退出
        </Link>
        {feedback ? (
          <button
            onClick={next}
            className="px-6 py-3"
            style={{
              background: TOKENS_A.ink,
              color: TOKENS_A.paper,
              fontSize: 13,
              letterSpacing: "0.08em",
              cursor: "pointer",
              border: "none",
              borderRadius: 0,
            }}
          >
            {idx + 1 >= total ? "完成 →" : "下一题 →"}
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="px-6 py-3"
            style={{
              background: canSubmit ? TOKENS_A.ink : TOKENS_A.line2,
              color: TOKENS_A.paper,
              fontSize: 13,
              letterSpacing: "0.08em",
              cursor: canSubmit ? "pointer" : "not-allowed",
              border: "none",
              borderRadius: 0,
            }}
          >
            提交
          </button>
        )}
      </div>
    </div>
  );
}

function QuizSummary({
  nodeId,
  nodeTitle,
  stats,
  latestStrength,
  onRestart,
}: {
  nodeId: string;
  nodeTitle: string;
  stats: { correct: number; total: number };
  latestStrength: { before: number; after: number } | null;
  onRestart: () => void;
}) {
  return (
    <div className="text-center" style={{ paddingTop: 60 }}>
      <div
        className="font-serif font-medium"
        style={{ fontSize: 28, color: TOKENS_A.ink, marginBottom: 16 }}
      >
        测试完成
      </div>
      <div
        className="font-mono"
        style={{ fontSize: 14, color: TOKENS_A.ink2, marginBottom: 24 }}
      >
        答对 {stats.correct} / {stats.total}
      </div>
      {latestStrength && latestStrength.before !== latestStrength.after && (
        <div
          className="flex items-center justify-center gap-3"
          style={{ marginBottom: 32 }}
        >
          <span style={{ fontSize: 13, color: TOKENS_A.ink2 }}>
            「{nodeTitle}」强度
          </span>
          <span className="font-mono" style={{ fontSize: 13, color: TOKENS_A.ink }}>
            {latestStrength.before} → {latestStrength.after}{" "}
            {latestStrength.after > latestStrength.before ? "↑" : "↓"}
          </span>
        </div>
      )}
      <div className="flex justify-center gap-3">
        <Link
          href={`/nodes/${nodeId}`}
          className="px-5 py-3"
          style={{
            background: TOKENS_A.ink,
            color: TOKENS_A.paper,
            fontSize: 13,
            letterSpacing: "0.08em",
            textDecoration: "none",
          }}
        >
          回到节点
        </Link>
        <button
          onClick={onRestart}
          className="px-5 py-3"
          style={{
            background: "transparent",
            color: TOKENS_A.ink,
            border: `1px solid ${TOKENS_A.ink}`,
            fontSize: 13,
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          再来一次
        </button>
      </div>
    </div>
  );
}
