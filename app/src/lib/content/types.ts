// 内容加载层的运行时类型（基于 zod schema 推导 + 加载后增加的派生字段）

import type { NodeFrontmatter } from "@/types/node";
import type { Question } from "@/types/question";

export type LoadedNode = NodeFrontmatter & {
  /** Markdown body（frontmatter 之外的部分） */
  body: string;
  /** body 中 [[wiki-link]] 引用到的 node ids（构建期解析） */
  outgoing_links: string[];
  /** 文件在仓库中的相对路径（用于错误定位） */
  source_path: string;
};

export type ContentGraph = {
  nodes: Map<string, LoadedNode>;
  /** 反向索引：被哪些节点引用 */
  backlinks: Map<string, Set<string>>;
  questions: Question[];
  /** 节点 id → 关联题目列表 */
  questions_by_node: Map<string, Question[]>;
};
