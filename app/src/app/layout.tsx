import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fast Memory · 中医",
  description: "把碎片资料重构为可点亮知识网络的快速学习工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
