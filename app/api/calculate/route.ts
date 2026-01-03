import { NextResponse } from 'next/server';
import { calculateAndStore } from '@/lib/calculations';
import type { ApiResponse } from '@/types';

export async function POST() {
  const result = await calculateAndStore();

  if (result.success) {
    return NextResponse.json<ApiResponse>({
      success: true,
      message: `计算完成，成功处理 ${result.processedCount} 位员工的数据`,
      data: {
        processedCount: result.processedCount,
        errors: result.errors
      }
    });
  } else {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: '计算失败',
      error: result.errors.join('; ')
    }, { status: 400 });
  }
}
