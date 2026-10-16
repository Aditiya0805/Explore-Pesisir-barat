import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import {
  DESTINATIONS as defaultDestinations,
  MAP_LOCATIONS as defaultLocations,
  PACKAGES as defaultPackages,
  GUIDES as defaultGuides,
  GALLERY as defaultGallery,
  ARTICLES as defaultArticles
} from '@/data/fallbackData'

export const useDataStore = defineStore('data', () => {
  const destinations = ref([...defaultDestinations])
  const mapLocations = ref([...defaultLocations])
  const packages = ref([...defaultPackages])
  const guides = ref([...defaultGuides])
  const gallery = ref([...defaultGallery])
  const articles = ref([...defaultArticles])
  const loading = ref(false)

  // Fetch all initial data from Supabase if online/configured
  const fetchAllData = async () => {
    if (!isSupabaseConfigured()) {
      return
    }

    loading.value = true
    try {
      const [
        { data: destData, error: destErr },
        { data: mapData, error: mapErr },
        { data: pkgData, error: pkgErr },
        { data: guideData, error: guideErr },
        { data: galData, error: galErr },
        { data: artData, error: artErr }
      ] = await Promise.all([
        supabase.from('destinations').select('*'),
        supabase.from('map_locations').select('*'),
        supabase.from('packages').select('*').order('sort_order', { ascending: true }),
        supabase.from('guides').select('*'),
        supabase.from('gallery').select('*').order('sort_order', { ascending: true }),
        supabase.from('articles').select('*')
      ])

      if (!destErr && destData?.length) destinations.value = destData
      if (!mapErr && mapData?.length) mapLocations.value = mapData
      if (!pkgErr && pkgData?.length) packages.value = pkgData
      if (!guideErr && guideData?.length) guides.value = guideData
      if (!galErr && galData?.length) gallery.value = galData
      if (!artErr && artData?.length) articles.value = artData
    } catch (err) {
      console.warn('Supabase fetch note, using fallback data:', err)
    } finally {
      loading.value = false
    }
  }

  const getDestinationById = (id) => {
    return destinations.value.find(d => Number(d.id) === Number(id)) || null
  }

  const getPackageById = (id) => {
    return packages.value.find(p => p.id === id) || null
  }

  return {
    destinations,
    mapLocations,
    packages,
    guides,
    gallery,
    articles,
    loading,
    fetchAllData,
    getDestinationById,
    getPackageById
  }
})
