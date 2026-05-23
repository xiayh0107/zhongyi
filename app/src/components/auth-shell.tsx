// 共享的认证页 shell — 窄居中布局（最大宽 480）+ 顶部栏 + 页脚
// 对应 design/a-login.jsx 的 AuthShell

import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full flex flex-col bg-bg text-ink"
         style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}>
      <AuthTopBar />
      <div className="flex-1 flex items-start justify-center px-8 sm:px-8 pt-20 pb-16">
        <div className="w-full max-w-[480px]">{children}</div>
      </div>
      <AuthFooter />
    </div>
  );
}

function AuthTopBar() {
  return (
    <div
      className="h-14 px-8 flex items-center justify-between"
      style={{ borderBottom: "1px solid var(--color-line)" }}
    >
      <Link
        href="/"
        className="font-mono text-[11px] tracking-[0.14em] no-underline"
        style={{ color: "var(--color-ink-3)" }}
      >
        ← 返回
      </Link>
      <div className="flex items-baseline gap-2.5">
        <span
          className="font-serif font-medium"
          style={{ fontSize: 16, letterSpacing: "0.04em" }}
        >
          Fast Memory
        </span>
        <span className="text-[11px]" style={{ color: "var(--color-ink-3)" }}>·</span>
        <span
          className="font-serif"
          style={{ fontSize: 14, color: "var(--color-ink-2)" }}
        >
          中医
        </span>
      </div>
    </div>
  );
}

function AuthFooter() {
  return (
    <div
      className="px-8 py-6 text-center font-mono text-[10px] tracking-[0.12em]"
      style={{ color: "var(--color-ink-3)" }}
    >
      Fast Memory · 工具，不是习惯机器
    </div>
  );
}
