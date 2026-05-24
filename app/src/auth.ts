// Auth.js v5 配置
// EMAIL_DRIVER:
//   console — 开发期，magic link 输出到 dev server stdout（不真发）
//   resend  — 通过 Resend API 真发邮件（需 RESEND_API_KEY + EMAIL_FROM）

import NextAuth, { type DefaultSession } from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { sendLoginEmail } from "@/lib/email/send";
import { checkEmailRateLimit } from "@/lib/email/rate-limit";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
    error: "/login/error",
  },
  providers: [
    Nodemailer({
      from: process.env.EMAIL_FROM ?? "Fast Memory <login@local.dev>",
      // Auth.js 强制要求 server 配置，但我们 override 了 sendVerificationRequest
      server: { host: "localhost", port: 1025 },
      async sendVerificationRequest({ identifier, url }) {
        const driver = process.env.EMAIL_DRIVER ?? "console";

        // 速率限制：同邮箱 60 秒内最多 1 次
        const rl = checkEmailRateLimit(identifier);
        if (!rl.ok) {
          throw new Error(
            `Too many requests. Please wait ${rl.retryAfterSec}s.`,
          );
        }

        if (driver === "console") {
          console.log(
            [
              "",
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
              "📧 Magic Link · 开发期占位（未真发邮件）",
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
              `   收件人：${identifier}`,
              `   登录链接：${url}`,
              `   有效期：15 分钟`,
              "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
              "",
            ].join("\n"),
          );
          return;
        }

        if (driver === "resend") {
          try {
            const result = await sendLoginEmail({
              to: identifier,
              loginUrl: url,
            });
            console.log(
              `[email] Resend message sent · id=${result.id} · to=${identifier}`,
            );
            return;
          } catch (err) {
            console.error(`[email] Resend send failed:`, err);
            throw err;
          }
        }

        throw new Error(`Unknown EMAIL_DRIVER: ${driver}`);
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
