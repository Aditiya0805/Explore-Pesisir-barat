<template>
  <section class="section-padding" id="galeri">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-primary">{{ langStore.t('gallery.badge') }}</span>
        <h2>{{ langStore.t('gallery.title') }}</h2>
        <p>{{ langStore.t('gallery.subtitle') }}</p>
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
          <img :src="item.img_url || item.imgUrl" :alt="getItemTitle(item)" loading="lazy">
          <div class="gallery-overlay">
            <span class="gallery-tag">{{ getItemCategory(item) }}</span>
            <h4 class="gallery-title">{{ getItemTitle(item) }}</h4>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLangStore } from '@/stores/langStore'

const langStore = useLangStore()
const currentFilter = ref('all')

const filterCategories = computed(() => [
  { label: langStore.t('gallery.all'), value: 'all' },
  { label: langStore.t('gallery.beach'), value: 'pantai' },
  { label: langStore.t('gallery.surf'), value: 'surfing' },
  { label: langStore.t('gallery.sunset'), value: 'sunset' },
  { label: langStore.t('gallery.activities'), value: 'aktivitas' }
])

const galleryItems = [
  {
    id: 1,
    title: 'Menembus Ombak Ujung Bocur',
    titleEn: 'Carving Ujung Bocur Waves',
    category: 'Surfing',
    categoryEn: 'Surfing',
    categoryKey: 'surfing',
    img_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
    css_class: 'tall'
  },
  {
    id: 2,
    title: 'Matahari Terbenam Keemasan di Pesisir Barat',
    titleEn: 'Golden Sunset over Pesisir Barat Coast',
    category: 'Sunset',
    categoryEn: 'Sunset',
    categoryKey: 'sunset',
    img_url: '/assets/images/paket-sunset.jpg',
    css_class: 'wide'
  },
  {
    id: 3,
    title: 'Pohon Kelapa Teduh Way Jambu',
    titleEn: 'Shaded Palm Groves of Way Jambu',
    category: 'Pantai',
    categoryEn: 'Beach',
    categoryKey: 'pantai',
    img_url: '/assets/images/pantai-way-jambu.jpg',
    css_class: ''
  },
  {
    id: 4,
    title: 'Menyusuri Pasir Putih Bersama Pasangan',
    titleEn: 'Strolling Along White Sands',
    category: 'Aktivitas',
    categoryEn: 'Activities',
    categoryKey: 'aktivitas',
    img_url: '/assets/images/galeri-santai-pantai.jpg',
    css_class: ''
  },
  {
    id: 5,
    title: 'Perahu Nelayan Tradisional di Biha',
    titleEn: 'Traditional Jukung Fishing Boats in Biha',
    category: 'Pantai',
    categoryEn: 'Beach',
    categoryKey: 'pantai',
    img_url: '/assets/images/pantai-biha.jpg',
    css_class: ''
  },
  {
    id: 6,
    title: 'Eksplorasi Keindahan Laut Bawah Air',
    titleEn: 'Underwater Marine Life Exploration',
    category: 'Surfing',
    categoryEn: 'Surfing',
    categoryKey: 'surfing',
    img_url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80',
    css_class: 'wide'
  }
]

const getItemTitle = (item) => {
  return langStore.isEn && item.titleEn ? item.titleEn : item.title
}

const getItemCategory = (item) => {
  return langStore.isEn && item.categoryEn ? item.categoryEn : item.category
}

const filteredGallery = computed(() => {
  if (currentFilter.value === 'all') return galleryItems
  return galleryItems.filter(item => item.categoryKey === currentFilter.value)
})
</script>
