// F00-1 登录入口页
// 对应 design/a-login.jsx 的 A_Login_Desktop / A_Login_Mobile

import { AuthShell } from "@/components/auth-shell";
import { signIn } from "@/auth";

async function loginAction(formData: FormData) {
  "use server";
  const email = formData.get("email");
  if (typeof email !== "string" || !email) {
    throw new Error("请输入邮箱");
  }
  await signIn("nodemailer", {
    email,
    redirectTo: "/login/check-email",
  });
}

export default function LoginPage() {
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
        登录 Fast Memory
      </h1>
      <p
        className="mt-3 text-[14px] leading-[1.7]"
        style={{ color: "var(--color-ink-2)" }}
      >
        用邮箱获取一次性登录链接
      </p>

      <form action={loginAction} className="mt-10 flex flex-col gap-5">
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="your@email.com"
          className="w-full px-4 py-3 text-[15px] outline-none font-sans focus:outline-2"
          style={{
            background: "var(--color-sheet)",
            border: "1px solid var(--color-line-2)",
            color: "var(--color-ink)",
            borderRadius: 0,
          }}
        />
        <button
          type="submit"
          className="w-full py-3 font-sans text-[13px] tracking-[0.08em] cursor-pointer transition"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-paper)",
            border: "none",
            borderRadius: 0,
          }}
        >
          发送登录链接
        </button>
      </form>

      <div
        className="mt-10 pt-6 flex flex-col gap-1.5 text-[13px] leading-[1.8]"
        style={{
          borderTop: "1px solid var(--color-line)",
          color: "var(--color-ink-2)",
        }}
      >
        <p>无需密码 · 无需注册</p>
        <p>首次输入即开通账户</p>
      </div>

      <p
        className="mt-6 text-[12px] leading-[1.8]"
        style={{ color: "var(--color-ink-3)" }}
      >
        我们仅使用邮箱识别你 · 不会发送任何营销邮件
      </p>
    </AuthShell>
  );
}
