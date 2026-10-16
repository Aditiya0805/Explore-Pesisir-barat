import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { MOCK_BOOKINGS } from '@/data/fallbackData'

export const useAdminStore = defineStore('admin', () => {
  const bookings = ref([])
  const loading = ref(false)
  const filterStatus = ref('all')
  const searchQuery = ref('')

  // Load all bookings
  const fetchBookings = async () => {
    loading.value = true
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data?.length) {
          bookings.value = data
          return
        }
      }

      // Fallback: localStorage or default mock bookings
      const localData = localStorage.getItem('bookings')
      if (localData) {
        bookings.value = JSON.parse(localData)
      } else {
        bookings.value = [...MOCK_BOOKINGS]
        localStorage.setItem('bookings', JSON.stringify(bookings.value))
      }
    } catch (err) {
      console.warn('Fetch bookings note:', err)
      const localData = localStorage.getItem('bookings')
      bookings.value = localData ? JSON.parse(localData) : [...MOCK_BOOKINGS]
    } finally {
      loading.value = false
    }
  }

  // Update status (confirmed, pending, cancelled)
  const updateStatus = async (bookingCode, newStatus) => {
    // 1. Update local reactive state
    const target = bookings.value.find(b => b.code === bookingCode)
    if (target) {
      target.status = newStatus
    }
    // Update localStorage
    localStorage.setItem('bookings', JSON.stringify(bookings.value))

    // 2. Update Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('code', bookingCode)
      } catch (err) {
        console.warn('Supabase status update error:', err)
      }
    }
  }

  // Filtered bookings
  const filteredBookings = computed(() => {
    return bookings.value.filter(b => {
      const matchStatus = filterStatus.value === 'all' || b.status === filterStatus.value
      const query = searchQuery.value.toLowerCase()
      const matchQuery =
        !query ||
        b.name?.toLowerCase().includes(query) ||
        b.code?.toLowerCase().includes(query) ||
        b.package_name?.toLowerCase().includes(query)
      return matchStatus && matchQuery
    })
  })

  // Computed statistics
  const stats = computed(() => {
    const totalBookings = bookings.value.length
    const confirmed = bookings.value.filter(b => b.status === 'confirmed').length
    const pending = bookings.value.filter(b => b.status === 'pending').length
    const revenue = bookings.value
      .filter(b => b.status === 'confirmed')
      .reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)

    return {
      totalBookings,
      confirmed,
      pending,
      revenue
    }
  })

  return {
    bookings,
    loading,
    filterStatus,
    searchQuery,
    fetchBookings,
    updateStatus,
    filteredBookings,
    stats
  }
})
