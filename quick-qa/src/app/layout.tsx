import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { UserProvider } from '@/components/UserSelector';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Quick QA - 轻量问答社区',
  description: '一个简洁的问答社区，支持发布问题、写回答、点赞和收藏',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        <UserProvider>
          <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white">Quick QA</h1>
                    <p className="text-xs text-slate-400">轻量问答社区</p>
                  </div>
                </Link>
                <ClientLayout />
              </div>
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-slate-800 py-6 mt-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
              Quick QA · 用 Next.js + Server Actions 构建
            </div>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
