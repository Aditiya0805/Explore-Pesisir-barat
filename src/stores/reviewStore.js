import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const LS_KEY = 'pw_reviews'

// Seed reviews so the section feels alive even without a database.
const SEED_REVIEWS = [
  {
    id: 'seed-1', destination_id: 1, name: 'Michael T.', rating: 5,
    comment: 'Ujung Bocur is a dream left-hander. Consistent, long rides and super friendly locals. Will be back next season!',
    created_at: '2026-09-18T08:20:00.000Z'
  },
  {
    id: 'seed-2', destination_id: 1, name: 'Rizky Pratama', rating: 5,
    comment: 'Ombaknya luar biasa panjang dan konsisten. Pemandu lokalnya ramah, sewa board lengkap. Wajib coba!',
    created_at: '2026-09-02T03:10:00.000Z'
  },
  {
    id: 'seed-3', destination_id: 16, name: 'Keluarga Wijaya', rating: 5,
    comment: 'Pantainya landai dan aman untuk anak-anak. Ikan bakar seruitnya juara, harga bersahabat.',
    created_at: '2026-08-25T12:00:00.000Z'
  },
  {
    id: 'seed-4', destination_id: 14, name: 'Sarah L.', rating: 5,
    comment: 'We saw wild dolphins on the morning boat ride! Crystal clear water and untouched beaches. A hidden gem.',
    created_at: '2026-07-30T02:45:00.000Z'
  },
  {
    id: 'seed-5', destination_id: 10, name: 'Andini', rating: 4,
    comment: 'Seru bisa belajar langsung proses menenun Tapis. Pengrajinnya sangat menginspirasi.',
    created_at: '2026-07-14T06:30:00.000Z'
  }
]

export const useReviewStore = defineStore('review', () => {
  const reviews = ref([])          // reviews for the currently loaded destination
  const loading = ref(false)
  const submitting = ref(false)
  const currentDestId = ref(null)

  const loadLocal = () => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) return JSON.parse(raw)
    } catch (err) {
      // ignore corrupt storage
    }
    localStorage.setItem(LS_KEY, JSON.stringify(SEED_REVIEWS))
    return [...SEED_REVIEWS]
  }

  const saveLocal = (list) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(list))
    } catch (err) {
      // storage may be full / disabled — ignore silently
    }
  }

  const fetchReviews = async (destinationId, force = false) => {
    const destId = Number(destinationId)
    if (!force && currentDestId.value === destId && reviews.value.length) return
    currentDestId.value = destId

    // Optimistic local data first (instant render)
    const localForDest = loadLocal()
      .filter((r) => Number(r.destination_id) === destId)
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))

    reviews.value = localForDest

    if (!isSupabaseConfigured()) return

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('destination_id', destId)
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(data)) {
        // Merge: keep local-only reviews (offline submissions) that are not
        // present on the server yet instead of dropping them from the view.
        const serverKeys = new Set(data.map((r) => `${r.name}|${r.comment}`))
        const localOnly = localForDest.filter((r) => !serverKeys.has(`${r.name}|${r.comment}`))
        reviews.value = [...localOnly, ...data].sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        )
      }
    } catch (err) {
      console.warn('Review fetch note, using local data:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  const addReview = async ({ destinationId, name, rating, comment }) => {
    const record = {
      id: `local-${Date.now()}`,
      destination_id: Number(destinationId),
      name: String(name || '').trim() || 'Guest',
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      comment: String(comment || '').trim(),
      created_at: new Date().toISOString()
    }

    // 1. Persist locally so it works fully offline / without a backend.
    const all = loadLocal()
    all.unshift(record)
    saveLocal(all)
    if (Number(destinationId) === currentDestId.value) {
      reviews.value = [record, ...reviews.value]
    }

    // 2. Sync to Supabase when available (best-effort, never block the UI).
    if (isSupabaseConfigured()) {
      submitting.value = true
      try {
        const { error } = await supabase.from('reviews').insert([{
          destination_id: record.destination_id,
          name: record.name,
          rating: record.rating,
          comment: record.comment
        }])
        if (error) console.warn('Supabase review insert note:', error.message)
      } catch (err) {
        console.warn('Supabase review insert note:', err?.message || err)
      } finally {
        submitting.value = false
      }
    }

    return { success: true, review: record }
  }

  const averageRating = computed(() => {
    if (!reviews.value.length) return 0
    const sum = reviews.value.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
    return Math.round((sum / reviews.value.length) * 10) / 10
  })

  const reviewCount = computed(() => reviews.value.length)

  const distribution = computed(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.value.forEach(r => {
      const star = Math.round(Number(r.rating) || 0)
      if (dist[star] !== undefined) dist[star] += 1
    })
    return dist
  })

  return {
    reviews,
    loading,
    submitting,
    averageRating,
    reviewCount,
    distribution,
    fetchReviews,
    addReview
  }
})
