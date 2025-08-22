import { createBrowserClient } from '@supabase/ssr'
import { validateSupabaseEnvVars } from './env'

export function createClient() {
  const { url, anonKey } = validateSupabaseEnvVars()

  return createBrowserClient(url, anonKey)
}
