import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client.
 *
 * Supabase renamed "anon key" to "publishable key". Both variable names are
 * supported so older deployments (and the README) keep working:
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   (new)
 *   VITE_SUPABASE_ANON_KEY=eyJ...                      (legacy)
 *
 * The values are read directly from `import.meta.env` at build time so Vite
 * can statically replace them (required for Vercel environment variables).
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

/** `true` when both the Supabase URL and key are non-empty strings. */
export const isSupabaseConfigured = isNonEmptyString(supabaseUrl) && isNonEmptyString(supabaseKey)

export const supabaseConfig = {
  url: supabaseUrl,
  hasUrl: isNonEmptyString(supabaseUrl),
  hasKey: isNonEmptyString(supabaseKey),
  keyVariable: isNonEmptyString(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
    ? 'VITE_SUPABASE_PUBLISHABLE_KEY'
    : isNonEmptyString(import.meta.env.VITE_SUPABASE_ANON_KEY)
      ? 'VITE_SUPABASE_ANON_KEY'
      : null,
  configured: isSupabaseConfigured
}

const clientUrl = isSupabaseConfigured
  ? supabaseUrl.trim().replace(/\/+$/, '')
  : 'https://placeholder.supabase.co'
const clientKey = isSupabaseConfigured ? supabaseKey.trim() : 'placeholder-key'

export const supabase = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

/** Name of the public storage bucket used for uploads. */
export const MEDIA_BUCKET = 'media'
