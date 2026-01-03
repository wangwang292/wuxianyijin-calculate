import Card from '@/components/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            五险一金计算器
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            根据员工工资数据和城市社保标准，快速计算公司应缴纳的社保公积金费用
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card
            title="数据上传"
            description="上传城市标准和员工工资数据，准备计算所需的基础信息"
            href="/upload"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            }
          />
          <Card
            title="结果查询"
            description="查看五险一金计算结果，支持搜索、排序和导出功能"
            href="/results"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* 底部说明 */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>使用说明：请先上传城市标准和员工工资数据，然后执行计算，最后查看结果</p>
        </div>
      </div>
    </div>
  );
}
