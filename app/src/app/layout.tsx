import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  variable: "--font-sans-zh",
  weight: ["300", "400", "500", "600"],
  preload: false,
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-serif-zh",
  weight: ["400", "500", "600"],
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-en",
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
    <html
      lang="zh-CN"
      className={`${notoSans.variable} ${notoSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
