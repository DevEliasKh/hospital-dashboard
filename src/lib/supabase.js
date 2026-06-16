import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!');
    throw new Error('Missing Supabase environment variables');
}

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Supabase Key:', supabaseAnonKey.substring(0, 10) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
