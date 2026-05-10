import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media Wall - 图片视频墙",
  description: "一个强大的图片视频墙工具，支持多文件上传、预览、分类展示和删除管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
