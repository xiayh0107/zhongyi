// 内容加载层 — 服务端使用（fs 读 Markdown + JSON）

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  NodeFrontmatterSchema,
  validateLayerConstraints,
} from "@/types/node";
import {
  validateQuestionBank,
  validateQuestionReferences,
} from "@/types/question";
import type { Question } from "@/types/question";
import type { ContentGraph, LoadedNode } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const NODES_DIR = path.join(CONTENT_DIR, "nodes");
const QUESTIONS_FILE = path.join(CONTENT_DIR, "questions.json");

const WIKI_LINK_RE = /\[\[([a-z0-9-]+)\]\]/g;

/** 递归扫描 nodes 目录下所有 .md 文件 */
function walkMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function loadNodeFile(filePath: string): LoadedNode {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const result = NodeFrontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `  · ${e.path.join(".")}: ${e.message}`)
      .join("\n");
    throw new Error(`[${filePath}] Frontmatter 校验失败：\n${errors}`);
  }
  const frontmatter = result.data;
  validateLayerConstraints(frontmatter, filePath);

  // 解析 body 中的 [[wiki-link]]
  const body = parsed.content;
  const outgoing = new Set<string>();
  for (const m of body.matchAll(WIKI_LINK_RE)) {
    outgoing.add(m[1]);
  }

  // 检查 frontmatter.id 与文件名是否一致
  const fileBase = path.basename(filePath, ".md");
  if (frontmatter.id !== fileBase) {
    throw new Error(
      `[${filePath}] frontmatter.id "${frontmatter.id}" 与文件名 "${fileBase}" 不一致`,
    );
  }

  return {
    ...frontmatter,
    body,
    outgoing_links: Array.from(outgoing),
    source_path: path.relative(process.cwd(), filePath),
  };
}

function loadQuestions(): Question[] {
  if (!fs.existsSync(QUESTIONS_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(QUESTIONS_FILE, "utf8"));
  return validateQuestionBank(raw);
}

/**
 * 主入口：加载并校验所有内容，输出可查询的图。
 * 失败时抛出可读错误（CI 会失败）。
 */
export function loadContentGraph(): ContentGraph {
  const files = walkMarkdownFiles(NODES_DIR);
  const nodes = new Map<string, LoadedNode>();

  for (const file of files) {
    const node = loadNodeFile(file);
    if (nodes.has(node.id)) {
      throw new Error(`节点 id 重复：${node.id}（${file}）`);
    }
    nodes.set(node.id, node);
  }

  // 校验所有 relation 目标存在
  for (const node of nodes.values()) {
    for (const rel of node.relations) {
      if (!nodes.has(rel.target)) {
        // MVP 阶段允许部分关系目标缺失（如指向未实现的节点）
        // 仅警告，不报错——但应该有日志
        if (process.env.STRICT_CONTENT === "1") {
          throw new Error(
            `[${node.source_path}] relation.target "${rel.target}" 不存在`,
          );
        }
      }
    }
    // 校验 wiki-link 目标
    for (const link of node.outgoing_links) {
      if (!nodes.has(link) && process.env.STRICT_CONTENT === "1") {
        throw new Error(
          `[${node.source_path}] [[${link}]] 目标节点不存在`,
        );
      }
    }
  }

  // 构建反向索引：被哪些节点引用
  const backlinks = new Map<string, Set<string>>();
  for (const node of nodes.values()) {
    const targets = new Set<string>([
      ...node.outgoing_links,
      ...node.relations.map((r) => r.target),
    ]);
    for (const t of targets) {
      if (!backlinks.has(t)) backlinks.set(t, new Set());
      backlinks.get(t)!.add(node.id);
    }
  }

  // 加载题目
  const questions = loadQuestions();
  validateQuestionReferences(questions, new Set(nodes.keys()));

  const questionsByNode = new Map<string, Question[]>();
  for (const q of questions) {
    for (const nid of q.node_ids) {
      if (!questionsByNode.has(nid)) questionsByNode.set(nid, []);
      questionsByNode.get(nid)!.push(q);
    }
  }

  return { nodes, backlinks, questions, questions_by_node: questionsByNode };
}

// ─────────────────────────────────────────────────────────
// 缓存（开发期 hot-reload 也保持单例；生产期是构建期产物）
// ─────────────────────────────────────────────────────────

const globalForContent = globalThis as unknown as {
  contentGraph?: ContentGraph;
};

export function getContentGraph(): ContentGraph {
  if (!globalForContent.contentGraph) {
    globalForContent.contentGraph = loadContentGraph();
  }
  return globalForContent.contentGraph;
}

export function getNode(id: string): LoadedNode | undefined {
  return getContentGraph().nodes.get(id);
}

export function getQuestionsForNode(nodeId: string): Question[] {
  return getContentGraph().questions_by_node.get(nodeId) ?? [];
}

export function getBacklinks(nodeId: string): string[] {
  const set = getContentGraph().backlinks.get(nodeId);
  return set ? Array.from(set) : [];
}
