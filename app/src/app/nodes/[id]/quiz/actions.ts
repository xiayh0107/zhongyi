"use server";

import { auth } from "@/auth";
import { recordAttempt } from "@/lib/progress";
import { getQuestionsForNode } from "@/lib/content/loader";

type SubmitInput = {
  nodeId: string;
  questionId: string;
  userAnswer: number; // single_choice 索引
  timeMs: number;
};

export async function submitAnswer(input: SubmitInput): Promise<{
  correct: boolean;
  correctIndex: number;
  why: string;
  before: number;
  after: number;
  loggedIn: boolean;
}> {
  const questions = getQuestionsForNode(input.nodeId);
  const question = questions.find((q) => q.id === input.questionId);
  if (!question || question.type !== "single_choice") {
    throw new Error(`Question ${input.questionId} not found or not single_choice`);
  }

  const correctIndex = question.answer;
  const correct = input.userAnswer === correctIndex;

  const session = await auth();
  if (!session?.user?.id) {
    // 未登录：返回评判结果但不持久化
    return {
      correct,
      correctIndex,
      why: question.why,
      before: 0,
      after: 0,
      loggedIn: false,
    };
  }

  const { before, after } = await recordAttempt({
    userId: session.user.id,
    nodeId: input.nodeId,
    questionId: input.questionId,
    correct,
    userAnswer: String(input.userAnswer),
    timeMs: input.timeMs,
  });

  return {
    correct,
    correctIndex,
    why: question.why,
    before,
    after,
    loggedIn: true,
  };
}
