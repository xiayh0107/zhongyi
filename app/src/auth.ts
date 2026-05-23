// Auth.js v5 配置
// MVP: Email Magic Link · 开发期 magic link 输出到控制台

import NextAuth, { type DefaultSession } from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

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
      // 这是一个 stub，永远不会被使用
      server: { host: "localhost", port: 1025 },
      // MVP 开发期：不真发邮件，把 magic link 打印到 dev server 控制台
      async sendVerificationRequest({ identifier, url }) {
        const driver = process.env.EMAIL_DRIVER ?? "console";
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
        // 生产期：接 Resend
        throw new Error(
          `EMAIL_DRIVER=${driver} 尚未实现。MVP 阶段请用 'console'。`,
        );
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
