import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client.
 *
 * Supabase renamed "anon key" to "publishable key". Both variable names are
 * supported so older deployments (and the README) keep working:
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   (new)
 *   VITE_SUPABASE_ANON_KEY=eyJ...                      (legacy)
 */
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '')
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  ''
).trim()

const PLACEHOLDERS = ['your-project', 'your-anon-key', 'your-publishable-key', 'placeholder']

const looksConfigured = () => {
  if (!supabaseUrl || !supabaseKey) return false
  if (!/^https?:\/\//i.test(supabaseUrl)) return false
  if (PLACEHOLDERS.some((p) => supabaseUrl.includes(p) || supabaseKey.includes(p))) return false
  return true
}

export const supabaseConfig = {
  url: supabaseUrl,
  hasUrl: Boolean(supabaseUrl),
  hasKey: Boolean(supabaseKey),
  keyVariable: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    ? 'VITE_SUPABASE_PUBLISHABLE_KEY'
    : import.meta.env.VITE_SUPABASE_ANON_KEY
      ? 'VITE_SUPABASE_ANON_KEY'
      : null,
  get configured() {
    return looksConfigured()
  }
}

export const isSupabaseConfigured = () => looksConfigured()

const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackKey = 'placeholder-key'

export const supabase = createClient(
  looksConfigured() ? supabaseUrl : fallbackUrl,
  looksConfigured() ? supabaseKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

/** Name of the public storage bucket used for uploads. */
export const MEDIA_BUCKET = 'media'
