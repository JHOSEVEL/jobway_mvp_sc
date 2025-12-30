
import { createClient } from '@supabase/supabase-js';

// As chaves devem estar configuradas no seu ambiente
const supabaseUrl = process.env.SUPABASE_URL || 'https://znewstmnzodkwitcmxoi.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_B1FgHEDYeco7TyMIfP-OPw_f1XB5YKQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Exemplo de uso para Tabelas JOBWAY:
 * - profiles (id, user_type, city, points)
 * - jobs (id, company_id, title, city, status, salary)
 * - applications (id, job_id, professional_id)
 */
