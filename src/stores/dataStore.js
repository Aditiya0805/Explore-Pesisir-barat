import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import {
  DESTINATIONS as defaultDestinations,
  MAP_LOCATIONS as defaultLocations,
  PACKAGES as defaultPackages,
  GUIDES as defaultGuides,
  GALLERY as defaultGallery,
  ARTICLES as defaultArticles
} from '@/data/fallbackData'

const DEFAULT_SETTINGS = {
  site_name: 'Pesibar Wave',
  whatsapp: '+62-822-8942-4809',
  email: 'Adityapratama2292@gmail.com',
  address: 'Krui, Pesisir Tengah, Pesisir Barat, Lampung 34272',
  instagram_url: 'https://www.instagram.com/kruitourism_',
  facebook_url: 'https://www.facebook.com/disporaparpesisirbarat',
  youtube_url: 'https://www.youtube.com/@disporaparpesisirbarat'
}

const QUERIES = {
  destinations: (q) => q.order('id', { ascending: true }),
  map_locations: (q) => q.order('id', { ascending: true }),
  packages: (q) => q.order('sort_order', { ascending: true }),
  guides: (q) => q.order('id', { ascending: true }),
  gallery: (q) => q.order('sort_order', { ascending: true }),
  articles: (q) => q.order('id', { ascending: false })
}

export const useDataStore = defineStore('data', () => {
  const destinations = ref([...defaultDestinations])
  const mapLocations = ref([...defaultLocations])
  const packages = ref([...defaultPackages])
  const guides = ref([...defaultGuides])
  const gallery = ref([...defaultGallery])
  const articles = ref([...defaultArticles])
  const settings = ref({ ...DEFAULT_SETTINGS })

  const loading = ref(false)
  const lastError = ref('')
  const dataSource = ref(isSupabaseConfigured() ? 'supabase' : 'fallback')

  const applyTable = (refTarget, rows, { allowEmpty }) => {
    if (Array.isArray(rows) && (allowEmpty || rows.length)) {
      refTarget.value = rows
    }
  }

  /**
   * Load all content from Supabase.
   * @param {{ allowEmpty?: boolean }} options
   *   allowEmpty=false keeps fallback data when a table has no rows (first load).
   *   allowEmpty=true accepts empty tables (used after admin deletes data).
   */
  const fetchAllData = async ({ allowEmpty = false } = {}) => {
    if (!isSupabaseConfigured()) {
      dataSource.value = 'fallback'
      return { configured: false }
    }

    loading.value = true
    lastError.value = ''

    try {
      const responses = await Promise.all([
        QUERIES.destinations(supabase.from('destinations').select('*')),
        QUERIES.map_locations(supabase.from('map_locations').select('*')),
        QUERIES.packages(supabase.from('packages').select('*')),
        QUERIES.guides(supabase.from('guides').select('*')),
        QUERIES.gallery(supabase.from('gallery').select('*')),
        QUERIES.articles(supabase.from('articles').select('*')),
        supabase.from('settings').select('*').order('id', { ascending: true }).limit(1).maybeSingle()
      ])

      const [
        destRes,
        mapRes,
        pkgRes,
        guideRes,
        galRes,
        artRes,
        settingsRes
      ] = responses

      const errors = responses
        .slice(0, 6)
        .map((r) => r.error)
        .filter(Boolean)

      applyTable(destinations, destRes.data, { allowEmpty })
      applyTable(mapLocations, mapRes.data, { allowEmpty })
      applyTable(packages, pkgRes.data, { allowEmpty })
      applyTable(guides, guideRes.data, { allowEmpty })
      applyTable(gallery, galRes.data, { allowEmpty })
      applyTable(articles, artRes.data, { allowEmpty })

      if (!settingsRes.error && settingsRes.data) {
        settings.value = { ...DEFAULT_SETTINGS, ...settingsRes.data }
      }

      if (errors.length) {
        lastError.value = errors[0].message
        dataSource.value = 'fallback'
      } else {
        dataSource.value = 'supabase'
      }

      return { configured: true, errors: errors.length }
    } catch (err) {
      lastError.value = err?.message || 'Gagal memuat data dari Supabase.'
      dataSource.value = 'fallback'
      console.warn('Supabase fetch note, using fallback data:', err)
      return { configured: true, errors: 1 }
    } finally {
      loading.value = false
    }
  }

  /** Force a fresh read after dashboard edits and keep empty results. */
  const refresh = () => fetchAllData({ allowEmpty: true })

  const getDestinationById = (id) => {
    return destinations.value.find((d) => Number(d.id) === Number(id)) || null
  }

  const getPackageById = (id) => {
    return packages.value.find((p) => p.id === id) || null
  }

  const siteName = computed(() => settings.value.site_name || 'Pesibar Wave')

  return {
    destinations,
    mapLocations,
    packages,
    guides,
    gallery,
    articles,
    settings,
    siteName,
    loading,
    lastError,
    dataSource,
    fetchAllData,
    refresh,
    getDestinationById,
    getPackageById
  }
})
