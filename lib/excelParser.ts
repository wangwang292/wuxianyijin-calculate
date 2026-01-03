import * as XLSX from 'xlsx';
import type { CityInput, SalaryInput } from '@/types';

// 中英文表头映射（包含常见拼写错误）
const CITY_HEADER_MAP: Record<string, string> = {
  // 英文 - 正确拼写
  'city_name': 'city_name',
  'year': 'year',
  'base_min': 'base_min',
  'base_max': 'base_max',
  'rate': 'rate',
  // 英文 - 常见拼写错误
  'city_namte': 'city_name',  // 您的文件中的拼写错误
  'city_nm': 'city_name',
  'city_na': 'city_name',
  // 中文
  '城市': 'city_name',
  '城市名称': 'city_name',
  '年份': 'year',
  '基数下限': 'base_min',
  '社保基数下限': 'base_min',
  '基数上限': 'base_max',
  '社保基数上限': 'base_max',
  '比例': 'rate',
  '缴纳比例': 'rate',
};

const SALARY_HEADER_MAP: Record<string, string> = {
  // 英文
  'employee_id': 'employee_id',
  'employee_name': 'employee_name',
  'city_name': 'city_name',
  'month': 'month',
  'salary_amount': 'salary_amount',
  // 中文
  '员工工号': 'employee_id',
  '工号': 'employee_id',
  '员工姓名': 'employee_name',
  '姓名': 'employee_name',
  '城市': 'city_name',
  '城市名称': 'city_name',
  '月份': 'month',
  '工资金额': 'salary_amount',
  '工资': 'salary_amount',
};

/**
 * 解析城市标准 Excel 文件
 * Excel 格式要求：
 * - 第一行为表头（支持中英文）
 */
export function parseCitiesExcel(buffer: ArrayBuffer): {
  success: boolean;
  data: CityInput[];
  errors: string[];
} {
  const errors: string[] = [];
  const data: CityInput[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    if (jsonData.length === 0) {
      return { success: false, data: [], errors: ['Excel 文件为空'] };
    }

    // 检查表头并建立映射
    const firstRow = jsonData[0] as Record<string, any>;
    const fieldMapping: Record<string, string> = {};

    // 检查必需的字段（支持中英文和常见拼写错误）
    const requiredEnglishFields = ['city_name', 'year', 'base_min', 'base_max', 'rate'];
    const missingFields: string[] = [];

    for (const englishField of requiredEnglishFields) {
      let found = false;
      for (const [key, value] of Object.entries(firstRow)) {
        const trimmedKey = key.trim();
        const mappedKey = CITY_HEADER_MAP[trimmedKey] || trimmedKey;
        if (mappedKey === englishField) {
          fieldMapping[englishField] = key;
          found = true;
          break;
        }
      }
      if (!found) {
        missingFields.push(englishField);
      }
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        data: [],
        errors: [`缺少必需的列，请确保表头包含：城市名称、年份、基数下限、基数上限、比例（或对应英文）`]
      };
    }

    // 解析每一行数据
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as Record<string, any>;

      try {
        const city_name = String(row[fieldMapping.city_name]).trim();
        const year = String(row[fieldMapping.year]).trim();
        const base_min = parseInt(row[fieldMapping.base_min]);
        const base_max = parseInt(row[fieldMapping.base_max]);
        const rate = parseFloat(row[fieldMapping.rate]);

        // 数据验证
        if (!city_name) {
          errors.push(`第 ${i + 2} 行: 城市名称不能为空`);
          continue;
        }
        if (!year) {
          errors.push(`第 ${i + 2} 行: 年份不能为空`);
          continue;
        }
        if (isNaN(base_min) || base_min <= 0) {
          errors.push(`第 ${i + 2} 行: 社保基数下限必须是正整数`);
          continue;
        }
        if (isNaN(base_max) || base_max <= 0) {
          errors.push(`第 ${i + 2} 行: 社保基数上限必须是正整数`);
          continue;
        }
        if (base_min > base_max) {
          errors.push(`第 ${i + 2} 行: 社保基数下限不能大于上限`);
          continue;
        }
        if (isNaN(rate) || rate <= 0 || rate >= 1) {
          errors.push(`第 ${i + 2} 行: 缴纳比例必须是 0-1 之间的小数（如 0.15 表示 15%）`);
          continue;
        }

        data.push({
          city_name,
          year,
          base_min,
          base_max,
          rate
        });
      } catch (err) {
        errors.push(`第 ${i + 2} 行: 数据解析失败`);
      }
    }

    return {
      success: data.length > 0,
      data,
      errors
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [`文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`]
    };
  }
}

/**
 * 解析员工工资 Excel 文件
 * Excel 格式要求：
 * - 第一行为表头（支持中英文）
 */
export function parseSalariesExcel(buffer: ArrayBuffer): {
  success: boolean;
  data: SalaryInput[];
  errors: string[];
} {
  const errors: string[] = [];
  const data: SalaryInput[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    if (jsonData.length === 0) {
      return { success: false, data: [], errors: ['Excel 文件为空'] };
    }

    // 检查表头并建立映射
    const firstRow = jsonData[0] as Record<string, any>;
    console.log('工资文件第一行:', JSON.stringify(firstRow));
    const fieldMapping: Record<string, string> = {};

    // 检查必需的字段（支持中英文）- city_name 变为可选
    const requiredEnglishFields = ['employee_id', 'employee_name', 'month', 'salary_amount'];
    const missingFields: string[] = [];

    for (const englishField of requiredEnglishFields) {
      let found = false;
      for (const [key, value] of Object.entries(firstRow)) {
        const trimmedKey = key.trim();
        const mappedKey = SALARY_HEADER_MAP[trimmedKey] || trimmedKey;
        if (mappedKey === englishField) {
          fieldMapping[englishField] = key;
          found = true;
          break;
        }
      }
      if (!found) {
        missingFields.push(englishField);
      }
    }

    // city_name 是可选的
    for (const [key, value] of Object.entries(firstRow)) {
      const trimmedKey = key.trim();
      const mappedKey = SALARY_HEADER_MAP[trimmedKey] || trimmedKey;
      if (mappedKey === 'city_name') {
        fieldMapping.city_name = key;
        break;
      }
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        data: [],
        errors: [`缺少必需的列，请确保表头包含：员工工号、员工姓名、月份、工资金额（或对应英文）`]
      };
    }

    // 解析每一行数据
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as Record<string, any>;

      try {
        const employee_id = String(row[fieldMapping.employee_id]).trim();
        const employee_name = String(row[fieldMapping.employee_name]).trim();
        // city_name 是可选的，如果没有就留空，后续会使用默认城市
        const city_name = fieldMapping.city_name ? String(row[fieldMapping.city_name]).trim() : '';
        const month = String(row[fieldMapping.month]).trim();
        const salary_amount = parseInt(row[fieldMapping.salary_amount]);

        // 数据验证
        if (!employee_id) {
          errors.push(`第 ${i + 2} 行: 员工工号不能为空`);
          continue;
        }
        if (!employee_name) {
          errors.push(`第 ${i + 2} 行: 员工姓名不能为空`);
          continue;
        }
        // city_name 可以为空，后续使用默认城市
        if (!month) {
          errors.push(`第 ${i + 2} 行: 月份不能为空`);
          continue;
        }
        // 验证月份格式 YYYYMM
        if (!/^\d{6}$/.test(month)) {
          errors.push(`第 ${i + 2} 行: 月份格式不正确，应为 YYYYMM 格式（如 202401）`);
          continue;
        }
        if (isNaN(salary_amount) || salary_amount < 0) {
          errors.push(`第 ${i + 2} 行: 工资金额必须是非负整数`);
          continue;
        }

        data.push({
          employee_id,
          employee_name,
          city_name: city_name || '',  // 空字符串表示使用默认城市
          month,
          salary_amount
        });
      } catch (err) {
        errors.push(`第 ${i + 2} 行: 数据解析失败`);
      }
    }

    return {
      success: data.length > 0,
      data,
      errors
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [`文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`]
    };
  }
}
