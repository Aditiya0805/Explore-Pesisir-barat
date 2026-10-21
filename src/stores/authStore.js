import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Legacy flag from older builds. Admin access is never restored from it.
const LEGACY_ADMIN_FLAG = 'isAdminLoggedIn'

// Demo operator account (also used by the README). It only unlocks the local
// demo mode; real database writes require a Supabase Auth session.
const DEMO_EMAIL = 'admin@pesibarwave.id'
const DEMO_USERNAME = 'admin'
const DEMO_PASSWORD = 'pesisir2026'

const MISSING_ADMIN_HINT =
  'Akun admin Supabase belum ada. Buat user di Supabase Dashboard → Authentication → Users ' +
  `(email ${DEMO_EMAIL}, password ${DEMO_PASSWORD}), lalu login ulang.`

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const isAdmin = ref(false)
  const loading = ref(true)
  const authMode = ref(null) // 'supabase' | 'demo'
  const lastAuthError = ref('')

  const isDemo = computed(() => authMode.value === 'demo')
  const isSupabaseSession = computed(() => Boolean(session.value && user.value))
  let authListenerBound = false

  const applySession = (nextSession) => {
    session.value = nextSession
    user.value = nextSession?.user || null
    if (nextSession?.user) {
      isAdmin.value = true
      authMode.value = 'supabase'
    }
  }

  const initAuth = async () => {
    loading.value = true
    try {
      // Clear the retired persistent flag so it can never bypass the form.
      localStorage.removeItem(LEGACY_ADMIN_FLAG)

      if (!isSupabaseConfigured) {
        authMode.value = null
        isAdmin.value = false
        return
      }

      const { data } = await supabase.auth.getSession()
      applySession(data?.session || null)

      // Keep the UI in sync with token refresh / sign-out in other tabs.
      if (!authListenerBound) {
        authListenerBound = true
        supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (nextSession?.user) {
            applySession(nextSession)
          } else {
            session.value = null
            user.value = null
            if (authMode.value === 'supabase') {
              isAdmin.value = false
              authMode.value = null
            }
          }
        })
      }
    } catch (err) {
      console.warn('Auth init note:', err?.message)
    } finally {
      loading.value = false
    }
  }

  /**
   * Login order:
   * 1. Supabase Auth (needed for Row Level Security writes).
   * 2. Local demo credentials -> dashboard opens in read-only local mode.
   */
  const loginAdmin = async (username, password) => {
    const normalizedUsername = String(username || '').trim().toLowerCase()
    lastAuthError.value = ''

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedUsername,
          password
        })

        if (!error && data?.session) {
          applySession(data.session)
          return { success: true, mode: 'supabase' }
        }
        lastAuthError.value = error?.message || ''
      } catch (err) {
        lastAuthError.value = err?.message || 'Login Supabase gagal.'
      }
    }

    const isDemoCredential =
      (normalizedUsername === DEMO_USERNAME || normalizedUsername === DEMO_EMAIL) &&
      password === DEMO_PASSWORD

    if (isDemoCredential) {
      isAdmin.value = true
      authMode.value = 'demo'
      return {
        success: true,
        mode: 'demo',
        warning:
          'Login demo lokal aktif. Perubahan data tidak dikirim ke Supabase sampai Anda login dengan akun Supabase Auth.'
      }
    }

    if (isSupabaseConfigured && lastAuthError.value) {
      const hint = /invalid login credentials/i.test(lastAuthError.value) ? ` ${MISSING_ADMIN_HINT}` : ''
      return {
        success: false,
        message: `${lastAuthError.value}.${hint}`
      }
    }

    return { success: false, message: 'Username atau password salah!' }
  }

  const logoutAdmin = async () => {
    isAdmin.value = false
    authMode.value = null
    user.value = null
    session.value = null
    localStorage.removeItem(LEGACY_ADMIN_FLAG)
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
  }

  const isAuthenticated = computed(() => Boolean(user.value) || authMode.value === 'demo')

  return {
    user,
    session,
    isAdmin,
    loading,
    authMode,
    isDemo,
    isSupabaseSession,
    lastAuthError,
    initAuth,
    loginAdmin,
    logoutAdmin,
    isAuthenticated
  }
})
