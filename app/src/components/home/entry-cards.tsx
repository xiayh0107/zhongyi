// 主页「想做点什么？」4 个入口
// 设计来源：design/a-home.jsx 的 EntryCardA

import Link from "next/link";
import { TOKENS_A } from "@/design/tokens";

type Common = { variant: "restore" | "new" | "resume" | "browse" };

type RestoreProps = Common & {
  variant: "restore";
  fadingCount: number;
};
type NewProps = Common & {
  variant: "new";
  recommended: { id: string; title: string } | null;
};
type ResumeProps = Common & {
  variant: "resume";
  resumeNode: { id: string; title: string } | null;
};
type BrowseProps = Common & {
  variant: "browse";
};

type Props = RestoreProps | NewProps | ResumeProps | BrowseProps;

export function EntryCards({
  fadingCount,
  recommended,
  resumeNode,
}: {
  fadingCount: number;
  recommended: { id: string; title: string } | null;
  resumeNode: { id: string; title: string } | null;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between" style={{ marginBottom: 14 }}>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: TOKENS_A.ink3,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          想做点什么 ?
        </span>
        <span style={{ fontSize: 11, color: TOKENS_A.ink3 }}>
          四个入口由你选 · 不是任务
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fadingCount > 0 && (
          <Card
            href="/review"
            title="补强衰减中的"
            meta={`${fadingCount} 个节点强度偏低`}
            cta="开始"
            icon="🔁"
            primary
          />
        )}
        {recommended && (
          <Card
            href={`/nodes/${recommended.id}`}
            title="探索新节点"
            meta={`推荐：${recommended.title}`}
            cta="学习"
            icon="🆕"
          />
        )}
        {resumeNode && (
          <Card
            href={`/nodes/${resumeNode.id}`}
            title="继续上次"
            meta={resumeNode.title}
            cta="继续"
            icon="↩"
          />
        )}
        <Card
          href="#outline"
          title="自由浏览"
          meta="打开完整知识地图"
          cta="浏览"
          icon="🗺"
        />
      </div>
    </div>
  );
}

function Card({
  href,
  title,
  meta,
  cta,
  icon,
  primary,
}: {
  href: string;
  title: string;
  meta: string;
  cta: string;
  icon: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className="block hover:opacity-80 transition-opacity"
      style={{
        background: primary ? TOKENS_A.ink : TOKENS_A.paper,
        color: primary ? TOKENS_A.paper : TOKENS_A.ink,
        border: primary ? "none" : `1px solid ${TOKENS_A.line}`,
        padding: "16px 18px",
        textDecoration: "none",
      }}
    >
      <div className="flex items-baseline justify-between" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            color: primary ? TOKENS_A.line2 : TOKENS_A.ink3,
          }}
        >
          {cta} →
        </span>
      </div>
      <div className="font-serif" style={{ fontSize: 16, marginBottom: 4 }}>
        {title}
      </div>
      <div
        style={{
          fontSize: 12,
          color: primary ? TOKENS_A.line2 : TOKENS_A.ink3,
          lineHeight: 1.5,
        }}
      >
        {meta}
      </div>
    </Link>
  );
}

export type { Props };
