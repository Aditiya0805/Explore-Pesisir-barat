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
const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY

const PLACEHOLDERS = ['your-project', 'your-anon-key', 'your-publishable-key', 'placeholder']

const isNonEmpty = (val) => typeof val === 'string' && val.trim().length > 0

const checkValid = (url, key) => {
  if (!isNonEmpty(url) || !isNonEmpty(key)) return false
  const cleanUrl = url.trim()
  const cleanKey = key.trim()
  if (!/^https?:\/\//i.test(cleanUrl)) return false
  if (PLACEHOLDERS.some((p) => cleanUrl.includes(p) || cleanKey.includes(p))) return false
  return true
}

/** `true` when valid Supabase URL and key are provided via .env or Vercel */
export const hasSupabaseCredentials = checkValid(rawUrl, rawKey)
export const isSupabaseConfigured = hasSupabaseCredentials

export const supabaseConfig = {
  url: isNonEmpty(rawUrl) ? rawUrl.trim() : '',
  hasUrl: isNonEmpty(rawUrl),
  hasKey: isNonEmpty(rawKey),
  keyVariable: isNonEmpty(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
    ? 'VITE_SUPABASE_PUBLISHABLE_KEY'
    : isNonEmpty(import.meta.env.VITE_SUPABASE_ANON_KEY)
      ? 'VITE_SUPABASE_ANON_KEY'
      : null,
  hasCredentials: hasSupabaseCredentials,
  configured: isSupabaseConfigured
}

const clientUrl = hasSupabaseCredentials
  ? rawUrl.trim().replace(/\/+$/, '')
  : 'https://placeholder.supabase.co'
const clientKey = hasSupabaseCredentials ? rawKey.trim() : 'placeholder-key'

export const supabase = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

/** Name of the public storage bucket used for uploads. */
export const MEDIA_BUCKET = 'media'
