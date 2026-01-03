// 城市社保标准类型
export interface City {
  id: number;
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
}

// 员工工资类型
export interface Salary {
  id: number;
  employee_id: string;
  employee_name: string;
  city_name: string;
  month: string;
  salary_amount: number;
}

// 计算结果类型
export interface Result {
  id: number;
  employee_name: string;
  city_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
  rate: number;
  calculated_at: string;
}

// Excel 解析的输入类型（不含 id）
export type CityInput = Omit<City, 'id'>;
export type SalaryInput = Omit<Salary, 'id'>;
export type ResultInput = Omit<Result, 'id' | 'calculated_at'>;

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 上传进度类型
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
