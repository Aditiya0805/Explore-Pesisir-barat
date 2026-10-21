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
            <h3>{{ langStore.t('booking.step1Title') }}</h3>
            <div class="service-cards-selector">
              <div
                v-for="(pkg, key) in bookingStore.packageOptions"
                :key="key"
                class="service-select-card"
                :class="{ selected: bookingStore.packageId === key }"
                @click="selectPackage(key)"
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
                    {{ getPackageName(key, pkg) }}
                    <span v-if="key === 'surf'" class="badge badge-accent" style="margin-left: 5px;">
                      {{ langStore.t('booking.bestseller') }}
                    </span>
                  </h5>
                  <p>{{ getPackageSubtitle(key) }}</p>
                </div>
                <div class="service-select-card-price">
                  {{ langStore.formatCurrency(pkg.price) }}
                  <span style="font-size:0.75rem; font-weight:500; color:var(--color-text-light);">/ pax</span>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 2rem;">{{ langStore.t('booking.addonsTitle') }}</h3>
            <div class="form-grid">
              <div class="form-group-full">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="bookingStore.guideAddon">
                  <span>{{ langStore.t('booking.guideAddonLabel') }} (+ {{ langStore.formatCurrency(bookingStore.guideAddonPrice) }}/{{ langStore.isEn ? 'day' : 'hari' }})</span>
                </label>
              </div>
              <div class="form-group-full">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="bookingStore.photoAddon">
                  <span>{{ langStore.t('booking.photoAddonLabel') }} (+ {{ langStore.formatCurrency(bookingStore.photoAddonPrice) }})</span>
                </label>
              </div>
            </div>
          </div>

          <!-- STEP 2: DATA PEMESAN -->
          <div v-if="bookingStore.currentStep === 2" class="booking-step-view">
            <h3>{{ langStore.t('booking.step2Title') }}</h3>
            <div class="form-grid">
              <div class="form-group form-group-full">
                <label for="book-name">{{ langStore.t('booking.fullName') }} <span class="required">*</span></label>
                <input
                  type="text"
                  id="book-name"
                  class="form-control"
                  v-model="bookingStore.name"
                  :placeholder="langStore.t('booking.fullNamePlaceholder')"
                  :class="{ 'is-invalid': errors.name }"
                >
                <span v-if="errors.name" class="form-error-msg">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label for="book-phone">{{ langStore.t('booking.wa') }} <span class="required">*</span></label>
                <input
                  type="tel"
                  id="book-phone"
                  class="form-control"
                  v-model="bookingStore.phone"
                  :placeholder="langStore.t('booking.waPlaceholder')"
                  :class="{ 'is-invalid': errors.phone }"
                >
                <span v-if="errors.phone" class="form-error-msg">{{ errors.phone }}</span>
              </div>
              <div class="form-group">
                <label for="book-email">{{ langStore.t('booking.emailLabel') }} <span class="required">*</span></label>
                <input
                  type="email"
                  id="book-email"
                  class="form-control"
                  v-model="bookingStore.email"
                  :placeholder="langStore.t('booking.emailPlaceholder')"
                  :class="{ 'is-invalid': errors.email }"
                >
                <span v-if="errors.email" class="form-error-msg">{{ errors.email }}</span>
              </div>
              <div class="form-group">
                <label for="book-date">{{ langStore.t('booking.visitDate') }} <span class="required">*</span></label>
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
                <label for="book-guests">{{ langStore.t('booking.guestCount') }} <span class="required">*</span></label>
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
                <label for="book-notes">{{ langStore.t('booking.notes') }}</label>
                <textarea
                  id="book-notes"
                  class="form-control"
                  v-model="bookingStore.notes"
                  :placeholder="langStore.t('booking.notesPlaceholder')"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- STEP 3: KONFIRMASI -->
          <div v-if="bookingStore.currentStep === 3" class="booking-step-view">
            <h3>{{ langStore.t('booking.step3Title') }}</h3>
            <p style="font-size:0.95rem; color:var(--color-text-medium); margin-bottom: 1.5rem;">
              {{ langStore.t('booking.step3Subtitle') }}
            </p>

            <div class="confirm-review-box">
              <div class="confirm-review-title">
                <i class="fa-solid fa-suitcase"></i> {{ langStore.t('booking.boxMainPackage') }}
              </div>
              <div class="confirm-grid">
                <div class="confirm-item">
                  <span class="label">{{ langStore.isEn ? 'Tour Package:' : 'Paket Wisata:' }} </span>
                  <span class="val">{{ currentPackageName }}</span>
                </div>
                <div class="confirm-item">
                  <span class="label">{{ langStore.isEn ? 'Package Rate:' : 'Tarif Utama:' }} </span>
                  <span class="val">{{ langStore.formatCurrency(bookingStore.packagePrice) }} / pax</span>
                </div>
              </div>
            </div>

            <div class="confirm-review-box">
              <div class="confirm-review-title">
                <i class="fa-solid fa-circle-info"></i> {{ langStore.t('booking.boxAddons') }}
              </div>
              <div style="font-size:0.875rem; color:var(--color-text-dark); font-weight:600;">
                <span v-if="!bookingStore.guideAddon && !bookingStore.photoAddon">
                  {{ langStore.t('booking.noAddons') }}
                </span>
                <ul v-else style="padding-left: 1.25rem;">
                  <li v-if="bookingStore.guideAddon">
                    {{ langStore.t('booking.guideAddonLabel') }} (+ {{ langStore.formatCurrency(bookingStore.guideAddonPrice) }})
                  </li>
                  <li v-if="bookingStore.photoAddon">
                    {{ langStore.t('booking.photoAddonLabel') }} (+ {{ langStore.formatCurrency(bookingStore.photoAddonPrice) }})
                  </li>
                </ul>
              </div>
            </div>

            <div class="confirm-review-box">
              <div class="confirm-review-title">
                <i class="fa-solid fa-user-tag"></i> {{ langStore.t('booking.boxPersonal') }}
              </div>
              <div class="confirm-grid">
                <div class="confirm-item">
                  <span class="label">{{ langStore.t('booking.name') }} </span>
                  <span class="val">{{ bookingStore.name }}</span>
                </div>
                <div class="confirm-item">
                  <span class="label">{{ langStore.t('booking.phone') }} </span>
                  <span class="val">{{ bookingStore.phone }}</span>
                </div>
                <div class="confirm-item">
                  <span class="label">{{ langStore.t('booking.emailLabel') }} </span>
                  <span class="val">{{ bookingStore.email }}</span>
                </div>
                <div class="confirm-item">
                  <span class="label">{{ langStore.t('booking.dateLabel') }} </span>
                  <span class="val">{{ bookingStore.date || (langStore.isEn ? 'Not set' : 'Belum ditentukan') }}</span>
                </div>
                <div class="confirm-item">
                  <span class="label">{{ langStore.t('booking.guestsLabel') }} </span>
                  <span class="val">{{ bookingStore.guests }} {{ langStore.t('booking.personCount') }}</span>
                </div>
              </div>
            </div>

            <div class="confirm-review-box">
              <div class="confirm-review-title">
                <i class="fa-solid fa-note-sticky"></i> {{ langStore.t('booking.boxNotes') }}
              </div>
              <p style="font-size:0.875rem; font-weight:600; color:var(--color-text-dark); font-style:italic;">
                {{ bookingStore.notes || langStore.t('booking.noNotes') }}
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
              <i class="fa-solid fa-arrow-left"></i> {{ langStore.t('booking.backBtn') }}
            </button>
            <button
              class="btn btn-primary"
              :disabled="bookingStore.isSubmitting"
              @click="nextStep"
            >
              <span v-if="bookingStore.isSubmitting">
                <i class="fa-solid fa-spinner fa-spin"></i> {{ langStore.t('booking.submitting') }}
              </span>
              <span v-else-if="bookingStore.currentStep === 3">
                <i class="fa-solid fa-check"></i> {{ langStore.t('booking.confirmBtn') }}
              </span>
              <span v-else>
                {{ langStore.t('booking.nextBtn') }} <i class="fa-solid fa-arrow-right"></i>
              </span>
            </button>
          </div>
        </div>

        <!-- Right Side Persistent Order Summary Panel -->
        <div class="order-summary-card">
          <h4>{{ langStore.t('booking.orderSummary') }}</h4>
          <div class="summary-details-list">
            <div class="summary-detail-item">
              <span class="label">{{ langStore.t('booking.selectedPackage') }}</span>
              <span class="val">{{ currentPackageName }}</span>
            </div>
            <div class="summary-detail-item">
              <span class="label">{{ langStore.t('booking.unitPrice') }}</span>
              <span class="val">{{ langStore.formatCurrency(bookingStore.packagePrice) }}</span>
            </div>
            <div class="summary-detail-item">
              <span class="label">{{ langStore.t('booking.numGuests') }}</span>
              <span class="val">{{ bookingStore.guests }} {{ langStore.t('booking.personCount') }}</span>
            </div>
            <div class="summary-detail-item">
              <span class="label">{{ langStore.t('booking.subtotalPackage') }}</span>
              <span class="val">{{ langStore.formatCurrency(bookingStore.subtotal) }}</span>
            </div>

            <div class="summary-divider"></div>

            <div v-if="bookingStore.guideAddon" class="summary-detail-item">
              <span class="label">{{ langStore.t('booking.guideService') }}</span>
              <span class="val">{{ langStore.formatCurrency(bookingStore.guideAddonPrice) }}</span>
            </div>

            <div v-if="bookingStore.photoAddon" class="summary-detail-item">
              <span class="label">{{ langStore.t('booking.droneVideo') }}</span>
              <span class="val">{{ langStore.formatCurrency(bookingStore.photoAddonPrice) }}</span>
            </div>
          </div>

          <div class="summary-divider"></div>
          <div class="summary-total">
            <span class="label">{{ langStore.t('booking.totalEstimate') }}</span>
            <span class="val">{{ langStore.formatCurrency(bookingStore.total) }}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--color-text-light); text-align:center; margin-top: 1rem; font-weight:600;">
            {{ langStore.t('booking.dbNote') }}
          </div>
        </div>
      </div>

      <!-- SUCCESS SCREEN (STEP 4) -->
      <div v-else class="booking-success-wrapper">
        <div class="success-icon-box">
          <i class="fa-solid fa-check"></i>
        </div>
        <h2>{{ langStore.t('booking.successTitle') }}</h2>
        <p>{{ langStore.t('booking.successDesc') }}</p>

        <div class="booking-code-card">
          <span class="code-label">{{ langStore.t('booking.codeLabel') }}</span>
          <span class="code-val">{{ bookingStore.lastBookingCode }}</span>
        </div>

        <div v-if="bookingStore.lastSyncWarning" class="booking-sync-warning">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>{{ bookingStore.lastSyncWarning }}</span>
        </div>

        <div class="booking-success-info">
          <i class="fa-solid fa-circle-exclamation"></i>
          <strong>{{ langStore.t('booking.nextStepTitle') }}</strong><br>
          {{ langStore.t('booking.nextStepDesc') }}
        </div>

        <div class="booking-proof-actions">
          <button type="button" class="btn btn-primary" @click="downloadPdf">
            <i class="fa-solid fa-file-arrow-down"></i> {{ langStore.t('booking.downloadPdf') }}
          </button>
          <a
            class="btn btn-whatsapp"
            :href="whatsappLink"
            target="_blank"
            rel="noopener"
          >
            <i class="fa-brands fa-whatsapp"></i> {{ langStore.t('booking.sendWhatsapp') }}
          </a>
        </div>

        <div class="booking-success-actions">
          <router-link to="/" class="btn btn-primary" @click="bookingStore.resetForm">
            <i class="fa-solid fa-house"></i> {{ langStore.t('booking.backHomeBtn') }}
          </router-link>
          <router-link to="/#artikel" class="btn btn-secondary">
            <i class="fa-solid fa-book"></i> {{ langStore.t('booking.readGuideBtn') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBookingStore } from '@/stores/bookingStore'
import { useLangStore } from '@/stores/langStore'
import { downloadBookingPdf, buildWhatsAppLink } from '@/lib/bookingProof'

const bookingStore = useBookingStore()
const langStore = useLangStore()

onMounted(() => {
  // Use the latest price/name from the `packages` table.
  bookingStore.syncPackagePrice()
})

// Complete booking record used for the PDF proof & WhatsApp share message.
const bookingRecord = computed(() => ({
  code: bookingStore.lastBookingCode,
  name: bookingStore.name,
  phone: bookingStore.phone,
  email: bookingStore.email,
  packageName: currentPackageName.value,
  visitDate: bookingStore.date,
  guests: bookingStore.guests,
  guideAddon: bookingStore.guideAddon,
  photoAddon: bookingStore.photoAddon,
  packagePrice: bookingStore.packagePrice,
  guideAddonPrice: bookingStore.guideAddonPrice,
  photoAddonPrice: bookingStore.photoAddonPrice,
  subtotal: bookingStore.subtotal,
  total: bookingStore.total,
  notes: bookingStore.notes
}))

const whatsappLink = computed(() => buildWhatsAppLink(bookingRecord.value, langStore.isEn))

const downloadPdf = async () => {
  try {
    await downloadBookingPdf(bookingRecord.value, langStore.isEn)
  } catch (err) {
    // Keep the experience smooth — never surface a hard error to the traveler.
    console.warn('PDF generation note:', err?.message || err)
  }
}

const stepLabels = computed(() => [
  langStore.t('booking.step1'),
  langStore.t('booking.step2'),
  langStore.t('booking.step3'),
  langStore.t('booking.step4')
])

const errors = ref({})

const progressPercentage = computed(() => {
  return ((bookingStore.currentStep - 1) / 3) * 100
})

const getPackageName = (key, pkg) => {
  const info = langStore.getPackageInfo(key)
  return info?.name || pkg.name
}

const currentPackageName = computed(() => {
  const info = langStore.getPackageInfo(bookingStore.packageId)
  return info?.name || bookingStore.packageName
})

const getPackageSubtitle = (key) => {
  const info = langStore.getPackageInfo(key)
  return info?.subtitle || ''
}

const selectPackage = (key) => {
  bookingStore.setPackage(key)
}

const validateStep2 = () => {
  errors.value = {}
  if (!bookingStore.name.trim()) {
    errors.value.name = langStore.t('booking.errName')
  }
  if (!bookingStore.phone.trim() || bookingStore.phone.length < 9) {
    errors.value.phone = langStore.t('booking.errPhone')
  }
  if (!bookingStore.email.trim() || !bookingStore.email.includes('@')) {
    errors.value.email = langStore.t('booking.errEmail')
  }
  if (!bookingStore.date) {
    errors.value.date = langStore.t('booking.errDate')
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
.booking-sync-warning {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  max-width: 560px;
  margin: 0 auto 1.25rem;
  padding: 0.7rem 0.9rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  border-radius: 10px;
  font-size: 0.8rem;
  line-height: 1.5;
  text-align: left;
}
</style>
