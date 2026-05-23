"use server";

import { auth } from "@/auth";
import { recordAttempt } from "@/lib/progress";
import { getQuestionsForNode } from "@/lib/content/loader";

// ── 客户端可发送的 answer 形态（联合类型） ──
export type ClientAnswer =
  | { kind: "single"; index: number }
  | { kind: "multi"; indices: number[] }
  | { kind: "text"; value: string }
  | { kind: "match"; pairs: [number, number][] }
  | { kind: "sort"; order: number[] };

type SubmitInput = {
  nodeId: string;
  questionId: string;
  userAnswer: ClientAnswer;
  timeMs: number;
};

// ── 服务端返回的反馈 ──
export type Feedback = {
  correct: boolean;
  why: string;
  before: number;
  after: number;
  loggedIn: boolean;
  /** 类型相关的"正确答案"信息，由客户端按 type 解读 */
  detail:
    | { kind: "single"; correctIndex: number }
    | { kind: "multi"; correctIndices: number[]; userIndices: number[] }
    | { kind: "text"; acceptedAnswers: string[]; userValue: string }
    | { kind: "match"; correctPairs: [number, number][]; userPairs: [number, number][] }
    | { kind: "sort"; correctOrder: number[]; userOrder: number[] };
};

// ── 校验工具 ──
function arrayEqAsSet(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const sa = new Set(a);
  for (const x of b) if (!sa.has(x)) return false;
  return true;
}

function pairsEqAsSet(a: [number, number][], b: [number, number][]) {
  if (a.length !== b.length) return false;
  const keyize = (p: [number, number]) => `${p[0]}-${p[1]}`;
  const sa = new Set(a.map(keyize));
  for (const p of b) if (!sa.has(keyize(p))) return false;
  return true;
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, "");
}

function fillMatches(answer: string, accepted: string[]) {
  const n = normalize(answer);
  return accepted.some((a) => normalize(a) === n);
}

export async function submitAnswer(input: SubmitInput): Promise<Feedback> {
  const questions = getQuestionsForNode(input.nodeId);
  const question = questions.find((q) => q.id === input.questionId);
  if (!question) {
    throw new Error(`Question ${input.questionId} not found`);
  }

  // 按题型判断对错 + 准备 detail
  let correct = false;
  let detail: Feedback["detail"];
  let userAnswerText: string;

  if (question.type === "single_choice" && input.userAnswer.kind === "single") {
    correct = input.userAnswer.index === question.answer;
    detail = { kind: "single", correctIndex: question.answer };
    userAnswerText = String(input.userAnswer.index);
  } else if (
    question.type === "multiple_choice" &&
    input.userAnswer.kind === "multi"
  ) {
    correct = arrayEqAsSet(input.userAnswer.indices, question.answer);
    detail = {
      kind: "multi",
      correctIndices: question.answer,
      userIndices: input.userAnswer.indices,
    };
    userAnswerText = JSON.stringify(input.userAnswer.indices);
  } else if (
    question.type === "fill_in_blank" &&
    input.userAnswer.kind === "text"
  ) {
    correct = fillMatches(input.userAnswer.value, question.answer);
    detail = {
      kind: "text",
      acceptedAnswers: question.answer,
      userValue: input.userAnswer.value,
    };
    userAnswerText = input.userAnswer.value;
  } else if (question.type === "match" && input.userAnswer.kind === "match") {
    correct = pairsEqAsSet(input.userAnswer.pairs, question.answer);
    detail = {
      kind: "match",
      correctPairs: question.answer,
      userPairs: input.userAnswer.pairs,
    };
    userAnswerText = JSON.stringify(input.userAnswer.pairs);
  } else if (question.type === "sort" && input.userAnswer.kind === "sort") {
    const expected = question.answer;
    const userOrder = input.userAnswer.order;
    correct =
      expected.length === userOrder.length &&
      expected.every((v, i) => v === userOrder[i]);
    detail = {
      kind: "sort",
      correctOrder: expected,
      userOrder,
    };
    userAnswerText = JSON.stringify(userOrder);
  } else {
    throw new Error(
      `Type mismatch: question.type=${question.type} but userAnswer.kind=${input.userAnswer.kind}`,
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return {
      correct,
      why: question.why,
      before: 0,
      after: 0,
      loggedIn: false,
      detail,
    };
  }

  const { before, after } = await recordAttempt({
    userId: session.user.id,
    nodeId: input.nodeId,
    questionId: input.questionId,
    correct,
    userAnswer: userAnswerText,
    timeMs: input.timeMs,
  });

  return {
    correct,
    why: question.why,
    before,
    after,
    loggedIn: true,
    detail,
  };
}
