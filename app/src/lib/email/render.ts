// 邮件模板渲染 — 从 login.html 读取并替换占位符
// 模板设计来源：design/a-email.html

import fs from "node:fs";
import path from "node:path";

const TEMPLATE_PATH = path.join(
  process.cwd(),
  "src/lib/email/login.html",
);

let templateCache: string | null = null;

function loadTemplate(): string {
  if (templateCache) return templateCache;
  templateCache = fs.readFileSync(TEMPLATE_PATH, "utf8");
  return templateCache;
}

export type LoginEmailVars = {
  loginUrl: string;
  expiresIn?: string;
  requestIp?: string;
  requestTime?: string;
};

/**
 * 渲染登录邮件 HTML。
 * 替换模板里的 {{LOGIN_URL}} {{EXPIRES_IN}} {{REQUEST_IP}} {{REQUEST_TIME}}
 */
export function renderLoginEmail(vars: LoginEmailVars): {
  html: string;
  text: string;
} {
  const html = loadTemplate()
    .replaceAll("{{LOGIN_URL}}", escapeHtml(vars.loginUrl))
    .replaceAll("{{EXPIRES_IN}}", escapeHtml(vars.expiresIn ?? "15 分钟"))
    .replaceAll("{{REQUEST_IP}}", escapeHtml(vars.requestIp ?? "—"))
    .replaceAll("{{REQUEST_TIME}}", escapeHtml(vars.requestTime ?? nowStr()));

  // 纯文本 fallback（部分邮件客户端只显示纯文本）
  const text = [
    "登录 Fast Memory · 中医",
    "",
    "点击下方链接登录：",
    vars.loginUrl,
    "",
    `链接 ${vars.expiresIn ?? "15 分钟"} 内有效，只能使用一次。`,
    "如果不是你本人操作，请忽略此邮件。",
  ].join("\n");

  return { html, text };
}

function nowStr(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
