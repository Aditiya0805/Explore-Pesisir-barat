<template>
  <section
    class="booking-cta"
    style="background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80');"
  >
    <div class="booking-cta-overlay"></div>
    <div class="container">
      <h2>{{ langStore.t('bookingCta.title') }}</h2>
      <p>{{ langStore.t('bookingCta.subtitle') }}</p>
      <router-link to="/booking" class="btn btn-primary btn-lg">
        <i class="fa-solid fa-paper-plane"></i> {{ langStore.t('bookingCta.button') }}
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { useLangStore } from '@/stores/langStore'

const langStore = useLangStore()
</script>
