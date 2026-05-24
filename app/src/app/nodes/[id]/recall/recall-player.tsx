"use client";

// F05 白纸召回 — 三态：进入前 / 进行中 / 提交反馈
// 设计来源：design/a-recall.jsx

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  evaluateRecall,
  finalizeSelfRating,
  type RecallSubmitResult,
  type SelfRating,
} from "./actions";
import { TOKENS_A } from "@/design/tokens";
import { StatusBar } from "@/components/status-bar";
import { nodeHref } from "@/lib/content/links";

type Stage = "intro" | "active" | "result";

export function RecallPlayer({
  nodeId,
  nodeTitle,
}: {
  nodeId: string;
  nodeTitle: string;
}) {
  const [stage, setStage] = useState<Stage>("intro");
  const [text, setText] = useState("");
  const startedAtRef = useRef<number>(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [result, setResult] = useState<
    (RecallSubmitResult & { sessionToken: string }) | null
  >(null);
  const [latestStrength, setLatestStrength] = useState<{
    before: number;
    after: number;
  } | null>(null);
  const [, startTransition] = useTransition();

  // 计时（仅 active 阶段）
  useEffect(() => {
    if (stage !== "active") return;
    if (startedAtRef.current === 0) startedAtRef.current = Date.now();
    const t = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  function start() {
    startedAtRef.current = Date.now();
    setElapsedSec(0);
    setStage("active");
  }

  function submitText() {
    const timeMs = Date.now() - startedAtRef.current;
    startTransition(async () => {
      const r = await evaluateRecall({ nodeId, userText: text, timeMs });
      setResult(r);
      setStage("result");
    });
  }

  function pickRating(rating: SelfRating) {
    if (!result) return;
    startTransition(async () => {
      const f = await finalizeSelfRating({
        sessionToken: result.sessionToken,
        rating,
      });
      if (f.loggedIn) {
        setLatestStrength({ before: f.before, after: f.after });
      }
    });
  }

  function restart() {
    setText("");
    setResult(null);
    setLatestStrength(null);
    startedAtRef.current = 0;
    setElapsedSec(0);
    setStage("intro");
  }

  if (stage === "intro") {
    return <Intro nodeId={nodeId} nodeTitle={nodeTitle} onStart={start} />;
  }
  if (stage === "active") {
    return (
      <Active
        nodeId={nodeId}
        nodeTitle={nodeTitle}
        text={text}
        onTextChange={setText}
        elapsedSec={elapsedSec}
        onSubmit={submitText}
      />
    );
  }
  return (
    <Result
      nodeId={nodeId}
      nodeTitle={nodeTitle}
      result={result!}
      latestStrength={latestStrength}
      onRate={pickRating}
      onRestart={restart}
    />
  );
}

// ─────────────────────────────────────────────────────────
// Intro 阶段
// ─────────────────────────────────────────────────────────

function Intro({
  nodeId,
  nodeTitle,
  onStart,
}: {
  nodeId: string;
  nodeTitle: string;
  onStart: () => void;
}) {
  return (
    <div style={{ paddingTop: 32 }}>
      <h1
        className="font-serif font-medium"
        style={{
          fontSize: 32,
          color: TOKENS_A.ink,
          marginBottom: 16,
        }}
      >
        白纸召回 · {nodeTitle}
      </h1>
      <p
        style={{
          fontSize: 15,
          color: TOKENS_A.ink2,
          lineHeight: 1.8,
          marginBottom: 20,
        }}
      >
        给你空白 · 写出所有能想起来的关于「{nodeTitle}」的知识点：
        功能、属性、关系、相关证候、用药·
      </p>
      <p
        style={{
          fontSize: 14,
          color: TOKENS_A.ink3,
          lineHeight: 1.8,
          marginBottom: 32,
        }}
      >
        不必担心顺序或完整性。
      </p>

      <div
        style={{
          background: TOKENS_A.paper,
          border: `1px solid ${TOKENS_A.line}`,
          padding: "16px 20px",
          marginBottom: 32,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: TOKENS_A.ink2,
            lineHeight: 1.8,
          }}
        >
          这是一种最强的检索练习。做完后会告诉你哪些命中、哪些遗漏、哪些表达不规范。
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onStart}
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
          开始
        </button>
        <Link
          href={nodeHref(nodeId)}
          style={{
            fontSize: 12,
            color: TOKENS_A.ink3,
            letterSpacing: "0.12em",
            textDecoration: "none",
          }}
        >
          ← 回到节点
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Active 阶段
// ─────────────────────────────────────────────────────────

function Active({
  nodeId,
  nodeTitle,
  text,
  onTextChange,
  elapsedSec,
  onSubmit,
}: {
  nodeId: string;
  nodeTitle: string;
  text: string;
  onTextChange: (v: string) => void;
  elapsedSec: number;
  onSubmit: () => void;
}) {
  const mm = Math.floor(elapsedSec / 60).toString().padStart(2, "0");
  const ss = (elapsedSec % 60).toString().padStart(2, "0");
  const lines = text.split("\n").filter((l) => l.trim()).length;

  return (
    <div>
      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: 24 }}
      >
        <h1
          className="font-serif"
          style={{ fontSize: 22, color: TOKENS_A.ink, fontWeight: 500 }}
        >
          白纸召回 · {nodeTitle}
        </h1>
        <div
          className="font-mono tabular-nums"
          style={{
            fontSize: 14,
            color: TOKENS_A.ink2,
            letterSpacing: "0.08em",
          }}
        >
          ⏱ {mm}:{ss}
        </div>
      </div>

      <textarea
        autoFocus
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={`例：\n- 五行属木\n- 主疏泄\n- 与胆相表里\n...`}
        rows={14}
        className="w-full font-serif"
        style={{
          padding: "16px 18px",
          fontSize: 16,
          lineHeight: 1.8,
          background: TOKENS_A.sheet,
          border: `1px solid ${TOKENS_A.line2}`,
          color: TOKENS_A.ink,
          borderRadius: 0,
          resize: "vertical",
          outline: "none",
          fontFamily: 'var(--font-serif-zh), "Noto Serif SC", serif',
        }}
      />

      <div
        className="flex items-center justify-between"
        style={{ marginTop: 12 }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: TOKENS_A.ink3,
            letterSpacing: "0.08em",
          }}
        >
          字数 {text.length} · 行数 {lines}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={nodeHref(nodeId)}
            style={{
              fontSize: 12,
              color: TOKENS_A.ink3,
              letterSpacing: "0.12em",
              textDecoration: "none",
            }}
          >
            放弃
          </Link>
          <button
            onClick={onSubmit}
            disabled={!text.trim()}
            className="px-6 py-3"
            style={{
              background: text.trim() ? TOKENS_A.ink : TOKENS_A.line2,
              color: TOKENS_A.paper,
              fontSize: 13,
              letterSpacing: "0.08em",
              cursor: text.trim() ? "pointer" : "not-allowed",
              border: "none",
              borderRadius: 0,
            }}
          >
            我写完了
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Result 阶段
// ─────────────────────────────────────────────────────────

function Result({
  nodeId,
  nodeTitle,
  result,
  latestStrength,
  onRate,
  onRestart,
}: {
  nodeId: string;
  nodeTitle: string;
  result: RecallSubmitResult & { sessionToken: string };
  latestStrength: { before: number; after: number } | null;
  onRate: (r: SelfRating) => void;
  onRestart: () => void;
}) {
  const { match } = result;
  const coveragePct = Math.round(match.coverage * 100);

  return (
    <div>
      <h1
        className="font-serif font-medium"
        style={{
          fontSize: 28,
          color: TOKENS_A.ink,
          marginBottom: 16,
        }}
      >
        白纸召回 · {nodeTitle} · 完成
      </h1>

      <div
        className="font-mono"
        style={{
          fontSize: 13,
          color: TOKENS_A.ink2,
          marginBottom: 24,
          letterSpacing: "0.06em",
        }}
      >
        命中 {match.totalHits} / {match.totalRequired + (match.missedOptional.length)} · 覆盖率 {coveragePct}%
      </div>

      {/* 命中 */}
      {match.hit.length > 0 && (
        <Group
          label="✓ 命中"
          count={match.hit.length}
          color={TOKENS_A.s_mastered}
        >
          {match.hit.map((h) => (
            <Item key={h.keypointId} symbol="✓" symbolColor={TOKENS_A.s_mastered}>
              {h.text}
            </Item>
          ))}
        </Group>
      )}

      {/* 你没写出 */}
      {match.missedRequired.length > 0 && (
        <Group
          label="✗ 你没写出"
          count={match.missedRequired.length}
          color={TOKENS_A.s_fading}
        >
          {match.missedRequired.map((kp) => (
            <Item key={kp.id} symbol="·" symbolColor={TOKENS_A.ink3}>
              {kp.text}
            </Item>
          ))}
        </Group>
      )}

      {/* 选填遗漏（次要） */}
      {match.missedOptional.length > 0 && (
        <Group
          label="○ 选填遗漏"
          count={match.missedOptional.length}
          color={TOKENS_A.ink3}
        >
          {match.missedOptional.map((kp) => (
            <Item key={kp.id} symbol="·" symbolColor={TOKENS_A.ink3}>
              {kp.text}
            </Item>
          ))}
        </Group>
      )}

      {/* 你写出但未识别 */}
      {match.extra.length > 0 && (
        <Group
          label="? 待评估"
          count={match.extra.length}
          color={TOKENS_A.ink3}
          subtle="表达可能不规范，或不在标准关键点中"
        >
          {match.extra.map((s, i) => (
            <Item key={i} symbol="·" symbolColor={TOKENS_A.ink3}>
              <span style={{ color: TOKENS_A.ink2 }}>{s}</span>
            </Item>
          ))}
        </Group>
      )}

      {/* 自评 */}
      {!latestStrength && (
        <div
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: `1px solid ${TOKENS_A.line}`,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: TOKENS_A.ink,
              lineHeight: 1.7,
              marginBottom: 16,
            }}
          >
            自评这次召回质量：
          </p>
          <div className="flex gap-3">
            {(["hard", "good", "easy"] as const).map((r) => (
              <button
                key={r}
                onClick={() => onRate(r)}
                className="px-5 py-3 flex-1 font-sans"
                style={{
                  background: TOKENS_A.sheet,
                  color: TOKENS_A.ink,
                  border: `1px solid ${TOKENS_A.line2}`,
                  fontSize: 14,
                  cursor: "pointer",
                  borderRadius: 0,
                }}
              >
                {r === "hard" ? "不太行" : r === "good" ? "还可以" : "不错"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 强度变化 */}
      {latestStrength && (
        <div
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: `1px solid ${TOKENS_A.line}`,
          }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 13, color: TOKENS_A.ink2 }}>
              「{nodeTitle}」强度
            </span>
            <StatusBar
              tier={
                latestStrength.after >= 85
                  ? "mastered"
                  : latestStrength.after >= 60
                    ? "learned"
                    : "fading"
              }
              strength={latestStrength.after}
              width={64}
              showValue
            />
            <span className="font-mono" style={{ fontSize: 12, color: TOKENS_A.ink }}>
              ({latestStrength.before} → {latestStrength.after}
              {latestStrength.after > latestStrength.before ? " ↑" : " ↓"})
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onRestart}
              className="px-4 py-2.5"
              style={{
                background: "transparent",
                color: TOKENS_A.ink,
                border: `1px solid ${TOKENS_A.ink}`,
                fontSize: 12,
                letterSpacing: "0.08em",
                cursor: "pointer",
              }}
            >
              再来一次
            </button>
            <Link
              href={nodeHref(nodeId)}
              className="px-4 py-2.5"
              style={{
                background: TOKENS_A.ink,
                color: TOKENS_A.paper,
                fontSize: 12,
                letterSpacing: "0.08em",
                textDecoration: "none",
              }}
            >
              回到节点
            </Link>
          </div>
        </div>
      )}

      {!result.loggedIn && (
        <p
          style={{
            marginTop: 24,
            fontSize: 12,
            color: TOKENS_A.ink3,
            lineHeight: 1.7,
          }}
        >
          <Link href="/login" style={{ color: TOKENS_A.ink, textDecoration: "underline" }}>
            登录
          </Link>{" "}
          后可以保存白纸召回成绩到学习记录。
        </p>
      )}
    </div>
  );
}

// 反馈分组
function Group({
  label,
  count,
  color,
  subtle,
  children,
}: {
  label: string;
  count: number;
  color: string;
  subtle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: 16,
        padding: "12px 16px",
        background: TOKENS_A.paper,
        border: `1px solid ${TOKENS_A.line}`,
      }}
    >
      <div className="flex items-baseline justify-between" style={{ marginBottom: 8 }}>
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            color,
            letterSpacing: "0.16em",
          }}
        >
          {label} ({count})
        </span>
        {subtle && (
          <span style={{ fontSize: 11, color: TOKENS_A.ink3 }}>{subtle}</span>
        )}
      </div>
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
}

function Item({
  symbol,
  symbolColor,
  children,
}: {
  symbol: string;
  symbolColor: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-baseline gap-2">
      <span style={{ color: symbolColor, fontSize: 13 }}>{symbol}</span>
      <span className="font-serif" style={{ fontSize: 14, color: TOKENS_A.ink }}>
        {children}
      </span>
    </li>
  );
}
