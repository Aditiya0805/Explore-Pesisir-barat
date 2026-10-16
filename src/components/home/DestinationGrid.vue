<template>
  <section class="section-padding" id="destinasi">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-primary">Destinasi Populer</span>
        <h2>Jelajahi Pesona Pesisir Barat</h2>
        <p>Pilihan destinasi terbaik dari spot surfing legendaris, pantai berpasir putih, hingga pesona kuliner bahari lokal.</p>
      </div>

      <div class="destinations-grid" id="destinationsGrid">
        <div v-for="item in dataStore.destinations" :key="item.id" class="dest-card">
          <div class="dest-img-container">
            <span class="badge badge-accent dest-badge">
              <i class="fa-solid fa-star"></i> {{ item.rating?.split(' ')[0] || '4.9' }}
            </span>
            <img :src="item.cover_img || item.coverImg" :alt="item.name" class="dest-img" loading="lazy">
          </div>
          <div class="dest-content">
            <div class="dest-meta">
              <div class="dest-location">
                <i class="fa-solid fa-location-dot"></i> {{ item.location }}
              </div>
            </div>
            <h3 class="dest-title">{{ item.name }}</h3>
            <p class="dest-desc">{{ item.description }}</p>
            <div class="dest-footer">
              <div>
                <span class="dest-price-label">Mulai dari</span>
                <div class="dest-price">
                  {{ formatPrice(item.price) }}
                  <span style="font-size:0.8rem; color:var(--color-text-light); font-weight:500;">/org</span>
                </div>
              </div>
              <router-link :to="'/detail/' + item.id" class="btn btn-secondary btn-sm">
                Lihat Detail
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDataStore } from '@/stores/dataStore'

const dataStore = useDataStore()

const formatPrice = (price) => {
  if (!price) return 'Gratis'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(price)
}
</script>
