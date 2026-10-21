import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { friendlyDbError, checkDatabase } from '@/lib/db'
import { MOCK_BOOKINGS } from '@/data/fallbackData'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export const useAdminStore = defineStore('admin', () => {
  const bookings = ref([])
  const loading = ref(false)
  const filterStatus = ref('all')
  const searchQuery = ref('')
  const lastError = ref('')
  const dataSource = ref('none') // 'supabase' | 'local' | 'mock' | 'none'
  const connection = ref({
    configured: isSupabaseConfigured,
    database: null,
    storage: null,
    adminAccess: null,
    checkedAt: null
  })

  let realtimeChannel = null

  const readLocal = () => {
    try {
      const raw = localStorage.getItem('bookings')
      return raw ? JSON.parse(raw) : []
    } catch (err) {
      return []
    }
  }

  const writeLocal = (list) => {
    try {
      localStorage.setItem('bookings', JSON.stringify(list))
    } catch (err) {
      /* storage penuh / dimatikan — abaikan */
    }
  }

  // Load all bookings
  const fetchBookings = async () => {
    loading.value = true
    lastError.value = ''

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw new Error(friendlyDbError(error, 'bookings'))

        // An empty table is valid: do NOT replace it with demo data.
        bookings.value = data || []
        dataSource.value = 'supabase'

        // Mirror the latest server state locally so the site still works offline.
        if (data?.length) writeLocal(data)
        return
      }

      const localData = readLocal()
      if (localData.length) {
        bookings.value = localData
        dataSource.value = 'local'
      } else {
        bookings.value = [...MOCK_BOOKINGS]
        dataSource.value = 'mock'
        writeLocal(bookings.value)
      }
    } catch (err) {
      lastError.value = err?.message || 'Gagal memuat booking.'
      const localData = readLocal()
      bookings.value = localData.length ? localData : [...MOCK_BOOKINGS]
      dataSource.value = 'local'
    } finally {
      loading.value = false
    }
  }

  // Update status (confirmed, pending, cancelled)
  const updateStatus = async (bookingCode, newStatus) => {
    const target = bookings.value.find((b) => b.code === bookingCode)
    const previousStatus = target?.status

    if (target) target.status = newStatus
    writeLocal(bookings.value)
    lastError.value = ''

    if (!isSupabaseConfigured) {
      return { success: true, local: true }
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('code', bookingCode)
        .select('code, status')

      if (error) throw new Error(friendlyDbError(error, 'bookings'))
      if (!data?.length) {
        throw new Error('Status tidak berubah. Pastikan akun login punya akses admin pada tabel bookings.')
      }
      return { success: true }
    } catch (err) {
      if (target) target.status = previousStatus
      writeLocal(bookings.value)
      lastError.value = err?.message || 'Gagal memperbarui status.'
      return { success: false, message: lastError.value }
    }
  }

  const deleteBooking = async (bookingCode) => {
    if (!isSupabaseConfigured) {
      bookings.value = bookings.value.filter((b) => b.code !== bookingCode)
      writeLocal(bookings.value)
      return { success: true, local: true }
    }
    try {
      const { error } = await supabase.from('bookings').delete().eq('code', bookingCode)
      if (error) throw new Error(friendlyDbError(error, 'bookings'))
      bookings.value = bookings.value.filter((b) => b.code !== bookingCode)
      writeLocal(bookings.value)
      return { success: true }
    } catch (err) {
      lastError.value = err?.message || 'Gagal menghapus booking.'
      return { success: false, message: lastError.value }
    }
  }

  /** Subscribe to live INSERT/UPDATE/DELETE events on the bookings table. */
  const subscribeRealtime = () => {
    if (!isSupabaseConfigured || realtimeChannel) return
    try {
      realtimeChannel = supabase
        .channel('admin-bookings')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          (payload) => {
            if (payload.eventType === 'INSERT' && payload.new) {
              if (!bookings.value.some((b) => b.code === payload.new.code)) {
                bookings.value.unshift(payload.new)
              }
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              const idx = bookings.value.findIndex((b) => b.code === payload.new.code)
              if (idx >= 0) bookings.value[idx] = { ...bookings.value[idx], ...payload.new }
            } else if (payload.eventType === 'DELETE' && payload.old) {
              bookings.value = bookings.value.filter((b) => b.code !== payload.old.code)
            }
            writeLocal(bookings.value)
          }
        )
        .subscribe()
    } catch (err) {
      console.warn('Realtime booking subscription skipped:', err?.message)
    }
  }

  const unsubscribeRealtime = () => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
    }
  }

  const refreshConnection = async () => {
    const result = await checkDatabase()
    connection.value = {
      configured: result.configured,
      database: result.tables,
      storage: result.storage,
      adminAccess: result.adminAccess,
      checkedAt: new Date().toISOString()
    }
    return connection.value
  }

  // Filtered bookings
  const filteredBookings = computed(() => {
    return bookings.value.filter((b) => {
      const matchStatus = filterStatus.value === 'all' || b.status === filterStatus.value
      const query = searchQuery.value.toLowerCase().trim()
      const matchQuery =
        !query ||
        b.name?.toLowerCase().includes(query) ||
        b.code?.toLowerCase().includes(query) ||
        (b.package_name || b.packageName || '').toLowerCase().includes(query) ||
        b.phone?.toLowerCase().includes(query)
      return matchStatus && matchQuery
    })
  })

  // Computed statistics
  const stats = computed(() => {
    const totalBookings = bookings.value.length
    const confirmed = bookings.value.filter((b) => b.status === 'confirmed').length
    const pending = bookings.value.filter((b) => b.status === 'pending').length
    const cancelled = bookings.value.filter((b) => b.status === 'cancelled').length
    const revenue = bookings.value
      .filter((b) => b.status === 'confirmed')
      .reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)
    const guests = bookings.value.reduce((acc, curr) => acc + (Number(curr.guests) || 0), 0)

    return { totalBookings, confirmed, pending, cancelled, revenue, guests }
  })

  const packageStats = computed(() => {
    const map = new Map()
    bookings.value.forEach((b) => {
      const key = b.package_name || b.packageName || b.package_id || 'Lainnya'
      map.set(key, (map.get(key) || 0) + 1)
    })
    const total = bookings.value.length || 1
    return [...map.entries()]
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
  })

  const monthlyStats = computed(() => {
    const now = new Date()
    const year = now.getFullYear()
    const buckets = MONTH_LABELS.map((label) => ({ label, count: 0 }))

    bookings.value.forEach((b) => {
      const raw = b.created_at || b.visit_date || b.date
      if (!raw) return
      const date = new Date(raw)
      if (Number.isNaN(date.getTime()) || date.getFullYear() !== year) return
      buckets[date.getMonth()].count += 1
    })

    const max = Math.max(1, ...buckets.map((b) => b.count))
    return buckets.map((b) => ({
      ...b,
      height: Math.round((b.count / max) * 100)
    }))
  })

  return {
    bookings,
    loading,
    filterStatus,
    searchQuery,
    lastError,
    dataSource,
    connection,
    filteredBookings,
    stats,
    packageStats,
    monthlyStats,
    fetchBookings,
    updateStatus,
    deleteBooking,
    subscribeRealtime,
    unsubscribeRealtime,
    refreshConnection
  }
})
