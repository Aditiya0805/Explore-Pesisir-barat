/**
 * Weather & marine conditions helper.
 *
 * Uses the free, key-less Open-Meteo APIs:
 *   - Forecast API : https://api.open-meteo.com/v1/forecast
 *   - Marine API   : https://marine-api.open-meteo.com/v1/marine
 *
 * Everything degrades gracefully: on any network/parse failure the helpers
 * return `null` (or a safe estimate) and never throw — the UI shows a friendly
 * fallback instead of an error.
 */

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const MARINE_URL = 'https://marine-api.open-meteo.com/v1/marine'

// Small in-memory cache so we don't hammer the API when navigating back/forth.
const cache = new Map()
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

const WMO = {
  0: { icon: 'fa-sun', id: 'Cerah', en: 'Clear sky' },
  1: { icon: 'fa-sun', id: 'Cerah Berawan', en: 'Mainly clear' },
  2: { icon: 'fa-cloud-sun', id: 'Berawan Sebagian', en: 'Partly cloudy' },
  3: { icon: 'fa-cloud', id: 'Berawan', en: 'Overcast' },
  45: { icon: 'fa-smog', id: 'Berkabut', en: 'Fog' },
  48: { icon: 'fa-smog', id: 'Kabut Beku', en: 'Rime fog' },
  51: { icon: 'fa-cloud-rain', id: 'Gerimis Ringan', en: 'Light drizzle' },
  53: { icon: 'fa-cloud-rain', id: 'Gerimis', en: 'Drizzle' },
  55: { icon: 'fa-cloud-rain', id: 'Gerimis Lebat', en: 'Dense drizzle' },
  56: { icon: 'fa-cloud-rain', id: 'Gerimis Membeku', en: 'Freezing drizzle' },
  57: { icon: 'fa-cloud-rain', id: 'Gerimis Membeku', en: 'Freezing drizzle' },
  61: { icon: 'fa-cloud-showers-heavy', id: 'Hujan Ringan', en: 'Slight rain' },
  63: { icon: 'fa-cloud-showers-heavy', id: 'Hujan Sedang', en: 'Moderate rain' },
  65: { icon: 'fa-cloud-showers-heavy', id: 'Hujan Lebat', en: 'Heavy rain' },
  66: { icon: 'fa-cloud-showers-heavy', id: 'Hujan Membeku', en: 'Freezing rain' },
  67: { icon: 'fa-cloud-showers-heavy', id: 'Hujan Membeku', en: 'Freezing rain' },
  71: { icon: 'fa-snowflake', id: 'Salju Ringan', en: 'Slight snow' },
  73: { icon: 'fa-snowflake', id: 'Salju', en: 'Snow' },
  75: { icon: 'fa-snowflake', id: 'Salju Lebat', en: 'Heavy snow' },
  77: { icon: 'fa-snowflake', id: 'Butiran Salju', en: 'Snow grains' },
  80: { icon: 'fa-cloud-showers-heavy', id: 'Hujan Lokal', en: 'Rain showers' },
  81: { icon: 'fa-cloud-showers-heavy', id: 'Hujan Lokal Sedang', en: 'Moderate showers' },
  82: { icon: 'fa-cloud-showers-water', id: 'Hujan Lokal Lebat', en: 'Violent showers' },
  85: { icon: 'fa-snowflake', id: 'Hujan Salju', en: 'Snow showers' },
  86: { icon: 'fa-snowflake', id: 'Hujan Salju Lebat', en: 'Heavy snow showers' },
  95: { icon: 'fa-cloud-bolt', id: 'Badai Petir', en: 'Thunderstorm' },
  96: { icon: 'fa-cloud-bolt', id: 'Badai Petir & Hujan Es', en: 'Thunderstorm w/ hail' },
  99: { icon: 'fa-cloud-bolt', id: 'Badai Petir Hebat', en: 'Severe thunderstorm' }
}

export function weatherCodeInfo(code, isEn) {
  const info = WMO[code] || { icon: 'fa-cloud-sun', id: 'Berawan', en: 'Cloudy' }
  return { icon: info.icon, label: isEn ? info.en : info.id }
}

/** Convert a meteorological bearing (deg) to a compass point. */
export function directionLabel(deg, isEn) {
  if (deg === null || deg === undefined || isNaN(deg)) return '-'
  const en = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const id = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL']
  const idx = Math.round(deg / 45) % 8
  return isEn ? en[idx] : id[idx]
}

/**
 * Interpret wave height into a sea-condition advisory.
 * @returns {{ level:string, label:string, color:string, icon:string, advice:string, surf:string }}
 */
export function waveAssessment(height, isEn) {
  if (height === null || height === undefined || isNaN(height)) {
    return {
      level: 'unknown',
      label: isEn ? 'No marine data' : 'Data laut N/A',
      color: 'var(--color-text-light)',
      icon: 'fa-water',
      advice: isEn ? 'Marine forecast unavailable for this spot.' : 'Prakiraan laut tidak tersedia untuk spot ini.',
      surf: ''
    }
  }
  if (height < 0.6) {
    return {
      level: 'calm',
      label: isEn ? 'Calm' : 'Tenang',
      color: 'var(--color-success)',
      icon: 'fa-water',
      advice: isEn ? 'Calm sea — perfect for swimming, snorkeling & families.' : 'Laut tenang — ideal untuk berenang, snorkeling & keluarga.',
      surf: isEn ? 'Beginners only' : 'Cocok pemula'
    }
  }
  if (height < 1.3) {
    return {
      level: 'moderate',
      label: isEn ? 'Moderate' : 'Sedang',
      color: 'var(--color-turquoise)',
      icon: 'fa-water',
      advice: isEn ? 'Fun, manageable waves — great for beginner to intermediate surfers.' : 'Ombak menyenangkan — pas untuk surfing pemula hingga menengah.',
      surf: isEn ? 'Beginner–Intermediate' : 'Pemula–Menengah'
    }
  }
  if (height < 2.5) {
    return {
      level: 'rough',
      label: isEn ? 'Choppy' : 'Cukup Tinggi',
      color: 'var(--color-sunset-orange)',
      icon: 'fa-water-ladder',
      advice: isEn ? 'Solid swell — recommended for experienced surfers only.' : 'Ombak cukup besar — disarankan untuk peselancar berpengalaman.',
      surf: isEn ? 'Intermediate–Advanced' : 'Menengah–Ahli'
    }
  }
  return {
    level: 'big',
    label: isEn ? 'Big Swell' : 'Ombak Besar',
    color: 'var(--color-error)',
    icon: 'fa-triangle-exclamation',
    advice: isEn ? 'Powerful swell — advanced/professionals only. Swim with caution.' : 'Ombak besar & kuat — hanya untuk ahli/profesional. Berhati-hati saat berenang.',
    surf: isEn ? 'Advanced–Pro' : 'Ahli–Pro'
  }
}

/** Seasonal fallback when the API cannot be reached. */
export function seasonalEstimate(isEn) {
  const month = new Date().getMonth() // 0 = Jan
  const peak = month >= 3 && month <= 9 // Apr–Oct (surf season)
  if (peak) {
    return {
      isEstimate: true,
      waveHeight: 1.6,
      wavePeriod: 12,
      waveDirection: 210,
      temp: 29,
      wind: 11,
      code: 2,
      summary: isEn
        ? 'Peak surf season: expect consistent 1.5–2.5 m swells and warm 27–31°C days.'
        : 'Musim ombak puncak: perkirakan swell 1,5–2,5 m yang konsisten dan suhu hangat 27–31°C.'
    }
  }
  return {
    isEstimate: true,
    waveHeight: 0.8,
    wavePeriod: 8,
    waveDirection: 190,
    temp: 28,
    wind: 8,
    code: 61,
    summary: isEn
      ? 'Calmer season: smaller 0.5–1.2 m waves, occasional afternoon showers.'
      : 'Musim lebih tenang: ombak 0,5–1,2 m, kadang hujan sore.'
  }
}

async function fetchJson(url, signal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return res.json()
}

/**
 * Fetch current weather + marine conditions for a coordinate.
 * @returns {Promise<object|null>} null when both providers fail.
 */
export async function getConditions(lat, lng, { isEn = false, signal } = {}) {
  if (lat === null || lng === null || lat === undefined || lng === undefined) {
    return seasonalEstimate(isEn)
  }

  const key = `${Number(lat).toFixed(3)},${Number(lng).toFixed(3)}`
  const cached = cache.get(key)
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data
  }

  const fcUrl =
    `${FORECAST_URL}?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=3`

  const marineUrl =
    `${MARINE_URL}?latitude=${lat}&longitude=${lng}` +
    `&current=wave_height,wave_period,wave_direction` +
    `&timezone=auto`

  const result = {
    temp: null,
    humidity: null,
    wind: null,
    windDir: null,
    code: null,
    daily: [],
    waveHeight: null,
    wavePeriod: null,
    waveDirection: null,
    isEstimate: false,
    marineAvailable: false
  }

  let anySuccess = false

  const [fcRes, marineRes] = await Promise.allSettled([
    fetchJson(fcUrl, signal),
    fetchJson(marineUrl, signal)
  ])

  if (fcRes.status === 'fulfilled' && fcRes.value) {
    anySuccess = true
    const d = fcRes.value
    const cur = d.current || {}
    result.temp = cur.temperature_2m ?? null
    result.humidity = cur.relative_humidity_2m ?? null
    result.wind = cur.wind_speed_10m ?? null
    result.windDir = cur.wind_direction_10m ?? null
    result.code = cur.weather_code ?? null
    if (d.daily) {
      const times = d.daily.time || []
      result.daily = times.slice(0, 3).map((t, i) => ({
        date: t,
        code: d.daily.weather_code?.[i] ?? null,
        max: d.daily.temperature_2m_max?.[i] ?? null,
        min: d.daily.temperature_2m_min?.[i] ?? null
      }))
    }
  }

  if (marineRes.status === 'fulfilled' && marineRes.value) {
    const cur = marineRes.value.current || {}
    result.waveHeight = cur.wave_height ?? null
    result.wavePeriod = cur.wave_period ?? null
    result.waveDirection = cur.wave_direction ?? null
    result.marineAvailable = result.waveHeight !== null && result.waveHeight !== undefined
    if (result.marineAvailable) anySuccess = true
  }

  if (!anySuccess) {
    const estimate = seasonalEstimate(isEn)
    cache.set(key, { time: Date.now(), data: estimate })
    return estimate
  }

  cache.set(key, { time: Date.now(), data: result })
  return result
}
