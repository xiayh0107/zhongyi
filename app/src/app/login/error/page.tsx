// F00-3 登录失败 / 链接错误页
// 对应 design/a-login.jsx 的 A_LoginError_*_Desktop

import { AuthShell } from "@/components/auth-shell";
import Link from "next/link";

type Reason = "expired" | "invalid" | "used" | "verification" | "default";

const REASON_TEXT: Record<Reason, { title: string; body: string }> = {
  expired: {
    title: "登录链接已过期",
    body: "链接只能使用一次 · 只有 15 分钟有效。",
  },
  invalid: {
    title: "登录链接无效",
    body: "可能是邮件客户端改写了链接，或链接已被使用。",
  },
  used: {
    title: "登录链接已用过",
    body: "这个链接已经使用过了，请重新发送新链接。",
  },
  verification: {
    title: "登录链接已失效",
    body: "链接只能使用一次 · 只有 15 分钟有效。",
  },
  default: {
    title: "登录失败",
    body: "登录过程中出错。请重新尝试。",
  },
};

function parseReason(raw: string | undefined): Reason {
  if (!raw) return "default";
  // Auth.js v5 默认错误是 "Verification" / "Configuration" 等
  const r = raw.toLowerCase();
  if (r === "expired") return "expired";
  if (r === "invalid") return "invalid";
  if (r === "used") return "used";
  if (r === "verification") return "verification";
  return "default";
}

export default async function LoginErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; error?: string }>;
}) {
  const params = await searchParams;
  const reason = parseReason(params.reason ?? params.error);
  const { title, body } = REASON_TEXT[reason];

  return (
    <AuthShell>
      <h1
        className="font-serif font-medium"
        style={{
          fontSize: 28,
          lineHeight: 1.15,
          letterSpacing: "0.02em",
          color: "var(--color-ink)",
        }}
      >
        {title}
      </h1>

      <p
        className="mt-4 text-[14px] leading-[1.7]"
        style={{ color: "var(--color-ink-2)" }}
      >
        {body}
      </p>

      <div className="mt-10 flex flex-col gap-3">
        <Link
          href="/login"
          className="w-full py-3 text-center font-sans text-[13px] tracking-[0.08em] no-underline"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-paper)",
          }}
        >
          重新发送登录链接
        </Link>
        <Link
          href="/login"
          className="w-full py-3 text-center font-sans text-[13px] tracking-[0.08em] no-underline"
          style={{
            background: "transparent",
            color: "var(--color-ink)",
            border: "1px solid var(--color-ink)",
          }}
        >
          换个邮箱
        </Link>
      </div>
    </AuthShell>
  );
}
