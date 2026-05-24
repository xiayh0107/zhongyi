import type { BaseLoadedNode } from "./types";

export const WIKI_LINK_RE = /\[\[([一-龥a-z0-9-]+)\]\]/g;

const ROUTE_ID_ALIASES: Record<string, string> = {
  "heart-kidney-xiang-jiao": "heart-kidney-相交",
  "liver-kidney-tong-yuan": "liver-kidney-同源",
};

const FALLBACK_LABELS: Record<string, string> = {
  heart: "心",
  liver: "肝",
  spleen: "脾",
  lung: "肺",
  kidney: "肾",
  stomach: "胃",
  "small-intestine": "小肠",
  "large-intestine": "大肠",
  gallbladder: "胆",
  bladder: "膀胱",
  qi: "气",
  blood: "血",
  "body-fluids": "津液",
  "heart-kidney-相交": "心肾相交",
  "liver-kidney-同源": "肝肾同源",
};

export function nodeHref(id: string): string {
  return `/nodes/${encodeURIComponent(id)}`;
}

export function nodeSubpathHref(id: string, subpath: string): string {
  return `${nodeHref(id)}/${subpath}`;
}

export function decodeNodeRouteParam(rawId: string): string {
  let id = rawId;
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(id);
      if (decoded === id) break;
      id = decoded;
    } catch {
      break;
    }
  }
  id = id.normalize("NFC");
  return ROUTE_ID_ALIASES[id] ?? id;
}

export function nodeDisplayLabel(
  id: string,
  nodes: Map<string, BaseLoadedNode> = new Map(),
): string {
  return nodes.get(id)?.title ?? FALLBACK_LABELS[id] ?? id;
}

export function buildNodeTitleIndex(
  nodes: Map<string, BaseLoadedNode>,
): Map<string, string> {
  const titleToId = new Map<string, string>();
  for (const node of nodes.values()) {
    if (!titleToId.has(node.title)) {
      titleToId.set(node.title, node.id);
    }
  }
  return titleToId;
}

export function resolveNodeRef(
  ref: string,
  nodes: Map<string, BaseLoadedNode>,
  titleToId = buildNodeTitleIndex(nodes),
): BaseLoadedNode | undefined {
  return nodes.get(ref) ?? nodes.get(titleToId.get(ref) ?? "");
}
