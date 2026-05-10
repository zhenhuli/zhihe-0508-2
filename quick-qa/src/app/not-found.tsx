import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">页面未找到</h2>
      <p className="text-slate-400 mb-6">你访问的页面不存在</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-700 transition-all"
      >
        返回首页
      </Link>
    </div>
  );
}
