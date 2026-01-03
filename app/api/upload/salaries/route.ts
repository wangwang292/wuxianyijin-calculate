import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { parseSalariesExcel } from '@/lib/excelParser';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: '未找到上传文件'
      }, { status: 400 });
    }

    console.log('收到工资文件:', file.name, file.size);

    // 检查文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: '只支持 .xlsx 和 .xls 格式的 Excel 文件'
      }, { status: 400 });
    }

    // 解析 Excel 文件
    const buffer = await file.arrayBuffer();
    const parseResult = parseSalariesExcel(buffer);
    console.log('工资文件解析结果:', JSON.stringify(parseResult));

    if (!parseResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Excel 文件解析失败',
        error: parseResult.errors.join('; ')
      }, { status: 400 });
    }

    // 插入数据到 Supabase
    const { error } = await supabase
      .from('salaries')
      .insert(parseResult.data);

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: '数据插入失败',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `成功上传 ${parseResult.data.length} 条员工工资数据`,
      data: {
        insertedCount: parseResult.data.length,
        errors: parseResult.errors
      }
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: '服务器错误',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
