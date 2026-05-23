/**
 * Fast Memory · Node Frontmatter Schema
 * Version: 0.2 (2026-05-23)
 *
 * 用于校验 content/nodes/**\/*.md 文件的 frontmatter。
 * 构建期 (scripts/validate-content.ts) 用此 schema 强制校验。
 *
 * 设计依据：
 *   ../data-model.md
 *   ../information-architecture.md
 */

import { z } from "zod";

// -----------------------------------------------------------------
// 层级 & 关系类型枚举（与 information-architecture.md 一致）
// -----------------------------------------------------------------

export const LayerSchema = z.enum(["L1", "L2", "L3", "L4", "L5"]);
export type Layer = z.infer<typeof LayerSchema>;

export const RelationTypeSchema = z.enum([
  "belongs_to",       // 父子结构
  "paired_with",      // 表里
  "generates",        // 五行相生
  "restrains",        // 五行相克
  "prerequisite_for", // 学习前置
  "related_to",       // 弱关联
  "treats",           // 药/方→证
  "manifests_as",     // 证→症状
]);
export type RelationType = z.infer<typeof RelationTypeSchema>;

export const RelationSchema = z.object({
  type: RelationTypeSchema,
  target: z.string().min(1), // 目标节点的 id
  note: z.string().optional(),
});
export type Relation = z.infer<typeof RelationSchema>;

// -----------------------------------------------------------------
// 模板（按 layer 不同）
// -----------------------------------------------------------------

// 五脏模板
export const ZangFuTemplateSchema = z.object({
  五行: z.enum(["木", "火", "土", "金", "水"]),
  在志: z.string(),
  在液: z.string(),
  在体: z.string(),
  其华: z.string(),
  开窍: z.string(),
  表里腑: z.string(),
  通应季节: z.enum(["春", "夏", "长夏", "秋", "冬"]).optional(),
});

// 六淫模板
export const SixEvilsTemplateSchema = z.object({
  阴阳属性: z.enum(["阴", "阳"]),
  核心性质: z.array(z.string()).min(2).max(6),
  典型症状: z.array(z.string()).optional(),
  易伤脏腑: z.array(z.string()).optional(),
});

// 单味药模板
export const HerbTemplateSchema = z.object({
  四气: z.enum(["寒", "热", "温", "凉", "平"]),
  五味: z.array(z.enum(["辛", "甘", "酸", "苦", "咸", "淡", "涩"])).min(1),
  归经: z.array(z.string()).min(1),
  核心功效: z.array(z.string()).min(1),
  要药标签: z.string().optional(),
});

// 方剂模板
export const FormulaTemplateSchema = z.object({
  组成: z.array(z.string()).min(1),
  君药: z.string(),
  功效: z.array(z.string()).min(1),
  主治: z.string(),
  所属类别: z.string().optional(),
});

// 经穴模板
export const AcupointTemplateSchema = z.object({
  归经: z.string(),
  定位: z.string(),
  进针深: z.string().optional(),
  主治范围: z.array(z.string()).min(1),
});

// 联合模板：实际使用时按 category 选择对应 schema
export const TemplateSchema = z.union([
  ZangFuTemplateSchema,
  SixEvilsTemplateSchema,
  HerbTemplateSchema,
  FormulaTemplateSchema,
  AcupointTemplateSchema,
  z.record(z.string(), z.unknown()), // 兜底，允许自由 key/value
]);

// -----------------------------------------------------------------
// recall_keypoints（用于 F05 白纸召回）
// -----------------------------------------------------------------

export const RecallKeypointSchema = z.object({
  id: z.number().int().positive(),
  text: z.string().min(1),
  aliases: z.array(z.string()).default([]),
});

export const RecallKeypointsSchema = z.object({
  required: z.array(RecallKeypointSchema).default([]),
  optional: z.array(RecallKeypointSchema).default([]),
});

// -----------------------------------------------------------------
// Source（追溯到原资料）
// -----------------------------------------------------------------

export const SourceSchema = z.object({
  file: z.string(),
  lines: z.array(z.union([z.number(), z.string()])).optional(),
  original_number: z.string().optional(),
});

// -----------------------------------------------------------------
// 主 Frontmatter Schema
// -----------------------------------------------------------------

export const NodeFrontmatterSchema = z.object({
  // 必填
  // id 允许 kebab-case + 中文字符（部分节点 id 含中文如"liver-kidney-同源"）
  id: z.string().regex(/^[一-龥a-z0-9-]+$/, "id 必须为 kebab-case 或含中文"),
  title: z.string().min(1),
  layer: LayerSchema,
  summary: z.string().min(1).max(100, "summary 应该简短（≤100 字）"),

  // 选填
  category: z.string().optional(),
  template: TemplateSchema.optional(),
  relations: z.array(RelationSchema).default([]),
  question_ids: z.array(z.string()).default([]),
  recall_keypoints: RecallKeypointsSchema.optional(),
  source: SourceSchema.optional(),

  // 状态跟踪
  status: z.enum(["draft", "generated", "reviewed", "live", "rejected"]).default("draft"),
  // YAML date 字面量被 gray-matter 解析为 Date；同时接受 ISO 字符串
  created: z.union([z.string(), z.date()]).transform((v) =>
    v instanceof Date ? v.toISOString().slice(0, 10) : v,
  ),
  updated: z.union([z.string(), z.date()]).transform((v) =>
    v instanceof Date ? v.toISOString().slice(0, 10) : v,
  ),
});

export type NodeFrontmatter = z.infer<typeof NodeFrontmatterSchema>;

// -----------------------------------------------------------------
// 校验工具
// -----------------------------------------------------------------

/**
 * 校验 frontmatter，失败时抛出可读错误。
 * @param data 解析后的 frontmatter 对象
 * @param filePath 文件路径（用于错误信息）
 */
export function validateNodeFrontmatter(data: unknown, filePath?: string) {
  const result = NodeFrontmatterSchema.safeParse(data);
  if (!result.success) {
    const prefix = filePath ? `[${filePath}]` : "";
    const errors = result.error.issues
      .map((e) => `  · ${e.path.join(".")}: ${e.message}`)
      .join("\n");
    throw new Error(`${prefix} Frontmatter 校验失败：\n${errors}`);
  }
  return result.data;
}

/**
 * L2 节点必须有 template（额外校验）
 */
export function validateLayerConstraints(fm: NodeFrontmatter, filePath?: string) {
  if (fm.layer === "L2" && !fm.template) {
    throw new Error(`[${filePath ?? fm.id}] L2 节点必须有 template 字段`);
  }
}
