<template>
  <section class="section-padding" id="pemandu">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-primary">Pemandu Lokal Berlisensi</span>
        <h2>Jelajahi Bersama Pemandu Lokal</h2>
        <p>Rasakan petualangan otentik dipandu oleh pemandu lokal berlisensi yang mengenal seluk beluk seluruh penjuru Pesisir Barat luar dalam.</p>
      </div>

      <div class="guides-grid">
        <div v-for="guide in dataStore.guides" :key="guide.id" class="guide-card">
          <div class="guide-avatar-box">
            <div class="guide-avatar-ring"></div>
            <img v-if="guide.avatar_url" :src="guide.avatar_url" :alt="guide.name" class="guide-avatar-img" />
            <div v-else class="guide-avatar guide-avatar-icon">
              <i class="fa-solid fa-user"></i>
            </div>
            <span class="guide-status" :title="guide.is_available ? 'Tersedia' : 'Sibuk'"></span>
          </div>

          <h3 class="guide-name">{{ guide.name }}</h3>
          <span class="badge badge-primary guide-badge">{{ guide.specialty }}</span>

          <div class="rating-stars guide-rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <span style="color:var(--color-text-light); font-size:0.8rem; font-weight:600; margin-left:4px;">
              ({{ guide.review_count || 48 }} Ulasan)
            </span>
          </div>

          <div class="guide-info-list">
            <div class="guide-info-item">
              <span class="info-label">Pengalaman</span>
              <span class="info-value">{{ guide.experience_years || 5 }} Tahun</span>
            </div>
            <div class="guide-info-item">
              <span class="info-label">Bahasa</span>
              <span class="info-value">{{ guide.languages || 'ID, EN' }}</span>
            </div>
          </div>

          <div class="guide-price-section">
            <span class="guide-price-label">Tarif Jasa</span>
            <div class="guide-price">{{ formatPrice(guide.price) }} <span>{{ guide.price_unit || '/ hari' }}</span></div>
          </div>

          <button class="btn btn-secondary btn-block book-guide-trigger" @click="bookGuide(guide)">
            Pesan Pemandu
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/dataStore'
import { useBookingStore } from '@/stores/bookingStore'

const router = useRouter()
const dataStore = useDataStore()
const bookingStore = useBookingStore()

const formatPrice = (p) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(p || 250000)
}

const bookGuide = (guide) => {
  bookingStore.guideAddon = true
  bookingStore.notes = `Meminta pemandu: ${guide.name}`
  router.push('/booking')
}
</script>

<style scoped>
.guide-avatar-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-white);
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  z-index: 2;
}
</style>
