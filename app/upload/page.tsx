'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';

export default function UploadPage() {
  const router = useRouter();
  const [calculating, setCalculating] = useState(false);
  const [calculationMessage, setCalculationMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleCalculate = async () => {
    setCalculating(true);
    setCalculationMessage(null);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        setCalculationMessage({
          type: 'success',
          text: result.message || '计算完成'
        });
        // 计算成功后延迟1.5秒自动跳转到结果页
        setTimeout(() => {
          router.push('/results');
        }, 1500);
      } else {
        setCalculationMessage({
          type: 'error',
          text: result.message || '计算失败'
        });
      }
    } catch (error) {
      setCalculationMessage({
        type: 'error',
        text: '网络错误，请重试'
      });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 返回首页链接 */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>

        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            数据上传与计算
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            上传城市标准和员工工资数据，然后执行五险一金计算
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* 文件上传区域 */}
          <div className="grid md:grid-cols-2 gap-6">
            <FileUpload
              title="上传城市标准"
              description="上传包含城市社保标准的 Excel 文件，表头需包含：city_name, year, base_min, base_max, rate"
              uploadUrl="/api/upload/cities"
            />
            <FileUpload
              title="上传员工工资"
              description="上传包含员工工资数据的 Excel 文件，表头需包含：employee_id, employee_name, city_name, month, salary_amount"
              uploadUrl="/api/upload/salaries"
            />
          </div>

          {/* 计算执行区域 */}
          <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">执行计算</h3>
            <p className="text-sm text-gray-600 mb-6">
              点击下方按钮，系统将根据已上传的数据计算每位员工的五险一金缴纳金额
            </p>

            {calculationMessage && (
              <div
                className={`mb-4 p-4 rounded-lg ${
                  calculationMessage.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {calculationMessage.text}
              </div>
            )}

            <button
              onClick={handleCalculate}
              disabled={calculating}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white text-lg transition-colors ${
                calculating
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {calculating ? '计算中...' : '执行计算并存储结果'}
            </button>
          </div>

          {/* 操作说明 */}
          <div className="rounded-xl bg-blue-50 p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">操作说明</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>首先上传城市社保标准 Excel 文件</li>
              <li>然后上传员工工资数据 Excel 文件</li>
              <li>点击"执行计算并存储结果"按钮进行计算</li>
              <li>计算完成后将自动跳转到结果页面</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
