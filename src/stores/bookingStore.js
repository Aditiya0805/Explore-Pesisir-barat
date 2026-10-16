import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const useBookingStore = defineStore('booking', () => {
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

  // Package map
  const packageOptions = {
    surf: { name: 'Paket Surfing Adventure', price: 2450000 },
    beach: { name: 'Paket Explore Krui', price: 1200000 },
    sunset: { name: 'Paket Sunset & Culture', price: 450000 },
    family: { name: 'Paket Wisata Pulau Pisang', price: 300000 }
  }

  const setPackage = (pkgId) => {
    if (packageOptions[pkgId]) {
      packageId.value = pkgId
      packageName.value = packageOptions[pkgId].name
      packagePrice.value = packageOptions[pkgId].price
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
    packageName.value = packageOptions.surf.name
    packagePrice.value = packageOptions.surf.price
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
    try {
      const randomNum = Math.floor(1000 + Math.random() * 9000)
      const code = `EPB-2026-${randomNum}`
      lastBookingCode.value = code

      const bookingRecord = {
        code,
        name: name.value,
        phone: phone.value,
        email: email.value,
        package_id: packageId.value,
        package_name: packageName.value,
        visit_date: date.value || new Date().toISOString().split('T')[0],
        guests: Number(guests.value) || 1,
        notes: notes.value,
        guide_addon: guideAddon.value,
        photo_addon: photoAddon.value,
        status: 'pending',
        total: total.value,
        created_at: new Date().toISOString()
      }

      // 1. Save to localStorage
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      localBookings.unshift(bookingRecord)
      localStorage.setItem('bookings', JSON.stringify(localBookings))

      // 2. Save to Supabase if configured
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('bookings').insert([bookingRecord])
        if (error) console.warn('Supabase booking insert warning:', error.message)
      }

      currentStep.value = 4
      return { success: true, code }
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
    packageOptions,
    guideAddonPrice,
    photoAddonPrice,
    subtotal,
    total,
    setPackage,
    formatCurrency,
    resetForm,
    submitBooking
  }
})
