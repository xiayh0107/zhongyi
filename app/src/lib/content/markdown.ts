// Markdown → HTML 渲染，并把 [[wiki-link]] 转为 anchor。
// 服务端使用。

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { LoadedNode } from "./types";
import {
  buildNodeTitleIndex,
  nodeDisplayLabel,
  nodeHref,
  resolveNodeRef,
  WIKI_LINK_RE,
} from "./links";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function normalizeCompressedTables(markdown: string): string {
  return markdown
    .split("\n")
    .map((line) => {
      const delimiterMatch = line.match(/\|(?:\s*:?-{3,}:?\s*\|){2,}/);
      if (!delimiterMatch || delimiterMatch.index === undefined) return line;

      const delimiter = delimiterMatch[0].trim();
      const before = line.slice(0, delimiterMatch.index).trim();
      const after = line.slice(delimiterMatch.index + delimiterMatch[0].length).trim();
      if (!before.startsWith("|") || !before.endsWith("|")) return line;

      const columnCount = delimiter
        .split("|")
        .slice(1, -1)
        .filter(Boolean).length;
      if (columnCount < 2) return line;

      const rows = [before, delimiter];
      const cells = after
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);

      for (let i = 0; i + columnCount <= cells.length; i += columnCount) {
        rows.push(`| ${cells.slice(i, i + columnCount).join(" | ")} |`);
      }

      return rows.join("\n");
    })
    .join("\n");
}

/**
 * 把 markdown body 渲染成 HTML 字符串。
 * 先把 [[id]] 或 [[标题]] 替换为 HTML anchor，再 remark 渲染。
 *
 * 调用方需要后续在节点状态层为这些 anchor 加上 tier 颜色。
 */
export async function renderMarkdown(
  body: string,
  nodes: Map<string, LoadedNode> = new Map(),
): Promise<string> {
  const titleToId = buildNodeTitleIndex(nodes);
  const normalizedBody = normalizeCompressedTables(body);
  const withLinks = normalizedBody.replace(WIKI_LINK_RE, (_, ref) => {
    const target = resolveNodeRef(ref, nodes, titleToId);
    if (!target) {
      return escapeHtml(nodeDisplayLabel(ref, nodes));
    }
    const id = target.id;
    const label = target.title;
    return `<a class="wiki-link" data-node-id="${escapeHtml(id)}" href="${nodeHref(id)}">${escapeHtml(label)}</a>`;
  });

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(withLinks);

  return String(file);
}
