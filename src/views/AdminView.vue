<template>
  <div class="admin-view-root">
    <!-- 1. LOGIN / AUTH VIEW (WHEN NOT LOGGED IN) -->
    <div v-if="!authStore.isAdmin" class="auth-centered-wrapper">
      <router-link to="/" class="auth-floating-back" title="Kembali ke Beranda">
        <i class="fa-solid fa-arrow-left"></i> <span>Kembali ke Beranda</span>
      </router-link>

      <div class="auth-card">
        <!-- Card Header -->
        <div class="auth-card-header">
          <div class="auth-brand-logo">
            <div class="logo-icon-box">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 14.5c2.3 0 3.3-1.8 5.5-1.8s3.2 1.8 5.5 1.8M2.5 17.5c2.3 0 3.3-1.8 5.5-1.8s3.2 1.8 5.5 1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
                <path d="M12 3v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 8c1.5-1.5 4-2 6-1.5m-6 1.5c-1.5-1.5-4-2-6-1.5m6 1.5c1.5 1.5 2 4 1.5 6m-1.5-6c-1.5 1.5-2 4-1.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
              </svg>
            </div>
            <span class="auth-brand-name">EXPLORE PESISIR BARAT</span>
          </div>
          <span class="auth-badge"><i class="fa-solid fa-shield-halved"></i> Portal Pengelola & Admin</span>
        </div>

        <div id="auth-login-box">
          <div class="auth-title-group">
            <h3>Masuk ke Akun Admin</h3>
            <p class="auth-subtitle">Kelola pemesanan, paket wisata & database Supabase</p>
          </div>

          <div class="auth-demo-box" @click="fillQuickCreds" style="cursor:pointer;" title="Klik untuk isi otomatis kredensial pengelola">
            <div class="demo-box-header">
              <span><i class="fa-solid fa-shield-halved"></i> Akun Pengelola (Demo / Bypass)</span>
              <span class="demo-auto-pill" style="background: var(--color-ocean-blue);">
                <i class="fa-solid fa-bolt"></i> Isi Otomatis
              </span>
            </div>
            <div class="demo-box-creds" style="font-size:0.8rem; color:var(--color-text-medium);">
              Username: <strong>admin</strong> | Password: <strong>pesisir2026</strong>
            </div>
          </div>

          <div v-if="loginError" class="auth-toast-error">
            <i class="fa-solid fa-triangle-exclamation"></i> {{ loginError }}
          </div>

          <form @submit.prevent="handleLogin">
            <div class="form-group" style="margin-bottom: 1.15rem;">
              <label for="login-email"><i class="fa-solid fa-envelope"></i> Username atau Email</label>
              <div class="input-icon-wrapper">
                <input
                  type="text"
                  id="login-email"
                  class="form-control"
                  v-model="loginUsername"
                  placeholder="admin atau email pengelola"
                  required
                >
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1.15rem;">
              <label for="login-password"><i class="fa-solid fa-lock"></i> Kata Sandi</label>
              <div class="input-icon-wrapper" style="position:relative;">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="login-password"
                  class="form-control"
                  v-model="loginPassword"
                  placeholder="Masukkan kata sandi"
                  required
                >
                <button
                  type="button"
                  class="btn-toggle-pwd"
                  style="position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer;"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-auth-submit" :disabled="isLoggingIn">
              <span v-if="isLoggingIn"><i class="fa-solid fa-spinner fa-spin"></i> Masuk...</span>
              <span v-else><i class="fa-solid fa-right-to-bracket"></i> Masuk Ke Dashboard Admin</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- 2. ADMIN DASHBOARD (WHEN LOGGED IN) -->
    <div v-else class="admin-dashboard-container">
      <div v-if="mobileSidebarOpen" class="admin-sidebar-backdrop" @click="mobileSidebarOpen = false"></div>

      <section class="admin-layout">
        <!-- Sidebar -->
        <aside class="admin-sidebar" :class="{ 'mobile-open': mobileSidebarOpen }">
          <div class="admin-sidebar-header">
            <div class="admin-sidebar-logo">
              <div class="logo">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 14.5c2.3 0 3.3-1.8 5.5-1.8s3.2 1.8 5.5 1.8M2.5 17.5c2.3 0 3.3-1.8 5.5-1.8s3.2 1.8 5.5 1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
                  <path d="M12 3v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M12 8c1.5-1.5 4-2 6-1.5m-6 1.5c-1.5-1.5-4-2-6-1.5m6 1.5c1.5 1.5 2 4 1.5 6m-1.5-6c-1.5 1.5-2 4-1.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                </svg>
                <span>ADMIN EPB</span>
              </div>
            </div>
            <button class="admin-sidebar-close" @click="mobileSidebarOpen = false" aria-label="Tutup Menu">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <nav style="flex-grow: 1;">
            <ul class="admin-nav">
              <li
                v-for="tab in navTabs"
                :key="tab.id"
                class="admin-nav-item"
                :class="{ active: currentTab === tab.id }"
                @click="switchTab(tab.id)"
              >
                <a href="#admin" @click.prevent="switchTab(tab.id)">
                  <i :class="tab.icon"></i> {{ tab.label }}
                  <span v-if="tab.id === 'pemesanan'" class="badge badge-accent" style="font-size:0.6rem; padding:1px 5px; margin-left:auto;">
                    {{ adminStore.bookings.length }}
                  </span>
                </a>
              </li>
            </ul>
          </nav>

          <div class="admin-sidebar-footer">
            <button class="admin-logout-btn" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i> Keluar Admin
            </button>
          </div>
        </aside>

        <!-- Right Content Area -->
        <main class="admin-main">
          <!-- Topbar -->
          <div class="admin-topbar">
            <div class="admin-topbar-left">
              <button class="admin-menu-toggle" @click="mobileSidebarOpen = true" title="Menu Navigasi">
                <i class="fa-solid fa-bars"></i>
              </button>
              <div class="admin-title-area">
                <h2>{{ activeTabTitle }}</h2>
                <p>Terhubung ke Database Supabase & State Real-time.</p>
              </div>
            </div>

            <div class="admin-user-profile">
              <div class="admin-user-info">
                <span class="name">Administrator</span>
                <span class="role">Pengelola Resmi</span>
              </div>
              <div class="admin-user-avatar">
                AD
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="admin-body">
            <!-- TAB: DASHBOARD OVERVIEW -->
            <div v-if="currentTab === 'dashboard'" class="admin-tab-content">
              <!-- KPI Stats Row -->
              <div class="admin-stats-grid">
                <div class="stat-widget-card">
                  <div class="stat-widget-info">
                    <span class="label">Total Pemesanan</span>
                    <span class="val">{{ adminStore.stats.totalBookings }}</span>
                  </div>
                  <div class="stat-widget-icon"><i class="fa-solid fa-clipboard-list"></i></div>
                </div>

                <div class="stat-widget-card">
                  <div class="stat-widget-info">
                    <span class="label">Menunggu Konfirmasi</span>
                    <span class="val">{{ adminStore.stats.pending }}</span>
                  </div>
                  <div class="stat-widget-icon" style="color:var(--color-sunset-orange);"><i class="fa-solid fa-clock"></i></div>
                </div>

                <div class="stat-widget-card">
                  <div class="stat-widget-info">
                    <span class="label">Terkonfirmasi</span>
                    <span class="val">{{ adminStore.stats.confirmed }}</span>
                  </div>
                  <div class="stat-widget-icon" style="color:var(--color-success);"><i class="fa-solid fa-circle-check"></i></div>
                </div>

                <div class="stat-widget-card">
                  <div class="stat-widget-info">
                    <span class="label">Total Estimasi Omset</span>
                    <span class="val">{{ formatPrice(adminStore.stats.revenue) }}</span>
                  </div>
                  <div class="stat-widget-icon"><i class="fa-solid fa-wallet"></i></div>
                </div>
              </div>

              <!-- Visual Columns -->
              <div class="admin-data-columns">
                <!-- Monthly chart simulation -->
                <div class="admin-data-card">
                  <div class="admin-data-card-header">
                    <h3>Grafik Tren Pemesanan Bulanan</h3>
                    <span class="badge badge-primary">Tahun 2026</span>
                  </div>
                  <div class="chart-sim-wrapper">
                    <div class="chart-bars">
                      <div class="chart-bar-group">
                        <div class="chart-bar-col" style="height: 40%;"></div>
                        <span class="label">Mar</span>
                      </div>
                      <div class="chart-bar-group">
                        <div class="chart-bar-col" style="height: 60%;"></div>
                        <span class="label">Apr</span>
                      </div>
                      <div class="chart-bar-group">
                        <div class="chart-bar-col" style="height: 85%;"></div>
                        <span class="label">Mei</span>
                      </div>
                      <div class="chart-bar-group">
                        <div class="chart-bar-col" style="height: 100%;"></div>
                        <span class="label">Jun</span>
                      </div>
                      <div class="chart-bar-group">
                        <div class="chart-bar-col" style="height: 70%;"></div>
                        <span class="label">Jul</span>
                      </div>
                      <div class="chart-bar-group">
                        <div class="chart-bar-col" style="height: 50%;"></div>
                        <span class="label">Agt</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Package Popularity -->
                <div class="admin-data-card">
                  <div class="admin-data-card-header">
                    <h3>Paket Terpopuler</h3>
                  </div>
                  <div style="padding: 1.5rem; display:flex; flex-direction:column; gap:1.25rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div style="display:flex; align-items:center; gap:0.75rem;">
                        <span style="font-weight:700; color:var(--color-ocean-blue); font-size:1.1rem; width:20px;">1.</span>
                        <div>
                          <span style="font-weight:700; font-size:0.9rem; color:var(--color-deep-navy); display:block;">Paket Surfing Adventure</span>
                          <span style="font-size:0.8rem; color:var(--color-text-light);">3 Hari 2 Malam</span>
                        </div>
                      </div>
                      <span class="badge badge-accent">54% Bookings</span>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div style="display:flex; align-items:center; gap:0.75rem;">
                        <span style="font-weight:700; color:var(--color-ocean-blue); font-size:1.1rem; width:20px;">2.</span>
                        <div>
                          <span style="font-weight:700; font-size:0.9rem; color:var(--color-deep-navy); display:block;">Paket Explore Krui</span>
                          <span style="font-size:0.8rem; color:var(--color-text-light);">2 Hari 1 Malam</span>
                        </div>
                      </div>
                      <span class="badge badge-primary">26% Bookings</span>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div style="display:flex; align-items:center; gap:0.75rem;">
                        <span style="font-weight:700; color:var(--color-ocean-blue); font-size:1.1rem; width:20px;">3.</span>
                        <div>
                          <span style="font-weight:700; font-size:0.9rem; color:var(--color-deep-navy); display:block;">Paket Sunset & Culture</span>
                          <span style="font-size:0.8rem; color:var(--color-text-light);">Full Day Tour</span>
                        </div>
                      </div>
                      <span class="badge badge-primary">12% Bookings</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Latest Bookings Table -->
              <div class="admin-data-card">
                <div class="admin-data-card-header">
                  <h3>Pemesanan Reservasi Terbaru</h3>
                  <button class="btn btn-secondary btn-sm" @click="currentTab = 'pemesanan'">
                    Lihat Semua Pemesanan
                  </button>
                </div>
                <div class="table-responsive">
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>Kode</th>
                        <th>Nama Pemesan</th>
                        <th>Paket Wisata</th>
                        <th>Tanggal</th>
                        <th>Pax</th>
                        <th>Total Biaya</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="b in adminStore.bookings.slice(0, 5)" :key="b.code">
                        <td><strong>{{ b.code }}</strong></td>
                        <td>{{ b.name }}</td>
                        <td>{{ b.package_name || b.packageName }}</td>
                        <td>{{ b.visit_date || b.date }}</td>
                        <td>{{ b.guests }} org</td>
                        <td>{{ formatPrice(b.total) }}</td>
                        <td>
                          <span
                            class="badge"
                            :class="{
                              'badge-accent': b.status === 'confirmed',
                              'badge-primary': b.status === 'pending',
                              'badge-danger': b.status === 'cancelled'
                            }"
                          >
                            {{ b.status === 'confirmed' ? 'Dikonfirmasi' : b.status === 'pending' ? 'Pending' : 'Dibatalkan' }}
                          </span>
                        </td>
                        <td>
                          <button
                            v-if="b.status !== 'confirmed'"
                            class="btn btn-primary btn-xs"
                            style="margin-right:4px;"
                            @click="adminStore.updateStatus(b.code, 'confirmed')"
                          >
                            <i class="fa-solid fa-check"></i>
                          </button>
                          <button
                            v-if="b.status !== 'cancelled'"
                            class="btn btn-secondary btn-xs"
                            @click="adminStore.updateStatus(b.code, 'cancelled')"
                          >
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- TAB: PEMESANAN (FULL LIST & ACTIONS) -->
            <div v-else-if="currentTab === 'pemesanan'" class="admin-tab-content">
              <div class="admin-data-card">
                <div class="admin-data-card-header" style="flex-wrap:wrap; gap:1rem;">
                  <h3>Seluruh Data Booking Masuk</h3>
                  <div style="display:flex; gap:0.5rem; align-items:center;">
                    <input
                      type="text"
                      class="form-control"
                      style="padding:0.4rem 0.75rem; font-size:0.85rem; width:200px;"
                      v-model="adminStore.searchQuery"
                      placeholder="Cari nama / kode..."
                    >
                    <select
                      class="form-control"
                      style="padding:0.4rem 0.75rem; font-size:0.85rem; width:140px;"
                      v-model="adminStore.filterStatus"
                    >
                      <option value="all">Semua Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Dikonfirmasi</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>Kode</th>
                        <th>Nama Pemesan</th>
                        <th>WhatsApp</th>
                        <th>Layanan Paket</th>
                        <th>Tanggal Wisata</th>
                        <th>Pax</th>
                        <th>Total Biaya</th>
                        <th>Status Booking</th>
                        <th>Tindakan Operasional</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="b in adminStore.filteredBookings" :key="b.code">
                        <td><strong>{{ b.code }}</strong></td>
                        <td>{{ b.name }}</td>
                        <td>{{ b.phone }}</td>
                        <td>{{ b.package_name || b.packageName }}</td>
                        <td>{{ b.visit_date || b.date }}</td>
                        <td>{{ b.guests }} org</td>
                        <td>{{ formatPrice(b.total) }}</td>
                        <td>
                          <span
                            class="badge"
                            :class="{
                              'badge-accent': b.status === 'confirmed',
                              'badge-primary': b.status === 'pending',
                              'badge-danger': b.status === 'cancelled'
                            }"
                          >
                            {{ b.status === 'confirmed' ? 'Dikonfirmasi' : b.status === 'pending' ? 'Pending' : 'Dibatalkan' }}
                          </span>
                        </td>
                        <td>
                          <div style="display:flex; gap:6px;">
                            <button
                              class="btn btn-primary btn-xs"
                              title="Konfirmasi Pesanan"
                              @click="adminStore.updateStatus(b.code, 'confirmed')"
                            >
                              <i class="fa-solid fa-check"></i> Konfirmasi
                            </button>
                            <button
                              class="btn btn-secondary btn-xs"
                              title="Batalkan Pesanan"
                              @click="adminStore.updateStatus(b.code, 'cancelled')"
                            >
                              <i class="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- TAB: DESTINASI / PAKET / PENGATURAN -->
            <div v-else class="admin-tab-content">
              <div class="admin-data-card" style="padding: 2.5rem; text-align: center;">
                <i :class="activeTabIcon" style="font-size:3.5rem; color:var(--color-turquoise); margin-bottom:1.5rem;"></i>
                <h3 style="font-size:1.5rem; color:var(--color-deep-navy); margin-bottom:0.5rem;">{{ activeTabTitle }}</h3>
                <p style="color:var(--color-text-medium); margin-bottom:1.5rem; max-width:500px; margin-left:auto; margin-right:auto;">
                  Modul ini terhubung ke tabel Supabase PostgreSQL (<code>{{ currentTab }}</code>) untuk pembaruan data secara real-time.
                </p>
                <button class="btn btn-primary" @click="currentTab = 'dashboard'">
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAdminStore } from '@/stores/adminStore'

const router = useRouter()
const authStore = useAuthStore()
const adminStore = useAdminStore()

const currentTab = ref('dashboard')
const mobileSidebarOpen = ref(false)

const loginUsername = ref('')
const loginPassword = ref('')
const showPassword = ref(false)
const loginError = ref('')
const isLoggingIn = ref(false)

const navTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
  { id: 'destinasi', label: 'Destinasi', icon: 'fa-solid fa-map-location-dot' },
  { id: 'paket', label: 'Paket Wisata', icon: 'fa-solid fa-suitcase' },
  { id: 'pemandu', label: 'Jasa Pemandu', icon: 'fa-solid fa-user-ninja' },
  { id: 'galeri', label: 'Galeri', icon: 'fa-solid fa-images' },
  { id: 'artikel', label: 'Artikel', icon: 'fa-solid fa-newspaper' },
  { id: 'pemesanan', label: 'Pemesanan', icon: 'fa-solid fa-clipboard-list' },
  { id: 'pengaturan', label: 'Pengaturan', icon: 'fa-solid fa-gear' }
]

const activeTabTitle = computed(() => {
  const t = navTabs.find(tab => tab.id === currentTab.value)
  return t ? t.label : 'Dashboard'
})

const activeTabIcon = computed(() => {
  const t = navTabs.find(tab => tab.id === currentTab.value)
  return t ? t.icon : 'fa-solid fa-chart-line'
})

const fillQuickCreds = () => {
  loginUsername.value = 'admin'
  loginPassword.value = 'pesisir2026'
}

const handleLogin = async () => {
  isLoggingIn.value = true
  loginError.value = ''
  try {
    const res = await authStore.loginAdmin(loginUsername.value, loginPassword.value)
    if (!res.success) {
      loginError.value = res.message || 'Kredensial tidak valid!'
    } else {
      await adminStore.fetchBookings()
    }
  } catch (err) {
    loginError.value = err.message
  } finally {
    isLoggingIn.value = false
  }
}

const handleLogout = async () => {
  await authStore.logoutAdmin()
  router.push('/')
}

const switchTab = (tabId) => {
  currentTab.value = tabId
  mobileSidebarOpen.value = false
}

const formatPrice = (p) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(p || 0)
}

onMounted(async () => {
  await authStore.initAuth()
  if (authStore.isAdmin) {
    await adminStore.fetchBookings()
  }
})
</script>

<style scoped>
.auth-toast-error {
  background: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  font-weight: 500;
}
</style>
