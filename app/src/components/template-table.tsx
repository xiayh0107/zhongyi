// Template 字段表 — 显示 L2 实体节点的结构化属性

import { TOKENS_A } from "@/design/tokens";

export function TemplateTable({
  template,
}: {
  template: Record<string, unknown> | undefined;
}) {
  if (!template) return null;
  const entries = Object.entries(template);
  if (entries.length === 0) return null;

  return (
    <div
      className="font-sans"
      style={{
        background: TOKENS_A.paper,
        border: `1px solid ${TOKENS_A.line}`,
        padding: "16px 20px",
      }}
    >
      <div
        className="font-mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.2em",
          color: TOKENS_A.ink3,
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        System / 系统联系
      </div>
      <table className="w-full" style={{ borderCollapse: "collapse" }}>
        <tbody>
          {entries.map(([k, v]) => (
            <tr key={k} style={{ borderBottom: `1px dotted ${TOKENS_A.line}` }}>
              <td
                className="py-1.5 pr-4"
                style={{ fontSize: 12, color: TOKENS_A.ink3, width: 80 }}
              >
                {k}
              </td>
              <td
                className="py-1.5 font-serif"
                style={{ fontSize: 14, color: TOKENS_A.ink }}
              >
                {Array.isArray(v) ? v.join("、") : String(v)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
