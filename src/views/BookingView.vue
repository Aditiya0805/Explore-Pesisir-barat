<template>
  <div class="booking-view-container section-padding">
    <div class="container">
      <!-- Steps Progress Bar -->
      <div class="booking-steps-bar">
        <div class="booking-steps-progress-line"></div>
        <div
          class="booking-steps-progress-active-line"
          :style="{ width: progressPercentage + '%' }"
        ></div>

        <div
          v-for="step in 4"
          :key="step"
          class="booking-step-item"
          :class="{ active: bookingStore.currentStep >= step }"
        >
          <div class="booking-step-circle">{{ step }}</div>
          <span class="booking-step-label">{{ stepLabels[step - 1] }}</span>
        </div>
      </div>

      <!-- Booking Content Form & Summary Grid -->
      <div v-if="bookingStore.currentStep < 4" class="booking-layout">
        <!-- Left Side Forms -->
        <div class="booking-form-container">
          <!-- STEP 1: PILIH LAYANAN -->
          <div v-if="bookingStore.currentStep === 1" class="booking-step-view">
            <h3>Pilih Paket & Layanan Wisata</h3>
            <div class="service-cards-selector">
              <div
                v-for="(pkg, key) in bookingStore.packageOptions"
                :key="key"
                class="service-select-card"
                :class="{ selected: bookingStore.packageId === key }"
                @click="bookingStore.setPackage(key)"
              >
                <input
                  type="radio"
                  name="booking-service"
                  :id="'svc-' + key"
                  :value="key"
                  :checked="bookingStore.packageId === key"
                >
                <div class="service-select-card-details">
                  <h5>
                    {{ pkg.name }}
                    <span v-if="key === 'surf'" class="badge badge-accent" style="margin-left: 5px;">Terlaris</span>
                  </h5>
                  <p>{{ getPackageSubtitle(key) }}</p>
                </div>
                <div class="service-select-card-price">
                  {{ bookingStore.formatCurrency(pkg.price) }}
                  <span style="font-size:0.75rem; font-weight:500; color:var(--color-text-light);">/ pax</span>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 2rem;">Tambahan Opsional</h3>
            <div class="form-grid">
              <div class="form-group-full">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="bookingStore.guideAddon">
                  <span>Jasa Pemandu Surfing Eksklusif (+ {{ bookingStore.formatCurrency(bookingStore.guideAddonPrice) }}/hari)</span>
                </label>
              </div>
              <div class="form-group-full">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="bookingStore.photoAddon">
                  <span>Dokumentasi Drone & Video Sinematik (+ {{ bookingStore.formatCurrency(bookingStore.photoAddonPrice) }})</span>
                </label>
              </div>
            </div>
          </div>

          <!-- STEP 2: DATA PEMESAN -->
          <div v-if="bookingStore.currentStep === 2" class="booking-step-view">
            <h3>Isi Data Pemesan</h3>
            <div class="form-grid">
              <div class="form-group form-group-full">
                <label for="book-name">Nama Lengkap <span class="required">*</span></label>
                <input
                  type="text"
                  id="book-name"
                  class="form-control"
                  v-model="bookingStore.name"
                  placeholder="Masukkan nama lengkap Anda"
                  :class="{ 'is-invalid': errors.name }"
                >
                <span v-if="errors.name" class="form-error-msg">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label for="book-phone">Nomor WhatsApp <span class="required">*</span></label>
                <input
                  type="tel"
                  id="book-phone"
                  class="form-control"
                  v-model="bookingStore.phone"
                  placeholder="Contoh: 081234567890"
                  :class="{ 'is-invalid': errors.phone }"
                >
                <span v-if="errors.phone" class="form-error-msg">{{ errors.phone }}</span>
              </div>
              <div class="form-group">
                <label for="book-email">Alamat Email <span class="required">*</span></label>
                <input
                  type="email"
                  id="book-email"
                  class="form-control"
                  v-model="bookingStore.email"
                  placeholder="Contoh: nama@domain.com"
                  :class="{ 'is-invalid': errors.email }"
                >
                <span v-if="errors.email" class="form-error-msg">{{ errors.email }}</span>
              </div>
              <div class="form-group">
                <label for="book-date">Tanggal Kunjungan <span class="required">*</span></label>
                <input
                  type="date"
                  id="book-date"
                  class="form-control"
                  v-model="bookingStore.date"
                  :class="{ 'is-invalid': errors.date }"
                >
                <span v-if="errors.date" class="form-error-msg">{{ errors.date }}</span>
              </div>
              <div class="form-group">
                <label for="book-guests">Jumlah Wisatawan <span class="required">*</span></label>
                <input
                  type="number"
                  id="book-guests"
                  class="form-control"
                  v-model.number="bookingStore.guests"
                  min="1"
                  max="100"
                >
              </div>
              <div class="form-group form-group-full">
                <label for="book-notes">Catatan Tambahan (Opsional)</label>
                <textarea
                  id="book-notes"
                  class="form-control"
                  v-model="bookingStore.notes"
                  placeholder="Tuliskan permintaan khusus Anda di sini (misal: penjemputan dari bandara, menu vegetarian, dll.)"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- STEP 3: KONFIRMASI -->
          <div v-if="bookingStore.currentStep === 3" class="booking-step-view">
            <h3>Konfirmasi Detail Pemesanan</h3>
            <p style="font-size:0.95rem; color:var(--color-text-medium); margin-bottom: 1.5rem;">
              Silakan periksa kembali semua informasi sebelum melakukan konfirmasi pemesanan ke Supabase Database.
            </p>

            <div class="confirm-review-box">
              <div class="confirm-review-title">
                <i class="fa-solid fa-suitcase"></i> Paket Layanan Utama
              </div>
              <div class="confirm-grid">
                <div class="confirm-item">
                  <span class="label">Paket Wisata: </span>
                  <span class="val">{{ bookingStore.packageName }}</span>
                </div>
                <div class="confirm-item">
                  <span class="label">Tarif Utama: </span>
                  <span class="val">{{ bookingStore.formatCurrency(bookingStore.packagePrice) }} / pax</span>
                </div>
              </div>
            </div>

            <div class="confirm-review-box">
              <div class="confirm-review-title">
                <i class="fa-solid fa-circle-info"></i> Layanan Tambahan (Add-ons)
              </div>
              <div style="font-size:0.875rem; color:var(--color-text-dark); font-weight:600;">
                <span v-if="!bookingStore.guideAddon && !bookingStore.photoAddon">
                  Tidak ada layanan tambahan terpilih
                </span>
                <ul v-else style="padding-left: 1.25rem;">
                  <li v-if="bookingStore.guideAddon">Jasa Pemandu Surfing (+ {{ bookingStore.formatCurrency(bookingStore.guideAddonPrice) }})</li>
                  <li v-if="bookingStore.photoAddon">Dokumentasi Video Drone (+ {{ bookingStore.formatCurrency(bookingStore.photoAddonPrice) }})</li>
                </ul>
              </div>
            </div>

            <div class="confirm-review-box">
              <div class="confirm-review-title">
                <i class="fa-solid fa-user-tag"></i> Data Personal Pemesan
              </div>
              <div class="confirm-grid">
                <div class="confirm-item">
                  <span class="label">Nama: </span>
                  <span class="val">{{ bookingStore.name }}</span>
                </div>
                <div class="confirm-item">
                  <span class="label">WhatsApp: </span>
                  <span class="val">{{ bookingStore.phone }}</span>
                </div>
                <div class="confirm-item">
                  <span class="label">Email: </span>
                  <span class="val">{{ bookingStore.email }}</span>
                </div>
                <div class="confirm-item">
                  <span class="label">Tanggal Kunjungan: </span>
                  <span class="val">{{ bookingStore.date || 'Belum ditentukan' }}</span>
                </div>
                <div class="confirm-item">
                  <span class="label">Jumlah Tamu: </span>
                  <span class="val">{{ bookingStore.guests }} Orang</span>
                </div>
              </div>
            </div>

            <div class="confirm-review-box">
              <div class="confirm-review-title">
                <i class="fa-solid fa-note-sticky"></i> Catatan Tambahan
              </div>
              <p style="font-size:0.875rem; font-weight:600; color:var(--color-text-dark); font-style:italic;">
                {{ bookingStore.notes || 'Tidak ada catatan tambahan' }}
              </p>
            </div>
          </div>

          <!-- Navigation Action Buttons -->
          <div class="booking-nav-buttons">
            <button
              class="btn btn-secondary"
              :disabled="bookingStore.currentStep === 1"
              @click="prevStep"
            >
              <i class="fa-solid fa-arrow-left"></i> Kembali
            </button>
            <button
              class="btn btn-primary"
              :disabled="bookingStore.isSubmitting"
              @click="nextStep"
            >
              <span v-if="bookingStore.isSubmitting">
                <i class="fa-solid fa-spinner fa-spin"></i> Menyimpan ke Supabase...
              </span>
              <span v-else-if="bookingStore.currentStep === 3">
                <i class="fa-solid fa-check"></i> Konfirmasi & Selesaikan
              </span>
              <span v-else>
                Lanjutkan <i class="fa-solid fa-arrow-right"></i>
              </span>
            </button>
          </div>
        </div>

        <!-- Right Side Persistent Order Summary Panel -->
        <div class="order-summary-card">
          <h4>Rincian Pembayaran</h4>
          <div class="summary-details-list">
            <div class="summary-detail-item">
              <span class="label">Paket Terpilih</span>
              <span class="val">{{ bookingStore.packageName }}</span>
            </div>
            <div class="summary-detail-item">
              <span class="label">Harga Satuan</span>
              <span class="val">{{ bookingStore.formatCurrency(bookingStore.packagePrice) }}</span>
            </div>
            <div class="summary-detail-item">
              <span class="label">Jumlah Wisatawan</span>
              <span class="val">{{ bookingStore.guests }} Orang</span>
            </div>
            <div class="summary-detail-item">
              <span class="label">Subtotal Paket</span>
              <span class="val">{{ bookingStore.formatCurrency(bookingStore.subtotal) }}</span>
            </div>

            <div class="summary-divider"></div>

            <div v-if="bookingStore.guideAddon" class="summary-detail-item">
              <span class="label">Jasa Pemandu</span>
              <span class="val">{{ bookingStore.formatCurrency(bookingStore.guideAddonPrice) }}</span>
            </div>

            <div v-if="bookingStore.photoAddon" class="summary-detail-item">
              <span class="label">Dokumentasi Video</span>
              <span class="val">{{ bookingStore.formatCurrency(bookingStore.photoAddonPrice) }}</span>
            </div>
          </div>

          <div class="summary-divider"></div>
          <div class="summary-total">
            <span class="label">Total Estimasi</span>
            <span class="val">{{ bookingStore.formatCurrency(bookingStore.total) }}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--color-text-light); text-align:center; margin-top: 1rem; font-weight:600;">
            *Tersimpan langsung ke Supabase PostgreSQL & diverifikasi oleh pengelola.
          </div>
        </div>
      </div>

      <!-- SUCCESS SCREEN (STEP 4) -->
      <div v-else class="booking-success-wrapper">
        <div class="success-icon-box">
          <i class="fa-solid fa-check"></i>
        </div>
        <h2>Pemesanan Berhasil!</h2>
        <p>Terima kasih atas kepercayaan Anda. Reservasi Anda telah tersimpan secara aman di database dan sedang menunggu konfirmasi admin.</p>

        <div class="booking-code-card">
          <span class="code-label">Kode Booking</span>
          <span class="code-val">{{ bookingStore.lastBookingCode }}</span>
        </div>

        <div class="booking-success-info">
          <i class="fa-solid fa-circle-exclamation"></i>
          <strong>Informasi Langkah Selanjutnya:</strong><br>
          Pengelola desa wisata akan menghubungi Anda secara langsung melalui WhatsApp atau Email dalam kurun waktu maks. 24 jam untuk verifikasi kedatangan dan mengirimkan panduan perjalanan.
        </div>

        <div class="booking-success-actions">
          <router-link to="/" class="btn btn-primary" @click="bookingStore.resetForm">
            <i class="fa-solid fa-house"></i> Kembali Ke Beranda
          </router-link>
          <router-link to="/#artikel" class="btn btn-secondary">
            <i class="fa-solid fa-book"></i> Baca Panduan Wisata
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookingStore } from '@/stores/bookingStore'

const bookingStore = useBookingStore()

const stepLabels = ['Layanan', 'Data Pemesan', 'Konfirmasi', 'Selesai']
const errors = ref({})

const progressPercentage = computed(() => {
  return ((bookingStore.currentStep - 1) / 3) * 100
})

const getPackageSubtitle = (key) => {
  const subtitles = {
    surf: 'Homestay, papan selancar, pelatih profesional & antar jemput spot',
    beach: 'Vila tepi pantai, pemandu lokal, sewa motor & dokumentasi',
    sunset: 'Kuliner seafood tepi pantai, keliling desa adat & tenun Tapis',
    family: 'Tour Pulau Pisang, Batu Ghuri, Goa Liang & BBQ Ikan Bakar'
  }
  return subtitles[key] || ''
}

const validateStep2 = () => {
  errors.value = {}
  if (!bookingStore.name.trim()) {
    errors.value.name = 'Nama lengkap wajib diisi'
  }
  if (!bookingStore.phone.trim() || bookingStore.phone.length < 9) {
    errors.value.phone = 'Nomor WhatsApp valid wajib diisi'
  }
  if (!bookingStore.email.trim() || !bookingStore.email.includes('@')) {
    errors.value.email = 'Alamat email valid wajib diisi'
  }
  if (!bookingStore.date) {
    errors.value.date = 'Pilih tanggal rencana kunjungan'
  }
  return Object.keys(errors.value).length === 0
}

const nextStep = async () => {
  if (bookingStore.currentStep === 1) {
    bookingStore.currentStep = 2
    window.scrollTo({ top: 100, behavior: 'smooth' })
  } else if (bookingStore.currentStep === 2) {
    if (validateStep2()) {
      bookingStore.currentStep = 3
      window.scrollTo({ top: 100, behavior: 'smooth' })
    }
  } else if (bookingStore.currentStep === 3) {
    await bookingStore.submitBooking()
    window.scrollTo({ top: 100, behavior: 'smooth' })
  }
}

const prevStep = () => {
  if (bookingStore.currentStep > 1) {
    bookingStore.currentStep -= 1
    window.scrollTo({ top: 100, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.is-invalid {
  border-color: #ef4444 !important;
}
.form-error-msg {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
}
</style>
