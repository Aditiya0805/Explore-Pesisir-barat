<template>
  <div v-if="visible" class="splash-screen" :class="{ 'fade-out': fading }">
    <div class="splash-content">
      <div class="splash-logo-container">
        <div class="splash-icon-pulse"></div>
        <div class="splash-icon-box">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 14.5c2.3 0 3.3-1.8 5.5-1.8s3.2 1.8 5.5 1.8 3.2-1.8 5.5-1.8M2.5 17.5c2.3 0 3.3-1.8 5.5-1.8s3.2 1.8 5.5 1.8 3.2-1.8 5.5-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
            <path d="M12 3v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M12 8c1.5-1.5 4-2 6-1.5m-6 1.5c-1.5-1.5-4-2-6-1.5m6 1.5c1.5 1.5 2 4 1.5 6m-1.5-6c-1.5 1.5-2 4-1.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          </svg>
        </div>
      </div>
      <div class="splash-brand-title">
        <span class="splash-title-sub">PORTAL PARIWISATA RESMI</span>
        <h2 class="splash-title-main">EXPLORE PESISIR BARAT</h2>
        <p class="splash-tagline">Surga Bahari & Petualangan Pesisir Lampung</p>
      </div>
      <div class="splash-loader-bar">
        <div class="splash-loader-progress" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="splash-status">{{ statusText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(true)
const fading = ref(false)
const progress = ref(15)
const statusText = ref('Menyiapkan destinasi & peta wisata...')

onMounted(() => {
  const t1 = setTimeout(() => {
    progress.value = 65
    statusText.value = 'Memuat database Supabase & komponen...'
  }, 400)

  const t2 = setTimeout(() => {
    progress.value = 100
    statusText.value = 'Selamat datang di Pesisir Barat!'
  }, 900)

  const t3 = setTimeout(() => {
    fading.value = true
  }, 1200)

  const t4 = setTimeout(() => {
    visible.value = false
  }, 1600)
})
</script>

<style scoped>
.fade-out {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}
</style>
