// 服务端搜索 — 用 FlexSearch 索引节点（title + summary + body 摘要）
// 简化方案：每次启动构建一次索引，缓存在 globalThis

import FlexSearch from "flexsearch";
import { getContentGraph } from "./loader";

type IndexedDoc = {
  id: string;
  title: string;
  summary: string;
  body: string;
};

type SearchHit = {
  nodeId: string;
  title: string;
  summary: string;
  layer: string;
  snippet?: string;
};

function buildIndex() {
  const graph = getContentGraph();
  // 使用 Document index 支持多字段
  const idx = new FlexSearch.Document<IndexedDoc>({
    document: {
      id: "id",
      index: [
        { field: "title", tokenize: "forward" },
        { field: "summary", tokenize: "forward" },
        // body 取前 1500 字
        { field: "body", tokenize: "forward" },
      ],
      store: ["id", "title", "summary"],
    },
    // CJK 支持：用 forward + 单字 tokenize 兜底
    tokenize: "forward",
  });
  for (const node of graph.nodes.values()) {
    idx.add({
      id: node.id,
      title: node.title,
      summary: node.summary,
      body: node.body.slice(0, 1500),
    });
  }
  return idx;
}

const globalForSearch = globalThis as unknown as {
  searchIndex?: ReturnType<typeof buildIndex>;
};

function getIndex() {
  if (!globalForSearch.searchIndex) {
    globalForSearch.searchIndex = buildIndex();
  }
  return globalForSearch.searchIndex;
}

export function searchNodes(query: string, limit = 20): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  const idx = getIndex();
  const graph = getContentGraph();

  // FlexSearch 跨字段搜索
  const results = idx.search(q, { limit, enrich: false });
  // results: [{ field: "title", result: ["liver", "spleen"] }, { field: "body", result: [...] }]
  const seen = new Set<string>();
  const hits: SearchHit[] = [];
  for (const fieldResult of results) {
    for (const id of fieldResult.result as unknown as string[]) {
      if (seen.has(id)) continue;
      seen.add(id);
      const node = graph.nodes.get(id);
      if (!node) continue;
      // 计算 snippet：body 中匹配位置 ± 60 字
      const lower = q.toLowerCase();
      const bodyLow = node.body.toLowerCase();
      const titleLow = node.title.toLowerCase();
      const sumLow = node.summary.toLowerCase();
      let snippet: string | undefined;
      if (
        !titleLow.includes(lower) &&
        !sumLow.includes(lower) &&
        bodyLow.includes(lower)
      ) {
        const pos = bodyLow.indexOf(lower);
        const start = Math.max(0, pos - 30);
        const end = Math.min(node.body.length, pos + lower.length + 60);
        snippet = (start > 0 ? "…" : "") + node.body.slice(start, end) + (end < node.body.length ? "…" : "");
      }
      hits.push({
        nodeId: node.id,
        title: node.title,
        summary: node.summary,
        layer: node.layer,
        snippet,
      });
    }
  }
  return hits.slice(0, limit);
}
