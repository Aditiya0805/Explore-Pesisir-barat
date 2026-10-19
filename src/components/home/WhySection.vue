<template>
  <section class="section-padding why-section" id="tentang">
    <div class="why-bg-overlay"></div>
    <div class="container">
      <div class="section-header">
        <span class="badge badge-accent">{{ langStore.t('why.badge') }}</span>
        <h2>{{ langStore.t('why.title') }}</h2>
        <p>{{ langStore.t('why.subtitle') }}</p>
      </div>

      <div class="why-grid">
        <div class="why-card">
          <div class="why-icon-box">
            <i class="fa-solid fa-water"></i>
          </div>
          <h4 class="why-card-title">{{ langStore.t('why.card1Title') }}</h4>
          <p class="why-card-desc">{{ langStore.t('why.card1Desc') }}</p>
        </div>

        <div class="why-card">
          <div class="why-icon-box">
            <i class="fa-solid fa-person-surfing"></i>
          </div>
          <h4 class="why-card-title">{{ langStore.t('why.card2Title') }}</h4>
          <p class="why-card-desc">{{ langStore.t('why.card2Desc') }}</p>
        </div>

        <div class="why-card">
          <div class="why-icon-box">
            <i class="fa-solid fa-tree"></i>
          </div>
          <h4 class="why-card-title">{{ langStore.t('why.card3Title') }}</h4>
          <p class="why-card-desc">{{ langStore.t('why.card3Desc') }}</p>
        </div>

        <div class="why-card">
          <div class="why-icon-box">
            <i class="fa-solid fa-handshake-angle"></i>
          </div>
          <h4 class="why-card-title">{{ langStore.t('why.card4Title') }}</h4>
          <p class="why-card-desc">{{ langStore.t('why.card4Desc') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLangStore } from '@/stores/langStore'

const langStore = useLangStore()
</script>
