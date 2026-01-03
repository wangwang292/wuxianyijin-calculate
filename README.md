# 五险一金计算器

一个基于 Next.js 和 Supabase 构建的"五险一金"计算器 Web 应用，用于计算公司为员工应缴纳的社保公积金费用。

## 功能特点

- 数据上传：支持上传城市社保标准和员工工资数据（Excel 格式）
- 自动计算：根据预设规则自动计算每位员工的五险一金缴纳金额
- 结果查询：支持搜索、排序、分页和导出功能
- 响应式设计：适配桌面端和移动端

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 框架**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **Excel 解析**: xlsx
- **语言**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入您的 Supabase 凭据：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 创建数据库表

登录 [Supabase 控制台](https://supabase.com)，在 SQL Editor 中执行 `supabase-setup.sql` 脚本。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## Excel 文件格式

### 城市标准文件 (cities.xlsx)

| city_name | year | base_min | base_max | rate |
|-----------|------|----------|----------|------|
| 佛山      | 2024 | 3958     | 21048    | 0.15 |

### 员工工资文件 (salaries.xlsx)

| employee_id | employee_name | city_name | month   | salary_amount |
|-------------|---------------|-----------|---------|---------------|
| E001        | 张三          | 佛山      | 202401  | 8000          |

## 项目结构

```
gongzijisuan/
├── app/
│   ├── api/              # API 路由
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   ├── upload/           # 上传页
│   └── results/          # 结果页
├── components/           # React 组件
├── lib/                  # 工具函数
├── types/                # TypeScript 类型
└── public/               # 静态资源
```

## 计算规则

1. 按员工姓名分组，计算年度月平均工资
2. 根据城市社保标准的基数上下限确定缴费基数：
   - 低于下限：使用下限
   - 高于上限：使用上限
   - 在范围内：使用平均工资
3. 公司应缴金额 = 缴费基数 × 缴纳比例

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署完成

## License

MIT
