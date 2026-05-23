"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { submitAnswer } from "./actions";
import { StatusBar } from "@/components/status-bar";
import { TOKENS_A } from "@/design/tokens";

type Q = {
  id: string;
  stem: string;
  options: string[];
};

type Feedback = {
  correct: boolean;
  correctIndex: number;
  why: string;
  before: number;
  after: number;
  loggedIn: boolean;
};

export function QuizPlayer({
  nodeId,
  nodeTitle,
  questions,
}: {
  nodeId: string;
  nodeTitle: string;
  questions: Q[];
}) {
  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  // ref 不触发 render，可在 effect 中安全初始化 / 更新（避免 setState-in-effect 警告）
  const startedAtRef = useRef<number>(0);
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, [idx]);
  const [, startTransition] = useTransition();
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const [latestStrength, setLatestStrength] = useState<{ before: number; after: number } | null>(
    null,
  );

  const current = questions[idx];

  if (done) {
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
            onClick={() => {
              setIdx(0);
              setStats({ correct: 0, total: 0 });
              setFeedback(null);
              setPicked(null);
              setDone(false);
              startedAtRef.current = Date.now();
            }}
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

  function pickOption(i: number) {
    if (feedback) return; // 已提交后禁用
    setPicked(i);
  }

  function submit() {
    if (picked == null || feedback) return;
    const timeMs = Date.now() - startedAtRef.current;
    startTransition(async () => {
      const f = await submitAnswer({
        nodeId,
        questionId: current.id,
        userAnswer: picked,
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
      setIdx(idx + 1);
      setPicked(null);
      setFeedback(null);
      startedAtRef.current = Date.now();
    }
  }

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
            const state = i < idx ? "done" : i === idx ? "current" : "pending";
            return (
              <span
                key={i}
                style={{
                  width: 18,
                  height: 4,
                  background:
                    state === "done"
                      ? TOKENS_A.s_mastered
                      : state === "current"
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
        题型 · SINGLE CHOICE · 单选
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

      {/* 选项 */}
      <div className="flex flex-col gap-2.5" style={{ marginBottom: 24 }}>
        {current.options.map((opt, i) => {
          const isCorrect = feedback && i === feedback.correctIndex;
          const isPicked = picked === i;
          const isWrong = feedback && isPicked && !feedback.correct;
          const borderColor = isCorrect
            ? TOKENS_A.s_mastered
            : isWrong
              ? TOKENS_A.s_fading
              : isPicked
                ? TOKENS_A.ink
                : TOKENS_A.line;
          const bg = isCorrect
            ? "rgba(95,124,77,0.08)"
            : isWrong
              ? "rgba(160,109,46,0.08)"
              : TOKENS_A.sheet;
          return (
            <button
              key={i}
              onClick={() => pickOption(i)}
              disabled={!!feedback}
              className="text-left flex items-center gap-4 px-5 py-4"
              style={{
                background: bg,
                border: `1px solid ${borderColor}`,
                color: TOKENS_A.ink,
                fontSize: 15,
                cursor: feedback ? "default" : "pointer",
                textAlign: "left",
                borderRadius: 0,
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 12,
                  color: TOKENS_A.ink3,
                  letterSpacing: "0.08em",
                  width: 18,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="font-serif">{opt}</span>
              {isCorrect && (
                <span className="ml-auto" style={{ color: TOKENS_A.s_mastered, fontSize: 16 }}>
                  ✓
                </span>
              )}
              {isWrong && (
                <span className="ml-auto" style={{ color: TOKENS_A.s_fading, fontSize: 16 }}>
                  ✕
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 反馈 / 解析 */}
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
                tier={feedback.after >= 60 ? (feedback.after >= 85 ? "mastered" : "learned") : "fading"}
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
            <div
              className="mt-3"
              style={{ fontSize: 12, color: TOKENS_A.ink3 }}
            >
              <Link href="/login" style={{ color: TOKENS_A.ink, textDecoration: "underline" }}>
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
            disabled={picked == null}
            className="px-6 py-3"
            style={{
              background: picked == null ? TOKENS_A.line2 : TOKENS_A.ink,
              color: TOKENS_A.paper,
              fontSize: 13,
              letterSpacing: "0.08em",
              cursor: picked == null ? "not-allowed" : "pointer",
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
