import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 在运行时检查环境变量，而不是在模块加载时
export const supabase = createClient(supabaseUrl, supabaseKey);
