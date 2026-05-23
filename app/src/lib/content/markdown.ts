// Markdown → HTML 渲染，并把 [[wiki-link]] 转为 anchor。
// 服务端使用。

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

const WIKI_LINK_RE = /\[\[([a-z0-9-]+)\]\]/g;

/**
 * 把 markdown body 渲染成 HTML 字符串。
 * 先把 [[id]] 替换为 markdown link，再 remark 渲染。
 *
 * 调用方需要后续在节点状态层为这些 anchor 加上 tier 颜色。
 */
export async function renderMarkdown(body: string): Promise<string> {
  // 把 [[liver]] 替换为 [liver](/nodes/liver){.wiki-link data-node-id=liver}
  // 但 remark-html 不支持 attribute，所以直接生成 <a>
  const withLinks = body.replace(WIKI_LINK_RE, (_, id) => {
    return `<a class="wiki-link" data-node-id="${id}" href="/nodes/${id}">${id}</a>`;
  });

  const file = await unified()
    .use(remarkParse)
    .use(remarkHtml, { sanitize: false })
    .process(withLinks);

  return String(file);
}
