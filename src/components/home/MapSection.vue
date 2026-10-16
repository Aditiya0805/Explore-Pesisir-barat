<template>
  <section class="section-padding map-section" id="peta">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-primary"><i class="fa-solid fa-earth-asia"></i> Eksplorasi Interaktif 3D</span>
        <h2>Peta Wisata 3D & Navigasi Real-Time</h2>
        <p>Jelajahi titik-titik spot wisata eksotis di seluruh Pesisir Barat. Terhubung langsung dengan Google Maps untuk panduan rute akurat dan navigasi GPS secara real-time.</p>
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
                title="Tampilan Satelit Real"
                @click="switchLayer('sat')"
              >
                <i class="fa-solid fa-satellite"></i> <span>Satelit</span>
              </button>
              <button
                class="map-control-btn"
                :class="{ active: currentLayer === 'street' }"
                id="btnLayerStreet"
                title="Tampilan Peta Topografi"
                @click="switchLayer('street')"
              >
                <i class="fa-solid fa-map"></i> <span>Topografi</span>
              </button>
              <button
                class="map-control-btn"
                :class="{ active: currentLayer === 'dark' }"
                id="btnLayerDark"
                title="Mode Malam"
                @click="switchLayer('dark')"
              >
                <i class="fa-solid fa-moon"></i> <span>Malam</span>
              </button>
            </div>

            <div class="map-quick-actions">
              <button
                class="map-control-btn btn-tilt"
                :class="{ active: is3DTilt }"
                id="btnToggle3D"
                title="Toggle Perspektif 3D Tilt"
                @click="is3DTilt = !is3DTilt"
              >
                <i class="fa-solid fa-cube"></i> <span>{{ is3DTilt ? 'Normal' : 'Tilt 3D' }}</span>
              </button>
              <button
                class="map-control-btn btn-geo"
                id="btnMyLocation"
                title="Lacak Posisi Saya Sekarang"
                @click="locateMe"
              >
                <i class="fa-solid fa-location-crosshairs"></i> <span>Lokasi Saya</span>
              </button>
              <button
                class="map-control-btn btn-reset"
                id="btnResetMap"
                title="Kembali ke Tampilan Utama"
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
              <span class="legend-item"><span class="legend-dot dot-surf"></span> Surfing</span>
              <span class="legend-item"><span class="legend-dot dot-beach"></span> Pantai</span>
              <span class="legend-item"><span class="legend-dot dot-nature"></span> Air Terjun</span>
              <span class="legend-item"><span class="legend-dot dot-culture"></span> Budaya</span>
              <span class="legend-item"><span class="legend-dot dot-landmark"></span> Bukit</span>
              <span class="legend-item"><span class="legend-dot dot-island"></span> Pulau</span>
              <span class="legend-item"><span class="legend-dot dot-culinary"></span> Kuliner</span>
              <span class="legend-item"><span class="legend-dot dot-conservation"></span> Konservasi</span>
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
                  placeholder="Cari nama spot wisata..."
                >
              </div>
              <div class="sidebar-meta-row">
                <span id="spotCountBadge" class="badge badge-accent">{{ filteredSpots.length }} Titik Wisata Ditemukan</span>
                <span class="sidebar-hint"><i class="fa-solid fa-hand-pointer"></i> Klik spot untuk fly-to</span>
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
                  <span class="spot-category-tag">{{ spot.category_label || spot.categoryLabel || spot.category }}</span>
                </div>
                <div class="spot-item-details">
                  <h4 class="spot-item-title">{{ spot.name }}</h4>
                  <div class="spot-item-meta">
                    <span class="spot-rating"><i class="fa-solid fa-star"></i> {{ spot.rating }}</span>
                    <span class="spot-price"><i class="fa-solid fa-ticket"></i> {{ spot.price }}</span>
                  </div>
                  <p class="spot-item-desc">{{ spot.description || spot.desc }}</p>
                  <div class="spot-actions">
                    <a
                      :href="spot.gmaps_dir_url || spot.gmapsDirUrl || ('https://www.google.com/maps/dir/?api=1&destination=' + spot.lat + ',' + spot.lng)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-secondary btn-xs"
                      @click.stop
                    >
                      <i class="fa-solid fa-diamond-turn-right"></i> Petunjuk Arah
                    </a>
                    <button class="btn btn-primary btn-xs" @click.stop="flyToSpot(spot)">
                      <i class="fa-solid fa-crosshairs"></i> Lihat di Peta
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
              <h4>Terhubung Langsung dengan Google Maps (GPS Real-Time)</h4>
              <p>Akses rute perjalanan, jarak tempuh, serta estimasi waktu lalu lintas langsung dari lokasi Anda saat ini menuju berbagai titik wisata di Pesisir Barat.</p>
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
              <i class="fa-solid fa-diamond-turn-right"></i> Petunjuk Rute ke Titik Pusat
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import { useDataStore } from '@/stores/dataStore'

const dataStore = useDataStore()

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

const categories = [
  { id: 'all', label: 'Semua Spot', icon: 'fa-solid fa-layer-group' },
  { id: 'surfing', label: 'Surfing', icon: 'fa-solid fa-water' },
  { id: 'beach', label: 'Pantai', icon: 'fa-solid fa-umbrella-beach' },
  { id: 'nature', label: 'Alam & Curug', icon: 'fa-solid fa-tree' },
  { id: 'culture', label: 'Budaya', icon: 'fa-solid fa-landmark' },
  { id: 'landmark', label: 'Landmark', icon: 'fa-solid fa-mountain-sun' },
  { id: 'island', label: 'Pulau', icon: 'fa-solid fa-sailboat' },
  { id: 'culinary', label: 'Kuliner', icon: 'fa-solid fa-utensils' },
  { id: 'conservation', label: 'Konservasi', icon: 'fa-solid fa-shield-halved' }
]

const getCategoryCount = (catId) => {
  if (catId === 'all') return dataStore.mapLocations.length
  return dataStore.mapLocations.filter(loc => loc.category === catId).length
}

const filteredSpots = computed(() => {
  return dataStore.mapLocations.filter(spot => {
    const matchCat = selectedCategory.value === 'all' || spot.category === selectedCategory.value
    const query = searchQuery.value.toLowerCase()
    const matchQuery = !query || spot.name.toLowerCase().includes(query) || (spot.description && spot.description.toLowerCase().includes(query))
    return matchCat && matchQuery
  })
})

const setCategory = (catId) => {
  selectedCategory.value = catId
  renderMarkers()
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

  // Center on Krui / Tanjung Setia
  mapInstance = L.map(mapContainerRef.value, {
    center: [-5.27, 103.95],
    zoom: 11,
    zoomControl: true
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
        <div class="marker-label">${spot.name.substring(0, 20)}</div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [56, 70],
    iconAnchor: [28, 70],
    popupAnchor: [0, -70]
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

    const popupHtml = `
      <div class="enhanced-map-popup">
        <img src="${spot.img || '/assets/images/pantai-karang-nyimbor.jpg'}" alt="${spot.name}" class="popup-thumb" />
        
        <div class="popup-header">
          <h4>${spot.name}</h4>
          <span class="popup-category">${spot.category_label || spot.categoryLabel || spot.category}</span>
        </div>
        
        <div class="popup-meta">
          <div class="meta-row">
            <i class="fa-solid fa-star" style="color:#f59e0b;"></i>
            <span>${spot.rating || '4.8 ★'}</span>
          </div>
          <div class="meta-row">
            <i class="fa-solid fa-location-dot" style="color:#06b6d4;"></i>
            <span>${spot.location || 'Pesisir Barat'}</span>
          </div>
          <div class="meta-row">
            <i class="fa-solid fa-tag" style="color:#8b5cf6;"></i>
            <span>${spot.price ? (spot.price === 'Gratis' ? 'Gratis' : 'Rp ' + spot.price.toLocaleString('id-ID')) : 'Hubungi'}</span>
          </div>
        </div>
        
        <p class="popup-desc">${spot.description || spot.desc || 'Spot wisata menarik di Pesisir Barat'}</p>
        
        <div class="popup-actions">
          <a href="${gmapsUrl}" target="_blank" class="popup-btn gmaps-btn" title="Buka di Google Maps">
            <i class="fa-brands fa-google"></i> Arah
          </a>
          <button class="popup-btn book-btn" onclick="document.querySelector('[href=\\'/booking\\']')?.click()" title="Pesan Sekarang">
            <i class="fa-solid fa-calendar-check"></i> Pesan
          </button>
        </div>
      </div>
    `
    marker.bindPopup(popupHtml, { 
      maxWidth: 300,
      className: 'enhanced-popup-wrapper'
    })
    markers.push(marker)
  })
}

const flyToSpot = (spot) => {
  selectedSpotId.value = spot.id
  if (mapInstance) {
    mapInstance.flyTo([spot.lat, spot.lng], 15, { duration: 1.5 })
    const targetMarker = markers.find(m => {
      const ll = m.getLatLng()
      return Math.abs(ll.lat - spot.lat) < 0.0001 && Math.abs(ll.lng - spot.lng) < 0.0001
    })
    if (targetMarker) {
      setTimeout(() => {
        targetMarker.openPopup()
      }, 1500)
    }
  }
}

const resetView = () => {
  if (mapInstance) {
    mapInstance.flyTo([-5.27, 103.95], 11, { duration: 1.2 })
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
          .bindPopup('<b>Lokasi Anda</b>')
          .openPopup()
      },
      () => {
        alert('Gagal mendapatkan lokasi GPS. Pastikan izin lokasi diaktifkan di browser.')
      }
    )
  }
}

onMounted(async () => {
  await nextTick()
  initMap()
})

onUnmounted(() => {
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
