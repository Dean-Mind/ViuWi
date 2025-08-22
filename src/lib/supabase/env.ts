/**
 * Supabase Environment Variable Validation
 * 
 * Validates required Supabase environment variables and provides
 * clear error messages for missing configuration.
 */

interface SupabaseEnvVars {
  url: string;
  anonKey: string;
}

/**
 * Validates and returns Supabase environment variables
 * @throws {Error} If any required environment variable is missing
 * @returns {SupabaseEnvVars} Validated environment variables
 */
export function validateSupabaseEnvVars(): SupabaseEnvVars {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const missingVars: string[] = [];
  
  if (!url) {
    missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!anonKey) {
    missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Supabase environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env.local file and ensure these variables are set correctly.'
    );
  }

  // TypeScript knows these are defined after the validation above
  return { url: url!, anonKey: anonKey! };
}
