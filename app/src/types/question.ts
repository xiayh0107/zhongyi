/**
 * Fast Memory · Question Schema
 * Version: 0.2 (2026-05-23)
 *
 * 用于校验 content/questions.json 中的题目对象。
 * 8 种题型，每种 answer 字段类型不同，用 discriminated union 严格表达。
 *
 * 设计依据：
 *   ../data-model.md
 *   ../../02-features/F03-question-types.md
 *   ../../02-features/F05-active-recall.md
 */

import { z } from "zod";

// -----------------------------------------------------------------
// 通用字段
// -----------------------------------------------------------------

const BaseQuestionSchema = z.object({
  id: z.string().regex(/^q-[a-z0-9-]+$/, "id 必须以 'q-' 开头，kebab-case"),
  node_ids: z.array(z.string()).min(1, "题目至少挂载到一个节点"),
  stem: z.string().min(1, "题干不能为空"),
  why: z.string().min(1, "必须有解析（why）"),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  source: z
    .object({
      file: z.string(),
      line: z.number().int().positive().optional(),
      original_number: z.string().optional(),
    })
    .optional(),
  status: z.enum(["draft", "generated", "reviewed", "live", "rejected"]).default("draft"),
  created: z.string(),
  updated: z.string(),
});

// -----------------------------------------------------------------
// 8 种题型的具体 schema
// -----------------------------------------------------------------

const SingleChoiceSchema = BaseQuestionSchema.extend({
  type: z.literal("single_choice"),
  options: z.array(z.string()).min(2),
  answer: z.number().int().nonnegative(), // 索引
}).refine((q) => q.answer < q.options.length, {
  message: "answer 索引超出 options 范围",
});

const MultipleChoiceSchema = BaseQuestionSchema.extend({
  type: z.literal("multiple_choice"),
  options: z.array(z.string()).min(2),
  answer: z.array(z.number().int().nonnegative()).min(1),
}).refine(
  (q) => q.answer.every((i) => i < q.options.length),
  { message: "answer 中存在超出 options 范围的索引" }
);

const FillInBlankSchema = BaseQuestionSchema.extend({
  type: z.literal("fill_in_blank"),
  answer: z.array(z.string().min(1)).min(1, "至少一个可接受答案"),
});

const MatchSchema = BaseQuestionSchema.extend({
  type: z.literal("match"),
  options: z.object({
    left: z.array(z.string()).min(2),
    right: z.array(z.string()).min(2),
  }),
  answer: z.array(z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()])),
});

const SortSchema = BaseQuestionSchema.extend({
  type: z.literal("sort"),
  options: z.array(z.string()).min(2),
  answer: z.array(z.number().int().nonnegative()),
}).refine(
  (q) => q.answer.length === q.options.length,
  { message: "answer 长度必须等于 options 长度" }
);

const SpellSchema = BaseQuestionSchema.extend({
  type: z.literal("spell"),
  answer: z.array(z.string().min(1)).min(1),
});

const DeriveSchema = BaseQuestionSchema.extend({
  type: z.literal("derive"),
  answer: z.object({
    keywords: z.array(z.string()).min(1),
    min_match: z.number().int().positive(),
    reference: z.string().min(1), // 参考答案文本
  }),
});

const BlankRecallSchema = BaseQuestionSchema.extend({
  type: z.literal("blank_recall"),
  // blank_recall 不在 questions.json 单独定义；走节点的 recall_keypoints
  // 此 schema 仅为运行时记录尝试用
  answer: z.object({
    required_ids: z.array(z.number().int().positive()).default([]),
    optional_ids: z.array(z.number().int().positive()).default([]),
  }),
});

// -----------------------------------------------------------------
// Discriminated Union
// -----------------------------------------------------------------

export const QuestionSchema = z.discriminatedUnion("type", [
  SingleChoiceSchema,
  MultipleChoiceSchema,
  FillInBlankSchema,
  MatchSchema,
  SortSchema,
  SpellSchema,
  DeriveSchema,
  BlankRecallSchema,
]);

export type Question = z.infer<typeof QuestionSchema>;

// 单独导出每种类型（方便消费方按类型缩窄）
export type SingleChoiceQuestion = z.infer<typeof SingleChoiceSchema>;
export type MultipleChoiceQuestion = z.infer<typeof MultipleChoiceSchema>;
export type FillInBlankQuestion = z.infer<typeof FillInBlankSchema>;
export type MatchQuestion = z.infer<typeof MatchSchema>;
export type SortQuestion = z.infer<typeof SortSchema>;
export type SpellQuestion = z.infer<typeof SpellSchema>;
export type DeriveQuestion = z.infer<typeof DeriveSchema>;
export type BlankRecallQuestion = z.infer<typeof BlankRecallSchema>;

// -----------------------------------------------------------------
// 整体题库
// -----------------------------------------------------------------

export const QuestionBankSchema = z.array(QuestionSchema);

// -----------------------------------------------------------------
// 校验工具
// -----------------------------------------------------------------

/**
 * 校验单个题目
 */
export function validateQuestion(data: unknown, label?: string) {
  const result = QuestionSchema.safeParse(data);
  if (!result.success) {
    const prefix = label ?? "Question";
    const errors = result.error.issues
      .map((e) => `  · ${e.path.join(".")}: ${e.message}`)
      .join("\n");
    throw new Error(`[${prefix}] 校验失败：\n${errors}`);
  }
  return result.data;
}

/**
 * 校验整个题库
 */
export function validateQuestionBank(data: unknown) {
  const result = QuestionBankSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues
      .slice(0, 20) // 限制输出
      .map((e) => `  · [${e.path.join(".")}] ${e.message}`)
      .join("\n");
    throw new Error(`题库校验失败：\n${errors}`);
  }

  // 额外校验：id 唯一
  const ids = new Set<string>();
  for (const q of result.data) {
    if (ids.has(q.id)) {
      throw new Error(`题目 id 重复：${q.id}`);
    }
    ids.add(q.id);
  }

  return result.data;
}

/**
 * 交叉校验：题目 node_ids 是否都存在于节点集合中
 */
export function validateQuestionReferences(
  questions: Question[],
  knownNodeIds: Set<string>
) {
  const dangling: { questionId: string; missingNodes: string[] }[] = [];
  for (const q of questions) {
    const missing = q.node_ids.filter((nid) => !knownNodeIds.has(nid));
    if (missing.length > 0) {
      dangling.push({ questionId: q.id, missingNodes: missing });
    }
  }
  if (dangling.length > 0) {
    const msg = dangling
      .map((d) => `  · ${d.questionId} → 引用不存在的节点：${d.missingNodes.join(", ")}`)
      .join("\n");
    throw new Error(`存在题目引用了不存在的节点：\n${msg}`);
  }
}
