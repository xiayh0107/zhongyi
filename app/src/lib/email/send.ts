// Resend 邮件发送 — 服务端调用
// 设计依据：docs/01-architecture/auth-and-account.md "邮件服务"章节

import { Resend } from "resend";
import { renderLoginEmail } from "./render";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY 未配置。请在 .env.local 或部署环境变量中设置。",
    );
  }
  resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendLoginEmail(opts: {
  to: string;
  loginUrl: string;
  from?: string;
}): Promise<{ id: string }> {
  const from = opts.from ?? process.env.EMAIL_FROM;
  if (!from) {
    throw new Error("EMAIL_FROM 未配置");
  }

  const { html, text } = renderLoginEmail({ loginUrl: opts.loginUrl });

  const result = await getResend().emails.send({
    from,
    to: opts.to,
    subject: "登录 Fast Memory · 中医",
    html,
    text,
    headers: {
      "X-Entity-Ref-ID": `fm-login-${Date.now()}`,
    },
  });

  if (result.error) {
    throw new Error(
      `Resend send failed: ${result.error.name} · ${result.error.message}`,
    );
  }

  if (!result.data?.id) {
    throw new Error("Resend 未返回 message id");
  }

  return { id: result.data.id };
}
