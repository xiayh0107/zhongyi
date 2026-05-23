"use client";

// 双向链接 hover 预览 — 客户端事件代理
// 服务端把页面用到的 link target 数据传进来，客户端绑 hover 显示弹窗

import { useEffect, useRef, useState } from "react";
import { TOKENS_A } from "@/design/tokens";

export type WikiLinkData = {
  id: string;
  title: string;
  summary: string;
  exists: boolean;
};

type HoverInfo = {
  data: WikiLinkData;
  x: number;
  y: number;
};

export function WikiLinkHover({ targets }: { targets: WikiLinkData[] }) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const hideTimer = useRef<number | null>(null);
  const targetMap = useRef<Map<string, WikiLinkData>>(new Map());

  useEffect(() => {
    targetMap.current = new Map(targets.map((t) => [t.id, t]));
  }, [targets]);

  useEffect(() => {
    function over(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest<HTMLElement>(
        ".wiki-link[data-node-id]",
      );
      if (!link) return;
      const id = link.dataset.nodeId!;
      const data = targetMap.current.get(id);
      if (!data) return;
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
      const rect = link.getBoundingClientRect();
      setHover({
        data,
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY + 4,
      });
    }
    function out(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest(".wiki-link[data-node-id]");
      if (!link) return;
      hideTimer.current = window.setTimeout(() => setHover(null), 100);
    }
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  if (!hover) return null;

  return (
    <div
      onMouseEnter={() => {
        if (hideTimer.current) {
          window.clearTimeout(hideTimer.current);
          hideTimer.current = null;
        }
      }}
      onMouseLeave={() => {
        hideTimer.current = window.setTimeout(() => setHover(null), 100);
      }}
      style={{
        position: "absolute",
        left: hover.x,
        top: hover.y,
        zIndex: 50,
        width: 280,
        background: TOKENS_A.paper,
        border: `1px solid ${TOKENS_A.line2}`,
        padding: "12px 14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-serif" style={{ fontSize: 16, color: TOKENS_A.ink }}>
          {hover.data.exists ? hover.data.title : `${hover.data.id} (未找到)`}
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: TOKENS_A.ink3,
            letterSpacing: "0.1em",
          }}
        >
          {hover.data.exists ? "→ 点击进入" : "尚未实现"}
        </span>
      </div>
      {hover.data.summary && (
        <p
          style={{
            fontSize: 13,
            color: TOKENS_A.ink2,
            marginTop: 6,
            lineHeight: 1.6,
          }}
        >
          {hover.data.summary}
        </p>
      )}
    </div>
  );
}
