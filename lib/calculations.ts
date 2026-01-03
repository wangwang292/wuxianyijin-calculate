import { supabase } from './supabase';
import type { Salary, City, ResultInput } from '@/types';

export interface CalculationResult {
  success: boolean;
  processedCount: number;
  errors: string[];
}

/**
 * 核心计算函数：计算五险一金并存储结果
 */
export async function calculateAndStore(): Promise<CalculationResult> {
  const errors: string[] = [];
  let processedCount = 0;

  try {
    // 1. 从 salaries 表中获取所有数据
    const { data: salaries, error: salariesError } = await supabase
      .from('salaries')
      .select('*');

    if (salariesError) {
      throw new Error(`获取工资数据失败: ${salariesError.message}`);
    }

    if (!salaries || salaries.length === 0) {
      return {
        success: false,
        processedCount: 0,
        errors: ['没有找到工资数据，请先上传员工工资数据']
      };
    }

    // 2. 按 employee_name 分组，计算每位员工的"年度月平均工资"
    const employeeSalaries = new Map<string, Salary[]>();

    for (const salary of salaries) {
      const key = salary.employee_name;
      if (!employeeSalaries.has(key)) {
        employeeSalaries.set(key, []);
      }
      employeeSalaries.get(key)!.push(salary);
    }

    // 3. 从 cities 表获取所有城市标准
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*');

    if (citiesError) {
      throw new Error(`获取城市标准失败: ${citiesError.message}`);
    }

    if (!cities || cities.length === 0) {
      return {
        success: false,
        processedCount: 0,
        errors: ['没有找到城市标准数据，请先上传城市社保标准']
      };
    }

    // 创建城市标准的映射，便于快速查找
    const cityMap = new Map<string, City>();
    for (const city of cities) {
      cityMap.set(city.city_name, city);
    }

    // 4. 计算每位员工的缴费基数和公司应缴金额
    const resultsToInsert: ResultInput[] = [];
    const processedEmployees = new Set<string>();

    for (const [employeeName, salaryList] of employeeSalaries) {
      // 避免重复处理同名员工（可能来自不同城市）
      const uniqueKey = `${employeeName}-${salaryList[0].city_name}`;
      if (processedEmployees.has(uniqueKey)) {
        continue;
      }
      processedEmployees.add(uniqueKey);

      // 计算年度月平均工资
      const totalSalary = salaryList.reduce((sum, s) => sum + s.salary_amount, 0);
      const avgSalary = totalSalary / salaryList.length;

      // 获取对应城市的社保标准
      let city_name = salaryList[0].city_name;
      let cityStandard = cityMap.get(city_name);

      // 如果没有城市信息或找不到对应城市标准，使用数据库中的第一个城市作为默认
      if (!city_name || !cityStandard) {
        const defaultCity = cities[0];
        city_name = defaultCity.city_name;
        cityStandard = defaultCity;
      }

      // 此时 cityStandard 必定有值（因为 cities 数组不为空）
      const standard = cityStandard!;

      // 确定缴费基数
      let contributionBase: number;
      if (avgSalary < standard.base_min) {
        contributionBase = standard.base_min;
      } else if (avgSalary > standard.base_max) {
        contributionBase = standard.base_max;
      } else {
        contributionBase = avgSalary;
      }

      // 计算公司应缴纳金额
      const companyFee = contributionBase * standard.rate;

      resultsToInsert.push({
        employee_name: employeeName,
        city_name: city_name,
        avg_salary: parseFloat(avgSalary.toFixed(2)),
        contribution_base: parseFloat(contributionBase.toFixed(2)),
        company_fee: parseFloat(companyFee.toFixed(2)),
        rate: standard.rate
      });
    }

    // 5. 将结果存入 results 表
    if (resultsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('results')
        .insert(resultsToInsert);

      if (insertError) {
        throw new Error(`存储计算结果失败: ${insertError.message}`);
      }

      processedCount = resultsToInsert.length;
    }

    return {
      success: true,
      processedCount,
      errors
    };
  } catch (error) {
    return {
      success: false,
      processedCount,
      errors: [
        error instanceof Error ? error.message : '计算过程中发生未知错误'
      ]
    };
  }
}
