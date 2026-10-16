<template>
  <section class="section-padding" id="paket" style="background-color: var(--color-white);">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-accent">Penawaran Spesial</span>
        <h2>Pilih Pengalaman Wisatamu</h2>
        <p>Berbagai pilihan paket wisata menarik yang dikurasi khusus untuk petualangan terbaik Anda.</p>
      </div>

      <div class="packages-grid" id="packagesGrid">
        <div
          v-for="pkg in dataStore.packages"
          :key="pkg.id"
          class="package-card"
          :class="{ popular: pkg.is_popular || pkg.isPopular }"
        >
          <span v-if="pkg.is_popular || pkg.isPopular" class="popular-ribbon">
            <i class="fa-solid fa-fire"></i> Paling Populer
          </span>

          <div class="package-img-container">
            <img :src="pkg.cover_img || pkg.coverImg" :alt="pkg.name" class="package-img" loading="lazy">
          </div>

          <div class="package-content">
            <h3 class="package-title">{{ pkg.name }}</h3>
            <div class="package-meta-row">
              <div class="package-meta-item"><i class="fa-solid fa-clock"></i> {{ pkg.duration }}</div>
              <div class="package-meta-item"><i class="fa-solid fa-user-group"></i> {{ pkg.min_persons || pkg.minPersons }}</div>
            </div>

            <ul class="package-amenities">
              <li v-for="(amenity, idx) in pkg.amenities" :key="idx">
                <i class="fa-solid fa-circle-check"></i> {{ amenity }}
              </li>
            </ul>

            <div class="package-price-box">
              <span class="price-label">Harga Spesial</span>
              <div class="price">
                {{ formatPrice(pkg.price) }}
                <span>/ {{ pkg.id === 'family' ? 'pack' : 'pax' }}</span>
              </div>
            </div>

            <button
              class="btn btn-block select-package-booking"
              :class="pkg.is_popular ? 'btn-primary' : 'btn-secondary'"
              @click="selectPackage(pkg.id)"
            >
              Pesan Sekarang
            </button>
          </div>
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(price)
}

const selectPackage = (pkgId) => {
  bookingStore.setPackage(pkgId)
  router.push('/booking')
}
</script>
