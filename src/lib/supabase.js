import { createClient } from '@supabase/supabase-js';

// Mengambil kunci rahasia dari file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Menghubungkan aplikasi ke database Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);