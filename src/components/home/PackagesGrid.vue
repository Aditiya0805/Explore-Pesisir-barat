<template>
  <section class="section-padding" id="paket" style="background-color: var(--color-white);">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-accent">{{ langStore.t('packages.badge') }}</span>
        <h2>{{ langStore.t('packages.title') }}</h2>
        <p>{{ langStore.t('packages.subtitle') }}</p>
      </div>

      <div class="packages-grid" id="packagesGrid">
        <div
          v-for="pkg in dataStore.packages"
          :key="pkg.id"
          class="package-card"
          :class="{ popular: pkg.is_popular || pkg.isPopular }"
        >
          <span v-if="pkg.is_popular || pkg.isPopular" class="popular-ribbon">
            <i class="fa-solid fa-fire"></i> {{ langStore.t('packages.popularBadge') }}
          </span>

          <div class="package-img-container">
            <img :src="pkg.cover_img || pkg.coverImg" :alt="getPkgName(pkg)" class="package-img" loading="lazy">
          </div>

          <div class="package-content">
            <h3 class="package-title">{{ getPkgName(pkg) }}</h3>
            <div class="package-meta-row">
              <div class="package-meta-item"><i class="fa-solid fa-clock"></i> {{ getPkgDuration(pkg) }}</div>
              <div class="package-meta-item"><i class="fa-solid fa-user-group"></i> {{ getPkgMinPersons(pkg) }}</div>
            </div>

            <ul class="package-amenities">
              <li v-for="(amenity, idx) in getPkgAmenities(pkg)" :key="idx">
                <i class="fa-solid fa-circle-check"></i> {{ amenity }}
              </li>
            </ul>

            <div class="package-price-box">
              <span class="price-label">{{ langStore.t('packages.specialPrice') }}</span>
              <div class="price">
                {{ langStore.formatCurrency(pkg.price) }}
                <span>/ {{ pkg.id === 'family' ? (langStore.isEn ? 'group' : 'pack') : 'pax' }}</span>
              </div>
            </div>

            <button
              class="btn btn-block select-package-booking"
              :class="pkg.is_popular ? 'btn-primary' : 'btn-secondary'"
              @click="selectPackage(pkg.id)"
            >
              {{ langStore.t('packages.bookNow') }}
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
import { useLangStore } from '@/stores/langStore'

const router = useRouter()
const dataStore = useDataStore()
const bookingStore = useBookingStore()
const langStore = useLangStore()

const getPkgName = (pkg) => {
  const info = langStore.getPackageInfo(pkg.id)
  return info?.name || pkg.name
}

const getPkgDuration = (pkg) => {
  const info = langStore.getPackageInfo(pkg.id)
  return info?.duration || pkg.duration
}

const getPkgMinPersons = (pkg) => {
  const info = langStore.getPackageInfo(pkg.id)
  return info?.minPersons || pkg.min_persons || pkg.minPersons
}

const getPkgAmenities = (pkg) => {
  const info = langStore.getPackageInfo(pkg.id)
  return info?.amenities || pkg.amenities
}

const selectPackage = (pkgId) => {
  bookingStore.setPackage(pkgId)
  router.push('/booking')
}
</script>
