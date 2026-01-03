-- ================================================
-- 五险一金计算器 - Supabase 数据表创建脚本
-- ================================================
-- 使用说明：
-- 1. 登录 Supabase 控制台 (https://supabase.com)
-- 2. 选择您的项目
-- 3. 点击左侧 "SQL Editor"
-- 4. 新建查询，粘贴本脚本并执行
-- ================================================

-- 创建城市标准表 (cities)
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate FLOAT NOT NULL
);

-- 创建员工工资表 (salaries)
CREATE TABLE IF NOT EXISTS salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL
);

-- 创建计算结果表 (results)
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  avg_salary FLOAT NOT NULL,
  contribution_base FLOAT NOT NULL,
  company_fee FLOAT NOT NULL,
  rate FLOAT NOT NULL,
  calculated_at TIMESTAMP DEFAULT NOW()
);

-- 可选：插入示例数据（用于测试）
-- 插入佛山 2024 年社保标准
INSERT INTO cities (city_name, year, base_min, base_max, rate)
VALUES ('佛山', '2024', 3958, 21048, 0.15);

-- 插入示例工资数据（测试用）
INSERT INTO salaries (employee_id, employee_name, city_name, month, salary_amount) VALUES
('E001', '张三', '佛山', '202401', 8000),
('E001', '张三', '佛山', '202402', 8000),
('E001', '张三', '佛山', '202403', 8000),
('E001', '张三', '佛山', '202404', 8000),
('E001', '张三', '佛山', '202405', 8000),
('E001', '张三', '佛山', '202406', 8000),
('E001', '张三', '佛山', '202407', 8000),
('E001', '张三', '佛山', '202408', 8000),
('E001', '张三', '佛山', '202409', 8000),
('E001', '张三', '佛山', '202410', 8000),
('E001', '张三', '佛山', '202411', 8000),
('E001', '张三', '佛山', '202412', 8000),
('E002', '李四', '佛山', '202401', 15000),
('E002', '李四', '佛山', '202402', 15000),
('E002', '李四', '佛山', '202403', 15000),
('E002', '李四', '佛山', '202404', 15000),
('E002', '李四', '佛山', '202405', 15000),
('E002', '李四', '佛山', '202406', 15000),
('E002', '李四', '佛山', '202407', 15000),
('E002', '李四', '佛山', '202408', 15000),
('E002', '李四', '佛山', '202409', 15000),
('E002', '李四', '佛山', '202410', 15000),
('E002', '李四', '佛山', '202411', 15000),
('E002', '李四', '佛山', '202412', 15000);

-- 可选：为开发环境暂时关闭 RLS (Row Level Security)
-- 注意：生产环境必须配置适当的 RLS 策略！
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（仅用于开发）
DROP POLICY IF EXISTS "Enable all access for development" ON cities;
CREATE POLICY "Enable all access for development" ON cities
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for development" ON salaries;
CREATE POLICY "Enable all access for development" ON salaries
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for development" ON results;
CREATE POLICY "Enable all access for development" ON results
  FOR ALL USING (true) WITH CHECK (true);
