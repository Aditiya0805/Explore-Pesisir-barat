import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useDataStore } from '@/stores/dataStore'

export const useBookingStore = defineStore('booking', () => {
  const dataStore = useDataStore()
  const currentStep = ref(1)

  const packageId = ref('surf')
  const packageName = ref('Paket Surfing Adventure')
  const packagePrice = ref(2450000)

  const guideAddon = ref(false)
  const photoAddon = ref(false)

  const name = ref('')
  const phone = ref('')
  const email = ref('')
  const date = ref('')
  const guests = ref(1)
  const notes = ref('')

  const lastBookingCode = ref('')
  const isSubmitting = ref(false)
  const lastSyncWarning = ref('')

  // Package map — sourced from the `packages` table, with a hardcoded
  // fallback so the wizard still works when Supabase is offline.
  const FALLBACK_OPTIONS = {
    surf: { name: 'Paket Surfing Adventure', price: 2450000 },
    beach: { name: 'Paket Explore Krui', price: 1200000 },
    sunset: { name: 'Paket Sunset & Culture', price: 450000 },
    family: { name: 'Paket Wisata Pulau Pisang', price: 300000 }
  }

  const packageOptions = computed(() => {
    const options = {}
    const source = dataStore.packages?.length ? dataStore.packages : []

    source.forEach((pkg) => {
      if (!pkg?.id) return
      options[pkg.id] = {
        name: pkg.name,
        price: Number(pkg.price) || 0
      }
    })

    // Keep the core four even if the table is not seeded yet.
    Object.entries(FALLBACK_OPTIONS).forEach(([id, value]) => {
      if (!options[id]) options[id] = value
    })

    return options
  })

  const setPackage = (pkgId) => {
    const option = packageOptions.value[pkgId]
    if (option) {
      packageId.value = pkgId
      packageName.value = option.name
      packagePrice.value = option.price
    }
  }

  // Keep the selected package in sync with fresh Supabase data.
  const syncPackagePrice = () => {
    const option = packageOptions.value[packageId.value]
    if (option) {
      packageName.value = option.name
      packagePrice.value = option.price
    }
  }

  // Price calculations
  const guideAddonPrice = 250000
  const photoAddonPrice = 100000

  const subtotal = computed(() => {
    return packagePrice.value * Math.max(1, Number(guests.value) || 1)
  })

  const total = computed(() => {
    let t = subtotal.value
    if (guideAddon.value) t += guideAddonPrice
    if (photoAddon.value) t += photoAddonPrice
    return t
  })

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val)
  }

  const resetForm = () => {
    currentStep.value = 1
    packageId.value = 'surf'
    packageName.value = packageOptions.value.surf.name
    packagePrice.value = packageOptions.value.surf.price
    guideAddon.value = false
    photoAddon.value = false
    name.value = ''
    phone.value = ''
    email.value = ''
    date.value = ''
    guests.value = 1
    notes.value = ''
  }

  // Submit booking to Supabase & localStorage
  const submitBooking = async () => {
    isSubmitting.value = true
    let syncWarning = ''
    lastSyncWarning.value = ''
    try {
      const randomNum = Math.floor(1000 + Math.random() * 9000)
      const code = `PW-${new Date().getFullYear()}-${randomNum}`
      lastBookingCode.value = code

      const bookingRecord = {
        code,
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        package_id: packageId.value,
        package_name: packageName.value,
        visit_date: date.value || new Date().toISOString().split('T')[0],
        guests: Number(guests.value) || 1,
        notes: notes.value,
        guide_addon: guideAddon.value,
        photo_addon: photoAddon.value,
        status: 'pending',
        total: total.value
      }

      // 1. Save locally first so the booking is never lost.
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      localBookings.unshift({ ...bookingRecord, created_at: new Date().toISOString() })
      localStorage.setItem('bookings', JSON.stringify(localBookings))

      // 2. Save to Supabase if configured.
      if (isSupabaseConfigured) {
        try {
          const { data: sessionData } = await supabase.auth.getSession()
          const payload = {
            ...bookingRecord,
            user_id: sessionData?.session?.user?.id || null
          }
          const { error } = await supabase.from('bookings').insert([payload])
          if (error) throw error
        } catch (err) {
          syncWarning =
            'Booking tersimpan di perangkat ini, tetapi gagal dikirim ke server. ' +
            'Tunjukkan kode booking kepada admin agar data tetap tercatat.'
          console.warn('Supabase booking insert warning:', err?.message || err)
        }
      }

      currentStep.value = 4
      lastSyncWarning.value = syncWarning
      return { success: true, code, syncWarning }
    } catch (err) {
      console.error('Submit booking failed:', err)
      return { success: false, message: err.message }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    currentStep,
    packageId,
    packageName,
    packagePrice,
    guideAddon,
    photoAddon,
    name,
    phone,
    email,
    date,
    guests,
    notes,
    lastBookingCode,
    isSubmitting,
    lastSyncWarning,
    packageOptions,
    guideAddonPrice,
    photoAddonPrice,
    subtotal,
    total,
    setPackage,
    syncPackagePrice,
    formatCurrency,
    resetForm,
    submitBooking
  }
})
