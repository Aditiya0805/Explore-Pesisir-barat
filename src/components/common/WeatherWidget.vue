<template>
  <div class="weather-widget">
    <div class="weather-widget-head">
      <div class="weather-title">
        <i class="fa-solid fa-cloud-sun"></i>
        <span>{{ langStore.t('weather.title') }}</span>
      </div>
      <span class="weather-source" :class="{ 'is-estimate': isEstimate }">
        <i :class="isEstimate ? 'fa-solid fa-clock-rotate-left' : 'fa-solid fa-satellite-dish'"></i>
        {{ isEstimate ? langStore.t('weather.estimate') : langStore.t('weather.live') }}
      </span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="weather-loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>{{ langStore.t('weather.loading') }}</span>
    </div>

    <template v-else>
      <!-- Current conditions -->
      <div class="weather-current">
        <div class="weather-current-icon">
          <i class="fa-solid" :class="currentInfo.icon"></i>
        </div>
        <div class="weather-current-main">
          <span class="weather-temp">{{ formatTemp(conditions.temp) }}<sup>°C</sup></span>
          <span class="weather-desc">{{ currentInfo.label }}</span>
        </div>
      </div>

      <div class="weather-stats-grid">
        <div class="weather-stat">
          <i class="fa-solid fa-wind"></i>
          <span class="weather-stat-label">{{ langStore.t('weather.wind') }}</span>
          <span class="weather-stat-value">
            {{ formatNumber(conditions.wind) }} km/j
            <small v-if="conditions.windDir !== null">· {{ directionLabel(conditions.windDir, langStore.isEn) }}</small>
          </span>
        </div>
        <div class="weather-stat">
          <i class="fa-solid fa-droplet"></i>
          <span class="weather-stat-label">{{ langStore.t('weather.humidity') }}</span>
          <span class="weather-stat-value">{{ formatNumber(conditions.humidity) }}%</span>
        </div>
      </div>

      <!-- Marine / surf conditions -->
      <div class="wave-card" :style="{ '--wave-accent': wave.color }">
        <div class="wave-card-head">
          <span class="wave-title"><i class="fa-solid fa-water"></i> {{ langStore.t('weather.seaCondition') }}</span>
          <span class="wave-badge" :style="{ background: wave.color }">
            <i class="fa-solid" :class="wave.icon"></i> {{ wave.label }}
          </span>
        </div>

        <div class="wave-metrics">
          <div class="wave-metric">
            <span class="wave-metric-label">{{ langStore.t('weather.waveHeight') }}</span>
            <span class="wave-metric-value">{{ formatWave(conditions.waveHeight) }}<small>m</small></span>
          </div>
          <div class="wave-metric">
            <span class="wave-metric-label">{{ langStore.t('weather.wavePeriod') }}</span>
            <span class="wave-metric-value">{{ formatNumber(conditions.wavePeriod) }}<small>s</small></span>
          </div>
          <div class="wave-metric">
            <span class="wave-metric-label">{{ langStore.t('weather.waveDir') }}</span>
            <span class="wave-metric-value">{{ directionLabel(conditions.waveDirection, langStore.isEn) }}</span>
          </div>
        </div>

        <p class="wave-advice">{{ wave.advice }}</p>
        <p v-if="wave.surf" class="wave-surf">
          <i class="fa-solid fa-person-swimming"></i>
          {{ langStore.t('weather.surfLevel') }}: <strong>{{ wave.surf }}</strong>
        </p>
      </div>

      <!-- 3-day outlook -->
      <div v-if="conditions.daily && conditions.daily.length" class="weather-forecast">
        <div v-for="(day, i) in conditions.daily" :key="i" class="forecast-day" :class="{ 'is-today': i === 0 }">
          <span class="forecast-label">{{ dayLabel(day.date, i) }}</span>
          <i class="fa-solid" :class="dayInfo(day.code).icon"></i>
          <span class="forecast-temp">
            <strong>{{ formatTemp(day.max) }}°</strong>
            <small>{{ formatTemp(day.min) }}°</small>
          </span>
        </div>
      </div>

      <p v-if="isEstimate" class="weather-note">
        <i class="fa-solid fa-circle-info"></i> {{ estimateNote }}
      </p>
      <p class="weather-credit">{{ langStore.t('weather.credit') }}</p>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useLangStore } from '@/stores/langStore'
import { getConditions, weatherCodeInfo, waveAssessment, directionLabel } from '@/lib/weather'

const props = defineProps({
  lat: { type: [Number, String], default: null },
  lng: { type: [Number, String], default: null },
  destinationName: { type: String, default: '' }
})

const langStore = useLangStore()
const conditions = ref({})
const isLoading = ref(true)
let controller = null

const currentInfo = computed(() => weatherCodeInfo(conditions.value.code, langStore.isEn))
const wave = computed(() => waveAssessment(conditions.value.waveHeight, langStore.isEn))
const isEstimate = computed(() => conditions.value.isEstimate === true)

const estimateNote = computed(() => langStore.isEn
  ? 'Live data is temporarily unavailable — showing a seasonal pattern estimate instead.'
  : 'Data live sedang tidak tersedia — menampilkan perkiraan pola musiman sebagai gantinya.')

const dayInfo = (code) => weatherCodeInfo(code, langStore.isEn)

const formatTemp = (val) => (val === null || val === undefined || isNaN(val)) ? '–' : Math.round(Number(val))
const formatNumber = (val) => (val === null || val === undefined || isNaN(val)) ? '–' : Math.round(Number(val))
const formatWave = (val) => (val === null || val === undefined || isNaN(val)) ? '–' : Number(val).toFixed(1)

const dayLabel = (dateStr, index) => {
  if (index === 0) return langStore.isEn ? 'Today' : 'Hari ini'
  if (index === 1) return langStore.isEn ? 'Tomorrow' : 'Besok'
  if (!dateStr) return '-'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(langStore.isEn ? 'en-US' : 'id-ID', { weekday: 'short' })
}

const load = async () => {
  isLoading.value = true
  if (controller) controller.abort()
  controller = new AbortController()
  try {
    const data = await getConditions(
      props.lat === null ? null : Number(props.lat),
      props.lng === null ? null : Number(props.lng),
      { isEn: langStore.isEn, signal: controller.signal }
    )
    conditions.value = data || {}
  } catch (err) {
    // Never surface errors — fall back to an empty (gracefully rendered) object.
    conditions.value = {}
  } finally {
    isLoading.value = false
  }
}

onMounted(load)

watch(() => [props.lat, props.lng], () => load())
watch(() => langStore.currentLang, () => {
  // Only re-render helper labels; no refetch needed for the data itself.
})

onUnmounted(() => { if (controller) controller.abort() })
</script>
