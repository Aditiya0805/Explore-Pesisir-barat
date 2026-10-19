<template>
  <div v-if="visible" class="splash-screen" :class="{ 'fade-out': fading }">
    <div class="splash-content">
      <div class="splash-logo-container">
        <div class="splash-icon-pulse"></div>
        <div class="splash-icon-box">
          <img src="/assets/images/logo-icon.svg" alt="Pesibar Wave" />
        </div>
      </div>
      <div class="splash-brand-title">
        <span class="splash-title-sub">{{ langStore.isEn ? 'SMART TOURISM PORTAL' : 'PORTAL WISATA CERDAS' }}</span>
        <h2 class="splash-title-main">PESIBAR <span class="splash-accent">WAVE</span></h2>
        <p class="splash-tagline">{{ langStore.t('brand.tagline') }}</p>
      </div>
      <div class="splash-wave-anim" aria-hidden="true">
        <span></span><span></span><span></span>
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
import { useLangStore } from '@/stores/langStore'

const langStore = useLangStore()
const visible = ref(true)
const fading = ref(false)
const progress = ref(15)
const statusText = ref(langStore.isEn ? 'Preparing destinations & interactive map...' : 'Menyiapkan destinasi & peta wisata...')

onMounted(() => {
  const t1 = setTimeout(() => {
    progress.value = 65
    statusText.value = langStore.isEn ? 'Connecting secure database & modules...' : 'Memuat database Supabase & komponen...'
  }, 400)

  const t2 = setTimeout(() => {
    progress.value = 100
    statusText.value = langStore.isEn ? 'Welcome to Pesibar Wave!' : 'Selamat datang di Pesibar Wave!'
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
