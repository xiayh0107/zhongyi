// F00-2 检查邮箱页
// 对应 design/a-login.jsx 的 A_CheckEmail_Desktop

import { AuthShell } from "@/components/auth-shell";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "你的邮箱";

  return (
    <AuthShell>
      <h1
        className="font-serif font-medium"
        style={{
          fontSize: 32,
          lineHeight: 1.15,
          letterSpacing: "0.02em",
          color: "var(--color-ink)",
        }}
      >
        邮件已发送
      </h1>

      <p
        className="mt-6 text-[14px] leading-[1.7]"
        style={{ color: "var(--color-ink-2)" }}
      >
        我们刚发了一封登录邮件到
      </p>

      <div
        className="mt-3 px-4 py-3 font-mono text-[13px]"
        style={{
          background: "var(--color-sheet)",
          border: "1px solid var(--color-line)",
          color: "var(--color-ink)",
        }}
      >
        {email}
      </div>

      <p
        className="mt-6 text-[14px] leading-[1.8]"
        style={{ color: "var(--color-ink-2)" }}
      >
        点击邮件中的链接即可登录 · 链接 15 分钟内有效
      </p>

      <ul
        className="mt-10 pt-6 flex flex-col gap-3 text-[13px] leading-[1.8]"
        style={{
          borderTop: "1px solid var(--color-line)",
          color: "var(--color-ink-2)",
        }}
      >
        <li>· 没收到？请检查垃圾邮件</li>
        <li>
          ·{" "}
          <Link
            href="/login"
            className="underline"
            style={{
              textUnderlineOffset: 3,
              color: "var(--color-ink)",
            }}
          >
            换个邮箱
          </Link>
        </li>
      </ul>
    </AuthShell>
  );
}
