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

/**
 * Safely initialise the Supabase client.
 *
 * `@supabase/supabase-js` v2+ validates the URL **synchronously** inside
 * `createClient()`. If the URL is a placeholder or empty, a `TypeError` is
 * thrown which kills the entire Vue app before `app.mount()` runs — resulting
 * in a blank white screen on Vercel production builds where the env vars may
 * not be set yet.
 *
 * We wrap the call in a try/catch and fall back to a lightweight no-op proxy
 * so the rest of the app can still boot and show the "Supabase belum
 * dikonfigurasi" message instead of dying silently.
 */
function initClient() {
  if (isSupabaseConfigured) {
    try {
      return createClient(supabaseUrl.trim().replace(/\/+$/, ''), supabaseKey.trim(), {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    } catch (err) {
      console.warn('[PesibarWave] Supabase createClient gagal:', err.message)
    }
  }

  // Return a no-op stub so code that references `supabase.from(...)` etc.
  // does not throw a "Cannot read properties of null" error.
  const reject = () => Promise.resolve({ data: null, error: { message: 'Supabase belum dikonfigurasi' } })
  const noopQuery = () => ({
    select: noopQuery, insert: noopQuery, update: noopQuery, upsert: noopQuery,
    delete: noopQuery, eq: noopQuery, neq: noopQuery, in: noopQuery,
    order: noopQuery, limit: noopQuery, single: noopQuery, maybeSingle: noopQuery,
    match: noopQuery, filter: noopQuery, range: noopQuery, ilike: noopQuery,
    upload: reject, remove: reject, getPublicUrl: () => ({ data: { publicUrl: '' } }),
    then: (resolve) => reject().then(resolve)
  })
  return {
    from: noopQuery,
    storage: { from: () => ({ upload: reject, remove: reject, getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: reject,
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    channel: () => ({
      on: function () { return this },
      subscribe: () => ({})
    }),
    removeChannel: () => {}
  }
}

export const supabase = initClient()

/** Name of the public storage bucket used for uploads. */
export const MEDIA_BUCKET = 'media'
