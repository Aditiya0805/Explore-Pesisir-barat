<template>
  <section class="section-padding" id="destinasi">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-primary">{{ langStore.t('destinations.badge') }}</span>
        <h2>{{ langStore.t('destinations.title') }}</h2>
        <p>{{ langStore.t('destinations.subtitle') }}</p>
      </div>

      <div class="destinations-grid" id="destinationsGrid">
        <div v-for="rawItem in dataStore.destinations" :key="rawItem.id" class="dest-card">
          <div class="dest-img-container">
            <span class="badge badge-accent dest-badge">
              <i class="fa-solid fa-star"></i> {{ rawItem.rating?.split(' ')[0] || '4.9' }}
            </span>
            <img :src="rawItem.cover_img || rawItem.coverImg" :alt="rawItem.name" class="dest-img" loading="lazy">
          </div>
          <div class="dest-content">
            <div class="dest-meta">
              <div class="dest-location">
                <i class="fa-solid fa-location-dot"></i> {{ rawItem.location }}
              </div>
            </div>
            <h3 class="dest-title">{{ rawItem.name }}</h3>
            <p class="dest-desc">{{ langStore.getLocalizedDestination(rawItem).description }}</p>
            <div class="dest-footer">
              <div>
                <span class="dest-price-label">{{ langStore.t('destinations.startingFrom') }}</span>
                <div class="dest-price">
                  {{ langStore.formatCurrency(rawItem.price) }}
                  <span v-if="rawItem.price" style="font-size:0.8rem; color:var(--color-text-light); font-weight:500;">
                    {{ langStore.t('destinations.perPerson') }}
                  </span>
                </div>
              </div>
              <router-link :to="'/detail/' + rawItem.id" class="btn btn-secondary btn-sm">
                {{ langStore.t('destinations.viewDetails') }}
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
import { useLangStore } from '@/stores/langStore'

const dataStore = useDataStore()
const langStore = useLangStore()
</script>
