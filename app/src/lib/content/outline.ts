// 构建按 layer/category 分组的大纲树 — 主页知识地图用

import { getContentGraph } from "./loader";
import type { LoadedNode } from "./types";

export type OutlineNode = {
  nodeId: string;
  title: string;
  layer: string;
};

export type OutlineGroup = {
  label: string;
  layer: string;
  category?: string;
  nodes: OutlineNode[];
};

const LAYER_ORDER: Record<string, number> = {
  L1: 1,
  L2: 2,
  L3: 3,
  L4: 4,
  L5: 5,
};

// 分类的中文标签
const CATEGORY_LABEL: Record<string, string> = {
  "zang-fu": "五脏六腑",
  "six-evils": "六淫",
  "qi-blood": "气血津液",
  herbs: "中药",
  formulas: "方剂",
  acupoints: "经穴",
  "eight-principles": "八纲",
};

const LAYER_LABEL: Record<string, string> = {
  L1: "中医基础理论",
  L2: "脏腑 · 气血 · 六淫",
  L3: "关系",
  L4: "方药 · 经穴",
  L5: "应用",
};

export function buildOutline(): OutlineGroup[] {
  const graph = getContentGraph();
  const buckets = new Map<string, OutlineGroup>();

  for (const node of graph.nodes.values()) {
    const key = `${node.layer}::${node.category ?? "default"}`;
    if (!buckets.has(key)) {
      const label = node.category
        ? CATEGORY_LABEL[node.category] ?? node.category
        : LAYER_LABEL[node.layer] ?? node.layer;
      buckets.set(key, {
        label,
        layer: node.layer,
        category: node.category,
        nodes: [],
      });
    }
    buckets.get(key)!.nodes.push({
      nodeId: node.id,
      title: node.title,
      layer: node.layer,
    });
  }

  // 排序：layer 优先，category 字母序
  return Array.from(buckets.values()).sort((a, b) => {
    const dl = (LAYER_ORDER[a.layer] ?? 9) - (LAYER_ORDER[b.layer] ?? 9);
    if (dl !== 0) return dl;
    return (a.category ?? "").localeCompare(b.category ?? "");
  });
}

export function nodeCount(): number {
  return getContentGraph().nodes.size;
}

/**
 * 给「继续上次」入口用：取一个节点的 LoadedNode（带 title）
 */
export function getNodeMeta(id: string): LoadedNode | undefined {
  return getContentGraph().nodes.get(id);
}
