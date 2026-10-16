<template>
  <div class="detail-view-container section-padding">
    <div class="container">
      <router-link to="/" class="detail-back-btn">
        <i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda
      </router-link>

      <div v-if="destination" class="detail-content-wrapper">
        <div class="detail-header">
          <div class="detail-title-row">
            <h1>{{ destination.name }}</h1>
            <div class="detail-price-tag">
              <span class="label">Harga Tiket Masuk</span>
              <div class="price">{{ formatPrice(destination.price) }} <span>/ org</span></div>
            </div>
          </div>
          <div class="detail-meta">
            <div class="detail-meta-item">
              <i class="fa-solid fa-location-dot"></i> <span>{{ destination.location }}</span>
            </div>
            <div class="detail-meta-item">
              <i class="fa-solid fa-star" style="color:var(--color-sunset-orange);"></i>
              <span>{{ destination.rating || '4.9 / 5.0 (Rating Wisatawan)' }}</span>
            </div>
            <div class="detail-meta-item">
              <i class="fa-solid fa-clock"></i> <span>{{ destination.hours || 'Buka 24 Jam' }}</span>
            </div>
          </div>
        </div>

        <div class="detail-hero-img-box">
          <img :src="activeImage || destination.cover_img || destination.coverImg" :alt="destination.name" id="detailHeroImg">
        </div>

        <div class="detail-layout">
          <!-- Left Main Column -->
          <div class="detail-main">
            <h3>Deskripsi Destinasi</h3>
            <p>{{ destination.long_description || destination.longDescription || destination.description }}</p>

            <h3>Fasilitas Pendukung</h3>
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
              <h3>Galeri Foto</h3>
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

            <h3>Lokasi Peta Wisata</h3>
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
              <h4>Informasi Tiket</h4>
              <div class="sidebar-info-row">
                <span class="label">Kategori Destinasi</span>
                <span class="val">{{ destination.category || 'Wisata Pantai / Surfing' }}</span>
              </div>
              <div class="sidebar-info-row">
                <span class="label">Aksesibilitas Jalan</span>
                <span class="val">Mudah (Aspal Mulus)</span>
              </div>
              <div class="sidebar-info-row">
                <span class="label">Kebersihan</span>
                <span class="val"><i class="fa-solid fa-circle-check" style="color:var(--color-success);"></i> Terawat</span>
              </div>
              <div style="margin-top: 1.5rem;">
                <router-link to="/booking" class="btn btn-primary btn-block">
                  <i class="fa-solid fa-ticket"></i> Pesan Layanan Sekarang
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Package Grid -->
        <div class="detail-related-section">
          <h3 style="font-family:var(--font-secondary); font-size:1.8rem; color:var(--color-deep-navy); margin-bottom:1.5rem; text-align:center;">
            Paket Terkait Yang Direkomendasikan
          </h3>
          <div class="packages-grid">
            <div v-for="pkg in relatedPackages" :key="pkg.id" class="package-card">
              <div class="package-img-container">
                <img :src="pkg.cover_img || pkg.coverImg" :alt="pkg.name" class="package-img" loading="lazy">
              </div>
              <div class="package-content">
                <h3 class="package-title">{{ pkg.name }}</h3>
                <div class="package-price-box">
                  <span class="price-label">Harga Mulai</span>
                  <div class="price">{{ formatPrice(pkg.price) }} <span>/ pax</span></div>
                </div>
                <button class="btn btn-secondary btn-block" @click="bookPackage(pkg.id)">
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="detail-not-found" style="text-align:center; padding: 4rem 1rem;">
        <h2>Destinasi Tidak Ditemukan</h2>
        <p>Destinasi yang Anda cari tidak tersedia atau sedang diperbarui.</p>
        <router-link to="/" class="btn btn-primary" style="margin-top:1rem;">
          Kembali ke Beranda
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

const route = useRoute()
const router = useRouter()
const dataStore = useDataStore()
const bookingStore = useBookingStore()

const activeImage = ref(null)
const defaultFacilities = [
  'Parkir Luas & Aman',
  'Toilet & Shower Bersih',
  'Gazebo Santai',
  'Warung Kuliner Seafood'
]

const destination = computed(() => {
  const id = Number(route.params.id)
  return dataStore.getDestinationById(id)
})

const mapEmbedUrl = computed(() => {
  if (!destination.value) return 'https://maps.google.com/maps?q=-5.313426,103.998218&hl=id&z=14&output=embed'
  return `https://maps.google.com/maps?q=${destination.value.lat},${destination.value.lng}&hl=id&z=14&output=embed`
})

const relatedPackages = computed(() => {
  return dataStore.packages.slice(0, 3)
})

const formatPrice = (p) => {
  if (!p) return 'Gratis'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(p)
}

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
