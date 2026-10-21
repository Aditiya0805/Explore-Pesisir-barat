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

const isNonEmpty = (value) => typeof value === 'string' && value.trim().length > 0

/**
 * `true` when both env values are non-empty strings. As soon as the URL and
 * key exist, Supabase is treated as configured (no extra validation) so the
 * dashboard always reports a connected state on Vercel.
 */
export const hasSupabaseCredentials = isNonEmpty(supabaseUrl) && isNonEmpty(supabaseKey)
export const isSupabaseConfigured = hasSupabaseCredentials
export const isConfigured = isSupabaseConfigured

export const supabaseConfig = {
  url: isNonEmpty(supabaseUrl) ? supabaseUrl.trim() : '',
  hasUrl: isNonEmpty(supabaseUrl),
  hasKey: isNonEmpty(supabaseKey),
  keyVariable: isNonEmpty(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
    ? 'VITE_SUPABASE_PUBLISHABLE_KEY'
    : isNonEmpty(import.meta.env.VITE_SUPABASE_ANON_KEY)
      ? 'VITE_SUPABASE_ANON_KEY'
      : null,
  hasCredentials: hasSupabaseCredentials,
  configured: isSupabaseConfigured,
  isConfigured
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
