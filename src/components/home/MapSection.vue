<template>
  <section class="section-padding map-section" id="peta">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-primary"><i class="fa-solid fa-earth-asia"></i> {{ langStore.t('map.badge') }}</span>
        <h2>{{ langStore.t('map.title') }}</h2>
        <p>{{ langStore.t('map.subtitle') }}</p>
      </div>

      <div class="map-container-card">
        <!-- Map Toolbar Header -->
        <div class="map-toolbar">
          <!-- Category Filter Buttons -->
          <div class="map-filters-scroll" id="mapFiltersScroll">
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="map-filter-btn"
              :class="{ active: selectedCategory === cat.id }"
              @click="setCategory(cat.id)"
            >
              <i :class="cat.icon"></i> {{ cat.label }} (<span>{{ getCategoryCount(cat.id) }}</span>)
            </button>
          </div>

          <!-- Map Control Actions -->
          <div class="map-view-controls">
            <div class="map-layer-selector">
              <button
                class="map-control-btn"
                :class="{ active: currentLayer === 'sat' }"
                id="btnLayerSat"
                :title="langStore.isEn ? 'Real Satellite View' : 'Tampilan Satelit Real'"
                @click="switchLayer('sat')"
              >
                <i class="fa-solid fa-satellite"></i> <span>{{ langStore.t('map.layerSat') }}</span>
              </button>
              <button
                class="map-control-btn"
                :class="{ active: currentLayer === 'street' }"
                id="btnLayerStreet"
                :title="langStore.isEn ? 'Topography Map View' : 'Tampilan Peta Topografi'"
                @click="switchLayer('street')"
              >
                <i class="fa-solid fa-map"></i> <span>{{ langStore.t('map.layerStreet') }}</span>
              </button>
              <button
                class="map-control-btn"
                :class="{ active: currentLayer === 'dark' }"
                id="btnLayerDark"
                :title="langStore.isEn ? 'Night Mode' : 'Mode Malam'"
                @click="switchLayer('dark')"
              >
                <i class="fa-solid fa-moon"></i> <span>{{ langStore.t('map.layerDark') }}</span>
              </button>
            </div>

            <div class="map-quick-actions">
              <button
                class="map-control-btn btn-tilt"
                :class="{ active: is3DTilt }"
                id="btnToggle3D"
                :title="langStore.isEn ? 'Toggle 3D Tilt View' : 'Toggle Perspektif 3D Tilt'"
                @click="toggle3D"
              >
                <i class="fa-solid fa-cube"></i> <span>{{ is3DTilt ? langStore.t('map.tilt2d') : langStore.t('map.tilt3d') }}</span>
              </button>
              <button
                class="map-control-btn btn-geo"
                id="btnMyLocation"
                :title="langStore.isEn ? 'Locate My Position' : 'Lacak Posisi Saya Sekarang'"
                @click="locateMe"
              >
                <i class="fa-solid fa-location-crosshairs"></i> <span>{{ langStore.isEn ? 'My Location' : 'Lokasi Saya' }}</span>
              </button>
              <button
                class="map-control-btn btn-reset"
                id="btnResetMap"
                :title="langStore.isEn ? 'Reset to Default View' : 'Kembali ke Tampilan Utama'"
                @click="resetView"
              >
                <i class="fa-solid fa-arrows-rotate"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Map Layout Grid (Map Canvas + Interactive Sidebar) -->
        <div class="map-layout-grid">
          <!-- 3D Map Viewport Frame -->
          <div class="map-viewport-wrapper" :class="{ 'is-3d-tilt': is3DTilt }" id="mapViewportWrapper">
            <div id="tourismMap" class="tourism-map-frame" ref="mapContainerRef"></div>

            <!-- Live Compass & HUD Overlay -->
            <div class="map-hud-overlay">
              <div class="hud-item compass-hud">
                <i class="fa-regular fa-compass fa-spin-pulse" style="--fa-animation-duration: 10s;"></i>
                <span>PESISIR BARAT 3D TERRAIN</span>
              </div>
              <div class="hud-item coords-hud" id="mapCoordsHud">
                <i class="fa-solid fa-satellite-dish"></i> GPS: {{ currentCoords }}
              </div>
            </div>

            <!-- Floating Legend on Map -->
            <div class="map-floating-legend">
              <span class="legend-item"><span class="legend-dot dot-surf"></span> {{ langStore.isEn ? 'Surfing' : 'Surfing' }}</span>
              <span class="legend-item"><span class="legend-dot dot-beach"></span> {{ langStore.isEn ? 'Beaches' : 'Pantai' }}</span>
              <span class="legend-item"><span class="legend-dot dot-nature"></span> {{ langStore.isEn ? 'Waterfalls' : 'Air Terjun' }}</span>
              <span class="legend-item"><span class="legend-dot dot-culture"></span> {{ langStore.isEn ? 'Culture' : 'Budaya' }}</span>
              <span class="legend-item"><span class="legend-dot dot-landmark"></span> {{ langStore.isEn ? 'Hills' : 'Bukit' }}</span>
              <span class="legend-item"><span class="legend-dot dot-island"></span> {{ langStore.isEn ? 'Islands' : 'Pulau' }}</span>
              <span class="legend-item"><span class="legend-dot dot-culinary"></span> {{ langStore.isEn ? 'Cuisine' : 'Kuliner' }}</span>
              <span class="legend-item"><span class="legend-dot dot-conservation"></span> {{ langStore.isEn ? 'Conservation' : 'Konservasi' }}</span>
            </div>
          </div>

          <!-- Interactive Sidebar Directory -->
          <div class="map-sidebar">
            <div class="map-sidebar-header">
              <div class="sidebar-search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  id="mapSearchInput"
                  v-model="searchQuery"
                  :placeholder="langStore.isEn ? 'Search tourist spots...' : 'Cari nama spot wisata...'"
                >
              </div>
              <div class="sidebar-meta-row">
                <span id="spotCountBadge" class="badge badge-accent">
                  {{ filteredSpots.length }} {{ langStore.isEn ? 'Spots Found' : 'Titik Wisata Ditemukan' }}
                </span>
                <span class="sidebar-hint">
                  <i class="fa-solid fa-hand-pointer"></i> {{ langStore.isEn ? 'Click spot to fly-to' : 'Klik spot untuk fly-to' }}
                </span>
              </div>
            </div>

            <div class="map-spots-list" id="mapSpotsList">
              <div
                v-for="spot in filteredSpots"
                :key="spot.id"
                class="map-spot-item"
                :class="{ active: selectedSpotId === spot.id }"
                @click="flyToSpot(spot)"
              >
                <div class="spot-thumbnail-box">
                  <img :src="spot.img || '/assets/images/paket-explore-krui.jpg'" :alt="spot.name" class="spot-thumbnail" loading="lazy">
                  <span class="spot-category-tag">{{ getSpotCategoryLabel(spot) }}</span>
                </div>
                <div class="spot-item-details">
                  <h4 class="spot-item-title">{{ spot.name }}</h4>
                  <div class="spot-item-meta">
                    <span class="spot-rating"><i class="fa-solid fa-star"></i> {{ spot.rating }}</span>
                    <span class="spot-price"><i class="fa-solid fa-ticket"></i> {{ getSpotPriceLabel(spot) }}</span>
                  </div>
                  <p class="spot-item-desc">{{ getSpotDesc(spot) }}</p>
                  <div class="spot-actions">
                    <a
                      :href="spot.gmaps_dir_url || spot.gmapsDirUrl || ('https://www.google.com/maps/dir/?api=1&destination=' + spot.lat + ',' + spot.lng)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-secondary btn-xs"
                      @click.stop
                    >
                      <i class="fa-solid fa-diamond-turn-right"></i> {{ langStore.isEn ? 'Directions' : 'Petunjuk Arah' }}
                    </a>
                    <button class="btn btn-primary btn-xs" @click.stop="flyToSpot(spot)">
                      <i class="fa-solid fa-crosshairs"></i> {{ langStore.isEn ? 'View on Map' : 'Lihat di Peta' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Map Footer Live Google Maps Banner -->
        <div class="map-footer-banner">
          <div class="gmaps-direct-info">
            <div class="gmaps-icon-circle">
              <i class="fa-brands fa-google"></i>
            </div>
            <div>
              <h4>{{ langStore.isEn ? 'Directly Synced with Google Maps (Real-Time GPS)' : 'Terhubung Langsung dengan Google Maps (GPS Real-Time)' }}</h4>
              <p>
                {{ langStore.isEn
                  ? 'Access live route navigation, distance estimates, and real-time traffic updates from your current location to all top destinations in Pesisir Barat.'
                  : 'Akses rute perjalanan, jarak tempuh, serta estimasi waktu lalu lintas langsung dari lokasi Anda saat ini menuju berbagai titik wisata di Pesisir Barat.'
                }}
              </p>
            </div>
          </div>
          <div class="map-footer-actions">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=-5.313426,103.998218"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
              id="openMainGmapsBtn"
            >
              <i class="fa-solid fa-diamond-turn-right"></i> {{ langStore.isEn ? 'Directions to Central Hub' : 'Petunjuk Rute ke Titik Pusat' }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import { useDataStore } from '@/stores/dataStore'
import { useLangStore } from '@/stores/langStore'

const dataStore = useDataStore()
const langStore = useLangStore()

const mapContainerRef = ref(null)
let mapInstance = null
let currentTileLayer = null
let markers = []

const is3DTilt = ref(true)
const currentLayer = ref('sat')
const selectedCategory = ref('all')
const searchQuery = ref('')
const selectedSpotId = ref(null)
const currentCoords = ref('-5.3134, 103.9982')

const categories = computed(() => [
  { id: 'all', label: langStore.t('map.catAll'), icon: 'fa-solid fa-layer-group' },
  { id: 'surfing', label: langStore.t('map.catSurf'), icon: 'fa-solid fa-water' },
  { id: 'beach', label: langStore.t('map.catBeach'), icon: 'fa-solid fa-umbrella-beach' },
  { id: 'nature', label: langStore.t('map.catNature'), icon: 'fa-solid fa-tree' },
  { id: 'culture', label: langStore.t('map.catCulture'), icon: 'fa-solid fa-landmark' },
  { id: 'landmark', label: langStore.isEn ? 'Landmarks' : 'Landmark', icon: 'fa-solid fa-mountain-sun' },
  { id: 'island', label: langStore.t('map.catIsland'), icon: 'fa-solid fa-sailboat' },
  { id: 'culinary', label: langStore.isEn ? 'Culinary' : 'Kuliner', icon: 'fa-solid fa-utensils' },
  { id: 'conservation', label: langStore.isEn ? 'Conservation' : 'Konservasi', icon: 'fa-solid fa-shield-halved' }
])

const spotEnOverrides = {
  1: { desc: "World-class Pesisir Barat surfing hub with legendary 6-7 meter peeling left-handers.", cat: "Surfing & Breaks" },
  2: { desc: "Fast and hollow reef barrel break facing the open Indian Ocean swell.", cat: "Reef Barrel Surf" },
  3: { desc: "Wide volcanic black sand beach offering magnificent sunset views over the Indian Ocean.", cat: "Black Sand Beach" },
  4: { desc: "Signature urban beach of Krui featuring public parks, cultural stages, and fresh seafood stalls.", cat: "Recreation Hub" },
  5: { desc: "Home of the annual WSL Krui Pro world tour, featuring golden sands and vibrant oceanfront surf resorts.", cat: "WSL Pro Surf Arena" },
  6: { desc: "Hidden cascade tucked inside lush mountain rainforests with cool natural rock pools.", cat: "Rainforest Falls" },
  7: { desc: "Tranquil beach shaded by thousands of swaying coconut palms and green meadows overlooking the ocean.", cat: "Palm Grove Beach" },
  8: { desc: "Monumental 25-meter natural monolith sea stack rock standing dramatically by the river mouth and ocean.", cat: "Monolith Landmark" },
  9: { desc: "Magnificent multi-tiered waterfalls cascading across tiered andesite rock ledges into deep natural pools.", cat: "Tiered Cascade" },
  10: { desc: "Traditional Saibatin gold-thread handwoven Tapis textile center and craft workshops.", cat: "Culture & Crafts" },
  11: { desc: "Mystical sea cave perched on coastal cliffs inhabited by thousands of bats with sweeping ocean vistas.", cat: "Karst Sea Cave" },
  12: { desc: "Majestic seaside Hindu temple perched on rocky shorelines offering sunset scenes akin to Bali's Tanah Lot.", cat: "Sacred Sea Temple" },
  13: { desc: "Acclaimed traditional agroforestry canopy forest of hundred-year-old Damar Mata Kucing trees.", cat: "World Agroforestry" },
  14: { desc: "Secluded island haven with crystal-clear waters, wild dolphins & historic colonial architecture.", cat: "Exotic Island" },
  15: { desc: "Historic coastal hilltop with 360-degree vistas over Kuala Stabas Harbour, the lighthouse, and glowing sunsets.", cat: "City Lookout" },
  16: { desc: "Gentle golden sandy beach, home to traditional Jukung fishing fleets and local grilled fish centers.", cat: "Culinary & Beach" },
  17: { desc: "Conservation and nesting sanctuary for endangered leatherback and hawksbill sea turtles.", cat: "Turtle Sanctuary" },
  18: { desc: "Scenic rock-strewn beach serving as the primary departure pier for traditional jukung boats to Banana Island.", cat: "Island Pier & Beach" }
}

const getSpotDesc = (spot) => {
  if (langStore.isEn && spotEnOverrides[spot.id]?.desc) {
    return spotEnOverrides[spot.id].desc
  }
  return spot.description || spot.desc
}

const getSpotCategoryLabel = (spot) => {
  if (langStore.isEn && spotEnOverrides[spot.id]?.cat) {
    return spotEnOverrides[spot.id].cat
  }
  return spot.category_label || spot.categoryLabel || spot.category
}

const getSpotPriceLabel = (spot) => {
  if (!spot.price || spot.price === 'Gratis' || spot.price === 'Free') {
    return langStore.isEn ? 'Free' : 'Gratis'
  }
  if (langStore.isEn && typeof spot.price === 'string' && spot.price.includes('Rp')) {
    return spot.price.replace('Rp', 'IDR')
  }
  return spot.price
}

const getCategoryCount = (catId) => {
  if (catId === 'all') return dataStore.mapLocations.length
  return dataStore.mapLocations.filter(loc => loc.category === catId).length
}

const filteredSpots = computed(() => {
  return dataStore.mapLocations.filter(spot => {
    const matchCat = selectedCategory.value === 'all' || spot.category === selectedCategory.value
    const query = searchQuery.value.trim().toLowerCase()
    const matchQuery = !query ||
      spot.name.toLowerCase().includes(query) ||
      (spot.description && spot.description.toLowerCase().includes(query)) ||
      (spot.category_label && spot.category_label.toLowerCase().includes(query))
    return matchCat && matchQuery
  })
})

const setCategory = (catId) => {
  selectedCategory.value = catId
  renderMarkers()
}

const toggle3D = () => {
  is3DTilt.value = !is3DTilt.value
  setTimeout(() => {
    if (mapInstance) {
      mapInstance.invalidateSize()
    }
  }, 350)
}

// Tile Layer URLs
const tileLayers = {
  sat: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO'
  }
}

const switchLayer = (type) => {
  currentLayer.value = type
  if (mapInstance && currentTileLayer) {
    mapInstance.removeLayer(currentTileLayer)
    currentTileLayer = L.tileLayer(tileLayers[type].url, {
      maxZoom: 19,
      attribution: tileLayers[type].attribution
    }).addTo(mapInstance)
  }
}

const initMap = () => {
  if (!mapContainerRef.value || mapInstance) return

  const isMobile = window.innerWidth <= 768

  // Center on Krui / Pesisir Barat
  mapInstance = L.map(mapContainerRef.value, {
    center: [-5.24, 103.95],
    zoom: isMobile ? 10 : 11,
    zoomControl: true,
    scrollWheelZoom: false
  })

  // Enable scrollWheelZoom once user clicks or interacts with the map
  mapInstance.on('click', () => {
    if (mapInstance) mapInstance.scrollWheelZoom.enable()
  })

  currentTileLayer = L.tileLayer(tileLayers.sat.url, {
    maxZoom: 19,
    attribution: tileLayers.sat.attribution
  }).addTo(mapInstance)

  mapInstance.on('mousemove', (e) => {
    currentCoords.value = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
  })

  renderMarkers()
}

const createCustomIcon = (spot) => {
  const iconClass = spot.icon || 'fa-map-pin'
  const pinClass = spot.pin_class || spot.pinClass || 'pin-surf'

  return L.divIcon({
    className: 'custom-map-marker enhanced',
    html: `
      <div class="map-marker-pin ${pinClass}">
        <i class="fa-solid ${iconClass}"></i>
        <div class="marker-label">${spot.name.substring(0, 22)}</div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [44, 56],
    iconAnchor: [22, 56],
    popupAnchor: [0, -56]
  })
}

const renderMarkers = () => {
  if (!mapInstance) return

  // Clear existing markers
  markers.forEach(m => mapInstance.removeLayer(m))
  markers = []

  const spots = filteredSpots.value

  spots.forEach(spot => {
    const icon = createCustomIcon(spot)
    const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(mapInstance)

    const gmapsUrl = spot.gmaps_dir_url || spot.gmapsDirUrl || `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`

    const catLabel = getSpotCategoryLabel(spot)
    const desc = getSpotDesc(spot)
    const priceText = getSpotPriceLabel(spot)
    const routeBtnText = langStore.isEn ? 'Directions' : 'Arah'
    const viewDetailText = langStore.isEn ? 'Detail' : 'Detail'
    const destLink = spot.dest_id ? `/detail/${spot.dest_id}` : '/#destinasi'

    const popupHtml = `
      <div class="enhanced-map-popup">
        <img src="${spot.img || '/assets/images/pantai-karang-nyimbor.jpg'}" alt="${spot.name}" class="popup-thumb" loading="lazy" />
        
        <div class="popup-header">
          <h4>${spot.name}</h4>
          <span class="popup-category">${catLabel}</span>
        </div>
        
        <div class="popup-meta">
          <div class="meta-row">
            <i class="fa-solid fa-star" style="color:#f59e0b;"></i>
            <span>${spot.rating || '4.8 ★'}</span>
          </div>
          <div class="meta-row">
            <i class="fa-solid fa-location-dot" style="color:#06b6d4;"></i>
            <span>${spot.location || 'Pesisir Barat, Lampung'}</span>
          </div>
          <div class="meta-row">
            <i class="fa-solid fa-ticket" style="color:#10b981;"></i>
            <span>${priceText}</span>
          </div>
        </div>
        
        <p class="popup-desc">${desc || 'Spot wisata menarik di Pesisir Barat'}</p>
        
        <div class="popup-actions">
          <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="popup-btn gmaps-btn" title="Google Maps">
            <i class="fa-brands fa-google"></i> ${routeBtnText}
          </a>
          <a href="${destLink}" class="popup-btn book-btn" title="Lihat Destinasi">
            <i class="fa-solid fa-circle-info"></i> ${viewDetailText}
          </a>
        </div>
      </div>
    `
    marker.bindPopup(popupHtml, { 
      maxWidth: 320,
      autoPan: true,
      autoPanPadding: [20, 20],
      className: 'enhanced-popup-wrapper'
    })

    marker.on('click', () => {
      selectedSpotId.value = spot.id
    })

    markers.push(marker)
  })
}

const flyToSpot = (spot) => {
  selectedSpotId.value = spot.id
  if (mapInstance) {
    mapInstance.flyTo([spot.lat, spot.lng], 15, { duration: 1.2 })
    const targetMarker = markers.find(m => {
      const ll = m.getLatLng()
      return Math.abs(ll.lat - spot.lat) < 0.0001 && Math.abs(ll.lng - spot.lng) < 0.0001
    })
    if (targetMarker) {
      setTimeout(() => {
        targetMarker.openPopup()
      }, 1200)
    }
  }

  // Smooth scroll to map viewport on smaller screen sizes
  if (window.innerWidth <= 1024) {
    const mapWrapper = document.getElementById('mapViewportWrapper')
    if (mapWrapper) {
      mapWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }
}

const resetView = () => {
  if (mapInstance) {
    const isMobile = window.innerWidth <= 768
    mapInstance.flyTo([-5.24, 103.95], isMobile ? 10 : 11, { duration: 1.2 })
  }
}

const locateMe = () => {
  if (navigator.geolocation && mapInstance) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude
        const userLng = pos.coords.longitude
        mapInstance.flyTo([userLat, userLng], 14, { duration: 1.5 })
        const userIcon = L.divIcon({
          className: 'user-geo-marker',
          html: '<div style="background:#2563eb; width:18px; height:18px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 10px rgba(37,99,235,0.8);"></div>',
          iconSize: [20, 20]
        })
        L.marker([userLat, userLng], { icon: userIcon })
          .addTo(mapInstance)
          .bindPopup(langStore.isEn ? '<b>Your Current Location</b>' : '<b>Lokasi Anda</b>')
          .openPopup()
      },
      () => {
        alert(langStore.isEn ? 'Failed to get GPS location. Please check browser permissions.' : 'Gagal mendapatkan lokasi GPS. Pastikan izin lokasi diaktifkan di browser.')
      }
    )
  }
}

const handleResize = () => {
  if (mapInstance) {
    mapInstance.invalidateSize()
  }
}

// Watch filters or search query change to update markers
watch([() => selectedCategory.value, () => searchQuery.value], () => {
  renderMarkers()
})

// Watch language change to re-render markers with updated translations
watch(() => langStore.currentLang, () => {
  renderMarkers()
})

onMounted(async () => {
  await nextTick()
  initMap()
  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('orientationchange', handleResize)
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<style scoped>
.custom-map-popup h4 {
  font-size: 0.95rem;
  margin: 6px 0 4px;
  color: var(--color-deep-navy);
}
.custom-map-popup p {
  font-size: 0.8rem;
  color: var(--color-text-medium);
  margin-bottom: 6px;
  line-height: 1.3;
}
.popup-thumb {
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 6px;
}
</style>
