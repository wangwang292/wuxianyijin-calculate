import Link from 'next/link';
import ResultTable from '@/components/ResultTable';

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 导航按钮 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <Link
            href="/upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            继续上传
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            计算结果查询
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            查看五险一金计算结果，支持搜索、排序和导出功能
          </p>
        </div>

        {/* 结果表格 */}
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
            <ResultTable />
          </div>
        </div>
      </div>
    </div>
  );
}
