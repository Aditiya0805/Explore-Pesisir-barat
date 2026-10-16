<template>
  <section class="section-padding" id="galeri">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-primary">Sudut Visual</span>
        <h2>Galeri Keindahan Alam</h2>
        <p>Intip sedikit pesona pantai, sunset, air terjun, dan keseruan aktivitas wisatawan di Pesisir Barat.</p>
      </div>

      <div class="gallery-filter">
        <button
          v-for="cat in filterCategories"
          :key="cat.value"
          class="gallery-filter-btn"
          :class="{ active: currentFilter === cat.value }"
          @click="currentFilter = cat.value"
        >
          {{ cat.label }}
        </button>
      </div>

      <div class="gallery-grid">
        <div
          v-for="item in filteredGallery"
          :key="item.id"
          class="gallery-item"
          :class="item.css_class || item.cssClass"
        >
          <img :src="item.img_url || item.imgUrl" :alt="item.title" loading="lazy">
          <div class="gallery-overlay">
            <span class="gallery-tag">{{ item.category }}</span>
            <h4 class="gallery-title">{{ item.title }}</h4>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentFilter = ref('all')

const filterCategories = [
  { label: 'Semua Foto', value: 'all' },
  { label: 'Pantai', value: 'pantai' },
  { label: 'Surfing', value: 'surfing' },
  { label: 'Sunset', value: 'sunset' },
  { label: 'Aktivitas', value: 'aktivitas' }
]

const galleryItems = [
  {
    id: 1,
    title: 'Menembus Ombak Ujung Bocur',
    category: 'Surfing',
    categoryKey: 'surfing',
    img_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
    css_class: 'tall'
  },
  {
    id: 2,
    title: 'Matahari Terbenam Keemasan di Pesisir Barat',
    category: 'Sunset',
    categoryKey: 'sunset',
    img_url: '/assets/images/paket-sunset.jpg',
    css_class: 'wide'
  },
  {
    id: 3,
    title: 'Pohon Kelapa Teduh Way Jambu',
    category: 'Pantai',
    categoryKey: 'pantai',
    img_url: '/assets/images/pantai-way-jambu.jpg',
    css_class: ''
  },
  {
    id: 4,
    title: 'Menyusuri Pasir Putih Bersama Pasangan',
    category: 'Aktivitas',
    categoryKey: 'aktivitas',
    img_url: '/assets/images/galeri-santai-pantai.jpg',
    css_class: ''
  },
  {
    id: 5,
    title: 'Perahu Nelayan Tradisional di Biha',
    category: 'Pantai',
    categoryKey: 'pantai',
    img_url: '/assets/images/pantai-biha.jpg',
    css_class: ''
  },
  {
    id: 6,
    title: 'Eksplorasi Keindahan Laut Bawah Air',
    category: 'Surfing',
    categoryKey: 'surfing',
    img_url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80',
    css_class: 'wide'
  }
]

const filteredGallery = computed(() => {
  if (currentFilter.value === 'all') return galleryItems
  return galleryItems.filter(item => item.categoryKey === currentFilter.value)
})
</script>
