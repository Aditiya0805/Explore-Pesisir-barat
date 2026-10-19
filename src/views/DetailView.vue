<template>
  <div class="detail-view-container section-padding">
    <div class="container">
      <router-link to="/" class="detail-back-btn">
        <i class="fa-solid fa-arrow-left"></i> {{ langStore.t('detail.backHome') }}
      </router-link>

      <div v-if="destination" class="detail-content-wrapper">
        <div class="detail-header">
          <div class="detail-title-row">
            <h1>{{ destination.name }}</h1>
            <div class="detail-price-tag">
              <span class="label">{{ langStore.t('detail.ticketPrice') }}</span>
              <div class="price">
                {{ langStore.formatCurrency(destination.price) }}
                <span v-if="destination.price">{{ langStore.t('detail.perPerson') }}</span>
              </div>
            </div>
          </div>
          <div class="detail-meta">
            <div class="detail-meta-item">
              <i class="fa-solid fa-location-dot"></i> <span>{{ destination.location }}</span>
            </div>
            <div class="detail-meta-item">
              <i class="fa-solid fa-star" style="color:var(--color-sunset-orange);"></i>
              <span>{{ getLocalizedRating(destination) }}</span>
            </div>
            <div class="detail-meta-item">
              <i class="fa-solid fa-clock"></i> <span>{{ getLocalizedHours(destination) }}</span>
            </div>
          </div>
        </div>

        <div class="detail-hero-img-box">
          <img :src="activeImage || destination.cover_img || destination.coverImg" :alt="destination.name" id="detailHeroImg">
        </div>

        <div class="detail-layout">
          <!-- Left Main Column -->
          <div class="detail-main">
            <h3>{{ langStore.t('detail.overview') }}</h3>
            <p>{{ destination.long_description || destination.longDescription || destination.description }}</p>

            <h3>{{ langStore.t('detail.facilities') }}</h3>
            <div class="detail-amenities-grid">
              <div
                v-for="(facility, idx) in (destination.facilities || defaultFacilities)"
                :key="idx"
                class="detail-amenity-card"
              >
                <i class="fa-solid fa-circle-check" style="color:var(--color-turquoise);"></i>
                {{ facility }}
              </div>
            </div>

            <div v-if="destination.thumbs?.length" class="detail-gallery-section">
              <h3>{{ langStore.t('detail.gallery') }}</h3>
              <div class="detail-gallery-grid">
                <img
                  v-for="(thumb, index) in destination.thumbs"
                  :key="index"
                  :src="thumb"
                  :alt="destination.name"
                  class="detail-thumb-img"
                  :class="{ active: activeImage === thumb }"
                  @click="activeImage = thumb"
                >
              </div>
            </div>

            <h3>{{ langStore.t('detail.mapLocation') }}</h3>
            <div class="detail-map-mock">
              <iframe
                :src="mapEmbedUrl"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Destinasi"
              ></iframe>
            </div>
          </div>

          <!-- Right Sidebar Panel -->
          <div class="detail-sidebar">
            <div class="detail-sidebar-card">
              <h4>{{ langStore.t('detail.visitorInfo') }}</h4>
              <div class="sidebar-info-row">
                <span class="label">{{ langStore.t('detail.category') }}</span>
                <span class="val">{{ destination.category || (langStore.isEn ? 'Beach / Surfing Leisure' : 'Wisata Pantai / Surfing') }}</span>
              </div>
              <div class="sidebar-info-row">
                <span class="label">{{ langStore.t('detail.roadAccess') }}</span>
                <span class="val">{{ langStore.t('detail.roadAccessVal') }}</span>
              </div>
              <div class="sidebar-info-row">
                <span class="label">{{ langStore.t('detail.cleanliness') }}</span>
                <span class="val"><i class="fa-solid fa-circle-check" style="color:var(--color-success);"></i> {{ langStore.t('detail.cleanlinessVal') }}</span>
              </div>
              <div style="margin-top: 1.5rem;">
                <router-link to="/booking" class="btn btn-primary btn-block">
                  <i class="fa-solid fa-ticket"></i> {{ langStore.t('detail.bookNowBtn') }}
                </router-link>
              </div>
            </div>

            <!-- Live weather & wave conditions -->
            <WeatherWidget
              :lat="destination.lat"
              :lng="destination.lng"
              :destination-name="destination.name"
            />
          </div>
        </div>

        <!-- Reviews & Ratings -->
        <div class="reviews-section">
          <div class="reviews-header">
            <h3>{{ langStore.t('reviews.title') }}</h3>
            <p>{{ langStore.t('reviews.subtitle') }}</p>
          </div>

          <div class="reviews-overview">
            <div class="reviews-score-box">
              <span class="reviews-score">{{ reviewStore.averageRating || '—' }}</span>
              <div class="reviews-score-stars">
                <i
                  v-for="n in 5"
                  :key="n"
                  class="fa-solid fa-star"
                  :class="{ 'is-on': n <= Math.round(reviewStore.averageRating) }"
                ></i>
              </div>
              <span class="reviews-score-count">
                {{ reviewStore.reviewCount }} {{ langStore.t('reviews.count') }}
              </span>
            </div>
            <div class="reviews-bars">
              <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="reviews-bar-row">
                <span class="reviews-bar-label">{{ star }} <i class="fa-solid fa-star"></i></span>
                <div class="reviews-bar-track">
                  <div class="reviews-bar-fill" :style="{ width: barPercent(star) + '%' }"></div>
                </div>
                <span class="reviews-bar-count">{{ reviewStore.distribution[star] || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="reviews-layout">
            <div class="reviews-list">
              <div v-for="review in reviewStore.reviews" :key="review.id" class="review-card">
                <div class="review-avatar">{{ initials(review.name) }}</div>
                <div class="review-body">
                  <div class="review-top">
                    <span class="review-name">{{ review.name }}</span>
                    <span class="review-date">{{ formatReviewDate(review.created_at) }}</span>
                  </div>
                  <div class="review-stars">
                    <i
                      v-for="n in 5"
                      :key="n"
                      class="fa-solid fa-star"
                      :class="{ 'is-on': n <= review.rating }"
                    ></i>
                  </div>
                  <p class="review-comment">{{ review.comment }}</p>
                </div>
              </div>
              <div v-if="!reviewStore.reviews.length" class="reviews-empty">
                <i class="fa-regular fa-comment-dots"></i>
                <p>{{ langStore.t('reviews.empty') }}</p>
              </div>
            </div>

            <form class="review-form" @submit.prevent="submitReview">
              <h4>{{ langStore.t('reviews.formTitle') }}</h4>
              <div class="form-group">
                <label>{{ langStore.t('reviews.yourName') }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="reviewForm.name"
                  maxlength="60"
                  :placeholder="langStore.t('reviews.namePlaceholder')"
                >
              </div>
              <div class="form-group">
                <label>{{ langStore.t('reviews.yourRating') }}</label>
                <div class="review-star-input">
                  <button
                    v-for="n in 5"
                    :key="n"
                    type="button"
                    class="review-star-btn"
                    :class="{ 'is-on': n <= (hoverRating || reviewForm.rating) }"
                    @mouseenter="hoverRating = n"
                    @mouseleave="hoverRating = 0"
                    @click="reviewForm.rating = n"
                  >
                    <i class="fa-solid fa-star"></i>
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label>{{ langStore.t('reviews.yourReview') }}</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="reviewForm.comment"
                  maxlength="400"
                  :placeholder="langStore.t('reviews.reviewPlaceholder')"
                ></textarea>
              </div>
              <button
                type="submit"
                class="btn btn-primary btn-block"
                :disabled="!canSubmitReview || reviewStore.submitting"
              >
                <i class="fa-solid fa-paper-plane"></i> {{ langStore.t('reviews.submit') }}
              </button>
              <p v-if="reviewSubmitted" class="review-success">
                <i class="fa-solid fa-circle-check"></i> {{ langStore.t('reviews.thanks') }}
              </p>
            </form>
          </div>
        </div>

        <!-- Related Package Grid -->
        <div class="detail-related-section">
          <h3 style="font-family:var(--font-secondary); font-size:1.8rem; color:var(--color-deep-navy); margin-bottom:1.5rem; text-align:center;">
            {{ langStore.t('detail.recommendedPackages') }}
          </h3>
          <div class="packages-grid">
            <div v-for="pkg in relatedPackages" :key="pkg.id" class="package-card">
              <div class="package-img-container">
                <img :src="pkg.cover_img || pkg.coverImg" :alt="getPkgName(pkg)" class="package-img" loading="lazy">
              </div>
              <div class="package-content">
                <h3 class="package-title">{{ getPkgName(pkg) }}</h3>
                <div class="package-price-box">
                  <span class="price-label">{{ langStore.t('packages.specialPrice') }}</span>
                  <div class="price">
                    {{ langStore.formatCurrency(pkg.price) }}
                    <span>/ {{ pkg.id === 'family' ? (langStore.isEn ? 'group' : 'pack') : 'pax' }}</span>
                  </div>
                </div>
                <button class="btn btn-secondary btn-block" @click="bookPackage(pkg.id)">
                  {{ langStore.t('packages.bookNow') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="detail-not-found" style="text-align:center; padding: 4rem 1rem;">
        <h2>{{ langStore.t('detail.notFoundTitle') }}</h2>
        <p>{{ langStore.t('detail.notFoundDesc') }}</p>
        <router-link to="/" class="btn btn-primary" style="margin-top:1rem;">
          {{ langStore.t('detail.backHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/stores/dataStore'
import { useBookingStore } from '@/stores/bookingStore'
import { useLangStore } from '@/stores/langStore'
import { useReviewStore } from '@/stores/reviewStore'
import WeatherWidget from '@/components/common/WeatherWidget.vue'

const route = useRoute()
const router = useRouter()
const dataStore = useDataStore()
const bookingStore = useBookingStore()
const langStore = useLangStore()
const reviewStore = useReviewStore()

const activeImage = ref(null)

// ---------------------------------------------------------------------------
// Reviews & ratings
// ---------------------------------------------------------------------------
const reviewForm = ref({ name: '', rating: 5, comment: '' })
const hoverRating = ref(0)
const reviewSubmitted = ref(false)

const canSubmitReview = computed(() => {
  return reviewForm.value.name.trim().length >= 2 && reviewForm.value.comment.trim().length >= 3
})

const barPercent = (star) => {
  const total = reviewStore.reviewCount
  if (!total) return 0
  const count = reviewStore.distribution[star] || 0
  return Math.round((count / total) * 100)
}

const initials = (name) => {
  const clean = String(name || '?').trim()
  const parts = clean.split(/\s+/)
  const first = parts[0]?.[0] || '?'
  const second = parts[1]?.[0] || ''
  return (first + second).toUpperCase()
}

const formatReviewDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(langStore.isEn ? 'en-US' : 'id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const submitReview = async () => {
  if (!canSubmitReview.value || !rawDestination.value) return
  await reviewStore.addReview({
    destinationId: rawDestination.value.id,
    name: reviewForm.value.name,
    rating: reviewForm.value.rating,
    comment: reviewForm.value.comment
  })
  reviewForm.value = { name: '', rating: 5, comment: '' }
  hoverRating.value = 0
  reviewSubmitted.value = true
  setTimeout(() => { reviewSubmitted.value = false }, 4000)
}

const defaultFacilities = computed(() => [
  langStore.isEn ? 'Spacious & Secure Parking' : 'Parkir Luas & Aman',
  langStore.isEn ? 'Clean Restrooms & Showers' : 'Toilet & Shower Bersih',
  langStore.isEn ? 'Scenic Relaxing Gazebos' : 'Gazebo Santai',
  langStore.isEn ? 'Fresh Local Seafood Shacks' : 'Warung Kuliner Seafood'
])

const rawDestination = computed(() => {
  const id = Number(route.params.id)
  return dataStore.getDestinationById(id)
})

const destination = computed(() => {
  return langStore.getLocalizedDestination(rawDestination.value)
})

const getLocalizedRating = (dest) => {
  if (!dest?.rating) return langStore.isEn ? '4.9 / 5.0 (Traveler Rating)' : '4.9 / 5.0 (Rating Wisatawan)'
  if (langStore.isEn && dest.rating.includes('Rating')) {
    return dest.rating.replace('Rating Peselancar', 'Surfer Rating').replace('Rating Wisatawan', 'Traveler Rating').replace('Sangat Asri', 'Very Scenic')
  }
  return dest.rating
}

const getLocalizedHours = (dest) => {
  if (!dest?.hours || dest.hours === 'Buka 24 Jam') {
    return langStore.isEn ? 'Open 24 Hours' : 'Buka 24 Jam'
  }
  if (langStore.isEn && dest.hours.includes('Buka Setiap Hari')) {
    return 'Open Daily (Boats 07:00 - 15:00)'
  }
  return dest.hours
}

const getPkgName = (pkg) => {
  return langStore.getPackageInfo(pkg.id)?.name || pkg.name
}

const mapEmbedUrl = computed(() => {
  if (!destination.value) return 'https://maps.google.com/maps?q=-5.313426,103.998218&hl=id&z=14&output=embed'
  return `https://maps.google.com/maps?q=${destination.value.lat},${destination.value.lng}&hl=${langStore.currentLang}&z=14&output=embed`
})

const relatedPackages = computed(() => {
  return dataStore.packages.slice(0, 3)
})

const bookPackage = (pkgId) => {
  bookingStore.setPackage(pkgId)
  router.push('/booking')
}

watch(
  () => destination.value,
  (newVal) => {
    if (newVal) {
      activeImage.value = newVal.cover_img || newVal.coverImg
    }
    if (rawDestination.value) {
      reviewStore.fetchReviews(rawDestination.value.id)
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.detail-thumb-img {
  width: 100%;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}
.detail-thumb-img:hover,
.detail-thumb-img.active {
  border-color: var(--color-turquoise);
  transform: scale(1.02);
}
</style>
