import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const isAdmin = ref(false)
  const loading = ref(true)

  // Initialize Auth state
  const initAuth = async () => {
    loading.value = true
    try {
      // Check saved admin session in localStorage
      const savedAdmin = localStorage.getItem('isAdminLoggedIn') === 'true'
      if (savedAdmin) {
        isAdmin.value = true
      }

      if (isSupabaseConfigured()) {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        session.value = currentSession
        user.value = currentSession?.user || null

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, newSession) => {
          session.value = newSession
          user.value = newSession?.user || null
          if (newSession?.user?.email?.includes('admin')) {
            isAdmin.value = true
            localStorage.setItem('isAdminLoggedIn', 'true')
          }
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
    // 1. Direct credentials check
    if (username === 'admin' && password === 'pesisir2026') {
      isAdmin.value = true
      localStorage.setItem('isAdminLoggedIn', 'true')
      return { success: true }
    }

    // 2. Supabase auth attempt if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password
        })
        if (error) throw error
        user.value = data.user
        session.value = data.session
        isAdmin.value = true
        localStorage.setItem('isAdminLoggedIn', 'true')
        return { success: true }
      } catch (err) {
        return { success: false, message: err.message || 'Login gagal.' }
      }
    }

    return { success: false, message: 'Username atau password salah!' }
  }

  const logoutAdmin = async () => {
    isAdmin.value = false
    localStorage.removeItem('isAdminLoggedIn')
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
