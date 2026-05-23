"use client";

// 各题型的渲染 + answer 输入控件
// 单独成文件保持 QuizPlayer 主组件简洁

import { TOKENS_A } from "@/design/tokens";
import type { ClientAnswer, Feedback } from "./actions";
import type { PlayableQuestion } from "./types";

// ─────────────────────────────────────────────────────────
// single_choice
// ─────────────────────────────────────────────────────────

export function SingleChoiceView({
  question,
  picked,
  feedback,
  onPick,
}: {
  question: Extract<PlayableQuestion, { type: "single_choice" }>;
  picked: number | null;
  feedback: Feedback | null;
  onPick: (i: number) => void;
}) {
  const correctIdx = feedback?.detail.kind === "single" ? feedback.detail.correctIndex : -1;

  return (
    <div className="flex flex-col gap-2.5">
      {question.options.map((opt, i) => {
        const isCorrect = feedback && i === correctIdx;
        const isPicked = picked === i;
        const isWrong = feedback && isPicked && !feedback.correct;
        return (
          <ChoiceButton
            key={i}
            label={opt}
            letter={letterOf(i)}
            picked={isPicked}
            correct={!!isCorrect}
            wrong={!!isWrong}
            disabled={!!feedback}
            onClick={() => onPick(i)}
          />
        );
      })}
    </div>
  );
}

export function getSingleAnswer(picked: number | null): ClientAnswer | null {
  if (picked == null) return null;
  return { kind: "single", index: picked };
}

// ─────────────────────────────────────────────────────────
// multiple_choice
// ─────────────────────────────────────────────────────────

export function MultipleChoiceView({
  question,
  picked,
  feedback,
  onToggle,
}: {
  question: Extract<PlayableQuestion, { type: "multiple_choice" }>;
  picked: Set<number>;
  feedback: Feedback | null;
  onToggle: (i: number) => void;
}) {
  const correctSet =
    feedback?.detail.kind === "multi" ? new Set(feedback.detail.correctIndices) : null;

  return (
    <div className="flex flex-col gap-2.5">
      {question.options.map((opt, i) => {
        const isPicked = picked.has(i);
        const isCorrect = correctSet?.has(i) ?? false;
        const isWrong = feedback && isPicked && !isCorrect;
        const isMissing = feedback && !isPicked && isCorrect;
        return (
          <ChoiceButton
            key={i}
            label={opt}
            letter={letterOf(i)}
            picked={isPicked}
            checkbox
            correct={!!feedback && isCorrect}
            wrong={!!isWrong}
            missing={!!isMissing}
            disabled={!!feedback}
            onClick={() => onToggle(i)}
          />
        );
      })}
    </div>
  );
}

export function getMultiAnswer(picked: Set<number>): ClientAnswer | null {
  if (picked.size === 0) return null;
  return { kind: "multi", indices: Array.from(picked).sort((a, b) => a - b) };
}

// ─────────────────────────────────────────────────────────
// fill_in_blank
// ─────────────────────────────────────────────────────────

export function FillInBlankView({
  value,
  feedback,
  onChange,
  onSubmit,
}: {
  value: string;
  feedback: Feedback | null;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const accepted =
    feedback?.detail.kind === "text" ? feedback.detail.acceptedAnswers : [];
  const showAccepted = feedback && !feedback.correct && accepted.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={value}
        autoFocus
        disabled={!!feedback}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !feedback && value.trim()) onSubmit();
        }}
        className="w-full px-4 py-3 font-serif outline-none focus:outline-2"
        style={{
          background: feedback
            ? feedback.correct
              ? "rgba(95,124,77,0.06)"
              : "rgba(160,109,46,0.06)"
            : TOKENS_A.sheet,
          border: `1px solid ${
            feedback
              ? feedback.correct
                ? TOKENS_A.s_mastered
                : TOKENS_A.s_fading
              : TOKENS_A.line2
          }`,
          fontSize: 18,
          color: TOKENS_A.ink,
          borderRadius: 0,
        }}
        placeholder="在这里输入..."
      />
      {showAccepted && (
        <p className="font-mono" style={{ fontSize: 12, color: TOKENS_A.ink3 }}>
          正确答案：
          <span className="font-serif" style={{ color: TOKENS_A.ink, marginLeft: 6 }}>
            {accepted.join(" / ")}
          </span>
        </p>
      )}
    </div>
  );
}

export function getFillAnswer(value: string): ClientAnswer | null {
  if (!value.trim()) return null;
  return { kind: "text", value: value.trim() };
}

// ─────────────────────────────────────────────────────────
// match — 简化实现：左列每项点击后选右列项
// ─────────────────────────────────────────────────────────

export function MatchView({
  question,
  pairs,
  selectedLeft,
  feedback,
  onLeftClick,
  onRightClick,
  onClear,
}: {
  question: Extract<PlayableQuestion, { type: "match" }>;
  pairs: Map<number, number>; // left → right
  selectedLeft: number | null;
  feedback: Feedback | null;
  onLeftClick: (i: number) => void;
  onRightClick: (i: number) => void;
  onClear: () => void;
}) {
  const correctMap = new Map<number, number>();
  if (feedback?.detail.kind === "match") {
    for (const [l, r] of feedback.detail.correctPairs) correctMap.set(l, r);
  }

  const usedRights = new Set(pairs.values());

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          {question.options.left.map((lv, li) => {
            const matched = pairs.has(li);
            const matchedRight = pairs.get(li);
            const isCorrect =
              feedback && matchedRight != null && correctMap.get(li) === matchedRight;
            const isWrong = feedback && matched && !isCorrect;
            return (
              <MatchSide
                key={li}
                label={lv}
                slot={matched ? question.options.right[matchedRight!] : undefined}
                active={selectedLeft === li}
                correct={!!isCorrect}
                wrong={!!isWrong}
                disabled={!!feedback}
                onClick={() => onLeftClick(li)}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {question.options.right.map((rv, ri) => {
            const used = usedRights.has(ri);
            return (
              <MatchSide
                key={ri}
                label={rv}
                dim={used}
                disabled={!!feedback}
                onClick={() => onRightClick(ri)}
              />
            );
          })}
        </div>
      </div>
      {!feedback && pairs.size > 0 && (
        <button
          onClick={onClear}
          className="self-start font-mono"
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
          ↺ 清空
        </button>
      )}
    </div>
  );
}

export function getMatchAnswer(pairs: Map<number, number>, leftCount: number): ClientAnswer | null {
  if (pairs.size !== leftCount) return null; // 必须全配齐才能提交
  return {
    kind: "match",
    pairs: Array.from(pairs.entries()) as [number, number][],
  };
}

// ─────────────────────────────────────────────────────────
// sort — 用上/下移按钮（避免引入 dnd 库）
// ─────────────────────────────────────────────────────────

export function SortView({
  question,
  order,
  feedback,
  onMove,
}: {
  question: Extract<PlayableQuestion, { type: "sort" }>;
  order: number[]; // order[position] = original option index
  feedback: Feedback | null;
  onMove: (fromPos: number, direction: -1 | 1) => void;
}) {
  const correctOrder =
    feedback?.detail.kind === "sort" ? feedback.detail.correctOrder : null;

  return (
    <ol className="flex flex-col gap-2">
      {order.map((origIdx, pos) => {
        const isCorrectPos = correctOrder?.[pos] === origIdx;
        const correctPosForThis = correctOrder?.indexOf(origIdx) ?? -1;
        return (
          <li
            key={origIdx}
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: feedback
                ? isCorrectPos
                  ? "rgba(95,124,77,0.06)"
                  : "rgba(160,109,46,0.06)"
                : TOKENS_A.sheet,
              border: `1px solid ${
                feedback
                  ? isCorrectPos
                    ? TOKENS_A.s_mastered
                    : TOKENS_A.s_fading
                  : TOKENS_A.line
              }`,
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 12,
                color: TOKENS_A.ink3,
                letterSpacing: "0.08em",
                width: 24,
              }}
            >
              {pos + 1}.
            </span>
            <span className="font-serif flex-1" style={{ fontSize: 15, color: TOKENS_A.ink }}>
              {question.options[origIdx]}
            </span>
            {feedback ? (
              <span
                style={{
                  fontSize: 13,
                  color: isCorrectPos ? TOKENS_A.s_mastered : TOKENS_A.s_fading,
                }}
              >
                {isCorrectPos ? "✓" : `应在第 ${correctPosForThis + 1} 位`}
              </span>
            ) : (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onMove(pos, -1)}
                  disabled={pos === 0}
                  className="px-2 py-1"
                  style={{
                    fontSize: 12,
                    color: pos === 0 ? TOKENS_A.ink3 : TOKENS_A.ink,
                    background: "transparent",
                    border: `1px solid ${pos === 0 ? TOKENS_A.line : TOKENS_A.line2}`,
                    cursor: pos === 0 ? "default" : "pointer",
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onMove(pos, 1)}
                  disabled={pos === order.length - 1}
                  className="px-2 py-1"
                  style={{
                    fontSize: 12,
                    color: pos === order.length - 1 ? TOKENS_A.ink3 : TOKENS_A.ink,
                    background: "transparent",
                    border: `1px solid ${pos === order.length - 1 ? TOKENS_A.line : TOKENS_A.line2}`,
                    cursor: pos === order.length - 1 ? "default" : "pointer",
                  }}
                >
                  ↓
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function getSortAnswer(order: number[]): ClientAnswer | null {
  // 任何顺序都可提交（用户必须能尝试）
  return { kind: "sort", order };
}

// ─────────────────────────────────────────────────────────
// 共用基元
// ─────────────────────────────────────────────────────────

function letterOf(i: number) {
  return String.fromCharCode(65 + i);
}

function ChoiceButton({
  label,
  letter,
  picked,
  correct,
  wrong,
  missing,
  checkbox,
  disabled,
  onClick,
}: {
  label: string;
  letter: string;
  picked: boolean;
  correct?: boolean;
  wrong?: boolean;
  missing?: boolean;
  checkbox?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const borderColor = correct
    ? TOKENS_A.s_mastered
    : wrong
      ? TOKENS_A.s_fading
      : missing
        ? TOKENS_A.s_fading
        : picked
          ? TOKENS_A.ink
          : TOKENS_A.line;
  const bg = correct
    ? "rgba(95,124,77,0.08)"
    : wrong
      ? "rgba(160,109,46,0.08)"
      : missing
        ? "rgba(160,109,46,0.04)"
        : TOKENS_A.sheet;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-left flex items-center gap-4 px-5 py-4"
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        color: TOKENS_A.ink,
        fontSize: 15,
        cursor: disabled ? "default" : "pointer",
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
        {checkbox ? (picked ? "■" : "□") : letter}
      </span>
      <span className="font-serif flex-1">{label}</span>
      {correct && (
        <span style={{ color: TOKENS_A.s_mastered, fontSize: 16 }}>✓</span>
      )}
      {wrong && (
        <span style={{ color: TOKENS_A.s_fading, fontSize: 16 }}>✕</span>
      )}
      {missing && (
        <span
          className="font-mono"
          style={{ color: TOKENS_A.s_fading, fontSize: 11, letterSpacing: "0.12em" }}
        >
          应选
        </span>
      )}
    </button>
  );
}

function MatchSide({
  label,
  slot,
  active,
  correct,
  wrong,
  dim,
  disabled,
  onClick,
}: {
  label: string;
  slot?: string;
  active?: boolean;
  correct?: boolean;
  wrong?: boolean;
  dim?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const borderColor = correct
    ? TOKENS_A.s_mastered
    : wrong
      ? TOKENS_A.s_fading
      : active
        ? TOKENS_A.ink
        : TOKENS_A.line;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-left px-4 py-3 flex items-center justify-between gap-3"
      style={{
        background: dim ? TOKENS_A.paper : TOKENS_A.sheet,
        border: `1px solid ${borderColor}`,
        color: dim ? TOKENS_A.ink3 : TOKENS_A.ink,
        fontSize: 15,
        cursor: disabled ? "default" : "pointer",
        textAlign: "left",
        borderRadius: 0,
        textDecoration: dim ? "line-through" : "none",
      }}
    >
      <span className="font-serif">{label}</span>
      {slot && (
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            color: TOKENS_A.ink3,
            letterSpacing: "0.08em",
          }}
        >
          → {slot}
        </span>
      )}
    </button>
  );
}
