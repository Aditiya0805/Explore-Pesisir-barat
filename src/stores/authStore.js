import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Legacy key used by older builds. Admin access is now kept in memory only,
// so a stale flag can never skip the login screen.
const LEGACY_ADMIN_FLAG = 'isAdminLoggedIn'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  // In-memory only: a fresh page load always requires the login form.
  const isAdmin = ref(false)
  const loading = ref(true)

  // Initialize Auth state
  const initAuth = async () => {
    loading.value = true
    try {
      // Security hardening: clear the old persistent admin flag so existing
      // browsers cannot jump straight into the dashboard without logging in.
      localStorage.removeItem(LEGACY_ADMIN_FLAG)

      // isAdmin is intentionally NOT restored from storage.
      // The operator must submit the login form on every fresh page load.

      if (isSupabaseConfigured()) {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        session.value = currentSession
        user.value = currentSession?.user || null

        // Listen for auth changes, but never auto-grant admin privileges from
        // a restored token: the login form must always be completed first.
        supabase.auth.onAuthStateChange((_event, newSession) => {
          session.value = newSession
          user.value = newSession?.user || null
        })
      }
    } catch (err) {
      console.warn('Auth init note:', err.message)
    } finally {
      loading.value = false
    }
  }

  // Admin login (supports local fallback & Supabase auth)
  const loginAdmin = async (username, password) => {
    const normalizedUsername = String(username || '').trim().toLowerCase()

    // 1. Direct credentials check (demo / local operator account)
    if (
      (normalizedUsername === 'admin' || normalizedUsername === 'admin@pesibarwave.id') &&
      password === 'pesisir2026'
    ) {
      isAdmin.value = true
      return { success: true }
    }

    // 2. Supabase auth attempt if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedUsername,
          password: password
        })
        if (error) throw error
        user.value = data.user
        session.value = data.session
        isAdmin.value = true
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message || 'Login gagal.' }
      }
    }

    return { success: false, message: 'Username atau password salah!' }
  }

  const logoutAdmin = async () => {
    isAdmin.value = false
    user.value = null
    session.value = null
    localStorage.removeItem(LEGACY_ADMIN_FLAG)
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
  }

  const isAuthenticated = computed(() => !!user.value || isAdmin.value)

  return {
    user,
    session,
    isAdmin,
    loading,
    initAuth,
    loginAdmin,
    logoutAdmin,
    isAuthenticated
  }
})
