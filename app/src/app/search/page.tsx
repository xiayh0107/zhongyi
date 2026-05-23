// 全局搜索页

import Link from "next/link";
import { searchNodes } from "@/lib/content/search";
import { TOKENS_A } from "@/design/tokens";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const results = q ? searchNodes(q, 30) : [];

  return (
    <div
      className="min-h-full"
      style={{ background: TOKENS_A.bg, color: TOKENS_A.ink }}
    >
      <div
        className="h-14 px-8 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${TOKENS_A.line}`, background: TOKENS_A.bg }}
      >
        <Link
          href="/"
          className="font-serif"
          style={{
            fontSize: 17,
            color: TOKENS_A.ink,
            letterSpacing: "0.04em",
            textDecoration: "none",
          }}
        >
          Fast Memory · 中医
        </Link>
        <Link
          href="/"
          className="font-mono"
          style={{
            fontSize: 11,
            color: TOKENS_A.ink3,
            letterSpacing: "0.12em",
            textDecoration: "none",
          }}
        >
          ← 返回
        </Link>
      </div>

      <div className="mx-auto" style={{ maxWidth: 720, padding: "48px 24px 80px" }}>
        <h1
          className="font-serif font-medium"
          style={{
            fontSize: 28,
            marginBottom: 20,
            color: TOKENS_A.ink,
          }}
        >
          搜索
        </h1>

        <form method="GET">
          <input
            type="text"
            name="q"
            defaultValue={q}
            autoFocus
            placeholder="输入节点名、概念或关键词..."
            className="w-full font-serif"
            style={{
              padding: "14px 18px",
              fontSize: 17,
              background: TOKENS_A.sheet,
              border: `1px solid ${TOKENS_A.line2}`,
              color: TOKENS_A.ink,
              borderRadius: 0,
              outline: "none",
            }}
          />
        </form>

        {q && (
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              color: TOKENS_A.ink3,
              marginTop: 14,
              letterSpacing: "0.1em",
            }}
          >
            {results.length} 个结果 · 关键词 「{q}」
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          {q && results.length === 0 && (
            <p style={{ fontSize: 14, color: TOKENS_A.ink2, lineHeight: 1.7 }}>
              没有找到匹配的节点。试试更短的关键词，或浏览
              <Link href="/" style={{ color: TOKENS_A.ink, marginLeft: 4 }}>
                完整知识地图
              </Link>
              。
            </p>
          )}

          <ul className="flex flex-col">
            {results.map((r) => (
              <li
                key={r.nodeId}
                style={{ borderBottom: `1px dotted ${TOKENS_A.line}` }}
              >
                <Link
                  href={`/nodes/${r.nodeId}`}
                  className="block py-3 hover:opacity-80"
                  style={{ textDecoration: "none", color: TOKENS_A.ink }}
                >
                  <div className="flex items-baseline justify-between">
                    <span
                      className="font-serif"
                      style={{ fontSize: 18, fontWeight: 500 }}
                    >
                      {r.title}
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 10,
                        color: TOKENS_A.ink3,
                        letterSpacing: "0.12em",
                      }}
                    >
                      {r.layer}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: TOKENS_A.ink2,
                      marginTop: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    {r.summary}
                  </p>
                  {r.snippet && (
                    <p
                      style={{
                        fontSize: 12,
                        color: TOKENS_A.ink3,
                        marginTop: 4,
                        lineHeight: 1.6,
                        fontStyle: "italic",
                      }}
                    >
                      …{r.snippet}…
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
