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
            <img class="brand-logo" src="/assets/images/logo-icon.svg" alt="Pesibar Wave" width="40" height="40" />
            <span class="auth-brand-name">Pesibar <span class="logo-accent">Wave</span></span>
          </div>
          <span class="auth-badge"><i class="fa-solid fa-shield-halved"></i> Portal Pengelola Pesibar Wave</span>
        </div>

        <div id="auth-login-box">
          <div class="auth-title-group">
            <h3>Masuk ke Akun Admin</h3>
            <p class="auth-subtitle">Kelola pemesanan, paket wisata & database Supabase</p>
          </div>

          <div class="auth-demo-box" @click="fillQuickCreds" style="cursor:pointer;" title="Klik untuk isi otomatis kredensial demo">
            <div class="demo-box-header">
              <span><i class="fa-solid fa-shield-halved"></i> Akun Pengelola (Demo)</span>
              <span class="demo-auto-pill" style="background: var(--color-ocean-blue);">
                <i class="fa-solid fa-bolt"></i> Isi Otomatis
              </span>
            </div>
            <div class="demo-box-creds" style="font-size:0.8rem; color:var(--color-text-medium);">
              Email: <strong>admin@pesibarwave.id</strong> | Password: <strong>pesisir2026</strong>
            </div>
          </div>

          <div class="admin-conn-chip" :class="supabaseConfigured ? 'is-ok' : 'is-warn'">
            <i :class="supabaseConfigured ? 'fa-solid fa-database' : 'fa-solid fa-plug-circle-xmark'"></i>
            <span v-if="supabaseConfigured">Supabase aktif — login memakai Supabase Auth agar data tersimpan permanen.</span>
            <span v-else>Supabase belum dikonfigurasi — dashboard berjalan dengan data lokal.</span>
          </div>

          <div v-if="!supabaseConfigured" class="auth-hint-box">
            <i class="fa-solid fa-circle-info"></i>
            <div>
              Tambahkan <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> pada <code>.env</code> (lokal) atau di menu <strong>Settings &rarr; Environment Variables</strong> Vercel (lalu lakukan redeploy).
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
                  placeholder="admin@pesibarwave.id atau email pengelola"
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
      <div v-if="mobileSidebarOpen" class="admin-sidebar-backdrop active" @click="mobileSidebarOpen = false"></div>

      <section class="admin-layout">
        <!-- Sidebar -->
        <aside class="admin-sidebar" :class="{ 'active': mobileSidebarOpen, 'mobile-open': mobileSidebarOpen }">
          <div class="admin-sidebar-header">
            <div class="admin-sidebar-logo">
              <div class="logo">
                <img class="brand-logo brand-logo--sm" src="/assets/images/logo-icon.svg" alt="Pesibar Wave" width="34" height="34" />
                <span>PW ADMIN</span>
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
            <div class="admin-live-status">
              <span class="dot" :class="supabaseConfigured ? 'dot--ok' : 'dot--warn'"></span>
              {{ supabaseConfigured ? 'Supabase' : 'Mode Lokal' }}
            </div>
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
                <span class="name">{{ authStore.user?.email || 'Administrator' }}</span>
                <span class="role">{{ authStore.isDemo ? 'Demo Lokal (read-only)' : 'Pengelola Resmi' }}</span>
              </div>
              <div class="admin-user-avatar">
                AD
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="admin-body">
            <div v-if="authStore.isDemo || !supabaseConfigured" class="admin-banner admin-banner--warn">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <div>
                <strong>Mode demo lokal aktif.</strong>
                <span v-if="!supabaseConfigured">
                  Supabase belum dikonfigurasi. Isi URL &amp; publishable key pada <code>.env</code> atau Vercel, jalankan
                  <code>supabase_schema.sql</code>, lalu login memakai akun Supabase Auth untuk menyimpan perubahan.
                </span>
                <span v-else>
                  Anda masuk dengan akun demo. Login memakai email admin yang terdaftar di Supabase Auth
                  (Authentication → Users) agar perubahan tersimpan ke database.
                </span>
              </div>
            </div>

            <div v-if="actionMessage" class="admin-banner" :class="`admin-banner--${actionType}`">
              <i :class="actionType === 'error' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check'"></i>
              <div>{{ actionMessage }}</div>
            </div>

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

              <!-- Supabase connection -->
              <div class="admin-data-card">
                <div class="admin-data-card-header">
                  <h3><i class="fa-solid fa-database" style="color:var(--color-turquoise);"></i> Status Koneksi Supabase</h3>
                  <button class="admin-mini-btn" :disabled="checkingConnection" @click="refreshConnection">
                    <i :class="checkingConnection ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-rotate'"></i>
                    Cek Ulang
                  </button>
                </div>
                <div class="conn-grid">
                  <div
                    v-for="(state, table) in connectionTables"
                    :key="table"
                    class="conn-item"
                    :class="state.ok ? 'is-ok' : 'is-bad'"
                  >
                    <span class="dot" :class="state.ok ? 'dot--ok' : 'dot--bad'"></span>
                    <div>
                      <strong>{{ table }}</strong>
                      <p>{{ state.ok ? 'Terhubung' : state.message }}</p>
                    </div>
                  </div>
                  <div class="conn-item" :class="connection.adminAccess?.ok ? 'is-ok' : 'is-bad'">
                    <span class="dot" :class="connection.adminAccess?.ok ? 'dot--ok' : 'dot--bad'"></span>
                    <div>
                      <strong>hak tulis admin</strong>
                      <p>{{ connection.adminAccess?.message || 'Belum diperiksa' }}</p>
                    </div>
                  </div>
                  <div class="conn-item" :class="connection.storage?.ok ? 'is-ok' : 'is-bad'">
                    <span class="dot" :class="connection.storage?.ok ? 'dot--ok' : 'dot--bad'"></span>
                    <div>
                      <strong>storage: media</strong>
                      <p>{{ connection.storage?.message || 'Belum diperiksa' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Visual Columns -->
              <div class="admin-data-columns">
                <div class="admin-data-card">
                  <div class="admin-data-card-header">
                    <h3>Grafik Tren Pemesanan Bulanan</h3>
                    <span class="badge badge-primary">{{ currentYear }}</span>
                  </div>
                  <div class="chart-sim-wrapper">
                    <div class="chart-bars">
                      <div v-for="bar in adminStore.monthlyStats" :key="bar.label" class="chart-bar-group">
                        <div
                          class="chart-bar-col"
                          :style="{ height: `${Math.max(bar.height, 3)}%` }"
                          :title="`${bar.count} pemesanan`"
                        ></div>
                        <span class="label">{{ bar.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Package Popularity -->
                <div class="admin-data-card">
                  <div class="admin-data-card-header">
                    <h3>Paket Terpopuler</h3>
                  </div>
                  <div class="pkg-pop-list">
                    <div v-for="(pkg, idx) in adminStore.packageStats" :key="pkg.name" class="pkg-pop-item">
                      <span class="pkg-rank">{{ idx + 1 }}.</span>
                      <div class="pkg-pop-info">
                        <span class="pkg-name">{{ pkg.name }}</span>
                        <span class="pkg-count">{{ pkg.count }} pemesanan</span>
                      </div>
                      <span class="badge" :class="idx === 0 ? 'badge-accent' : 'badge-primary'">{{ pkg.percent }}%</span>
                    </div>
                    <p v-if="!adminStore.packageStats.length" class="pkg-pop-empty">Belum ada data pemesanan.</p>
                  </div>
                </div>
              </div>

              <!-- Latest Bookings Table -->
              <div class="admin-data-card">
                <div class="admin-data-card-header">
                  <h3>Pemesanan Reservasi Terbaru</h3>
                  <button class="admin-mini-btn" @click="switchTab('pemesanan')">
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
                            {{ statusLabel(b.status) }}
                          </span>
                        </td>
                        <td>
                          <button
                            v-if="b.status !== 'confirmed'"
                            class="admin-mini-btn admin-mini-btn--ok"
                            style="margin-right:4px;"
                            :disabled="crudReadOnly"
                            :title="crudReadOnly ? 'Mode demo lokal (read-only)' : 'Konfirmasi'"
                            @click="changeStatus(b.code, 'confirmed')"
                          >
                            <i class="fa-solid fa-check"></i>
                          </button>
                          <button
                            v-if="b.status !== 'cancelled'"
                            class="admin-mini-btn"
                            :disabled="crudReadOnly"
                            :title="crudReadOnly ? 'Mode demo lokal (read-only)' : 'Batalkan'"
                            @click="changeStatus(b.code, 'cancelled')"
                          >
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </td>
                      </tr>
                      <tr v-if="!adminStore.bookings.length">
                        <td colspan="8" class="admin-empty-cell">
                          <i class="fa-solid fa-inbox"></i>
                          <p>Belum ada pemesanan pada tabel <code>bookings</code>.</p>
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
                    <button class="admin-mini-btn" @click="adminStore.fetchBookings()">
                      <i class="fa-solid fa-rotate"></i> Muat Ulang
                    </button>
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
                            {{ statusLabel(b.status) }}
                          </span>
                        </td>
                        <td>
                          <div style="display:flex; gap:6px;">
                            <button
                              class="admin-mini-btn admin-mini-btn--ok"
                              title="Konfirmasi Pesanan"
                              :disabled="crudReadOnly"
                              @click="changeStatus(b.code, 'confirmed')"
                            >
                              <i class="fa-solid fa-check"></i> Konfirmasi
                            </button>
                            <button
                              class="admin-mini-btn"
                              title="Batalkan Pesanan"
                              :disabled="crudReadOnly"
                              @click="changeStatus(b.code, 'cancelled')"
                            >
                              <i class="fa-solid fa-xmark"></i>
                            </button>
                            <button
                              class="admin-mini-btn admin-mini-btn--danger"
                              title="Hapus Data Booking"
                              :disabled="crudReadOnly"
                              @click="removeBooking(b.code)"
                            >
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="!adminStore.filteredBookings.length">
                        <td colspan="9" class="admin-empty-cell">
                          <i class="fa-solid fa-inbox"></i>
                          <p>Tidak ada booking yang cocok. {{ adminStore.lastError }}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- TAB: CRUD CONTENT (destinasi, peta, paket, pemandu, galeri, artikel, pengaturan) -->
            <div v-else class="admin-tab-content">
              <AdminCrudPanel
                v-if="activeEntity"
                :key="activeEntity.table"
                ref="crudPanel"
                :config="activeEntity"
                :read-only="crudReadOnly"
                :read-only-reason="crudReadOnlyReason"
                :upload-disabled="uploadDisabled"
                :upload-disabled-reason="uploadDisabledReason"
                @changed="handleEntityChanged"
              />
            </div>
          </div>
        </main>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAdminStore } from '@/stores/adminStore'
import { useDataStore } from '@/stores/dataStore'
import { isSupabaseConfigured } from '@/lib/supabase'
import { ADMIN_ENTITIES } from '@/config/adminEntities'
import AdminCrudPanel from '@/components/admin/AdminCrudPanel.vue'

const router = useRouter()
const authStore = useAuthStore()
const adminStore = useAdminStore()
const dataStore = useDataStore()

const supabaseConfigured = isSupabaseConfigured
const currentTab = ref('dashboard')
const mobileSidebarOpen = ref(false)
const crudPanel = ref(null)
const checkingConnection = ref(false)

const loginUsername = ref('')
const loginPassword = ref('')
const showPassword = ref(false)
const loginError = ref('')
const isLoggingIn = ref(false)

const actionMessage = ref('')
const actionType = ref('success')

const currentYear = new Date().getFullYear()

const navTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
  { id: 'destinasi', label: 'Destinasi', icon: 'fa-solid fa-map-location-dot' },
  { id: 'peta', label: 'Titik Peta', icon: 'fa-solid fa-location-dot' },
  { id: 'paket', label: 'Paket Wisata', icon: 'fa-solid fa-suitcase' },
  { id: 'pemandu', label: 'Jasa Pemandu', icon: 'fa-solid fa-user-ninja' },
  { id: 'galeri', label: 'Galeri', icon: 'fa-solid fa-images' },
  { id: 'artikel', label: 'Artikel', icon: 'fa-solid fa-newspaper' },
  { id: 'pemesanan', label: 'Pemesanan', icon: 'fa-solid fa-clipboard-list' },
  { id: 'pengaturan', label: 'Pengaturan', icon: 'fa-solid fa-gear' }
]

const activeTabTitle = computed(() => {
  const t = navTabs.find((tab) => tab.id === currentTab.value)
  return t ? t.label : 'Dashboard'
})

const activeEntity = computed(() => ADMIN_ENTITIES[currentTab.value] || null)

// Real database writes require a Supabase Auth session (RLS = admins only).
const crudReadOnly = computed(() => !supabaseConfigured || !authStore.isSupabaseSession)
const crudReadOnlyReason = computed(() =>
  !supabaseConfigured
    ? 'Supabase belum dikonfigurasi. Data ditampilkan dari fallback lokal.'
    : 'Anda login dengan akun demo. Logout lalu masuk memakai akun Supabase Auth (email terdaftar di tabel admins) untuk menyimpan perubahan.'
)
const uploadDisabled = computed(() => !supabaseConfigured || !authStore.isSupabaseSession)
const uploadDisabledReason = computed(() =>
  !supabaseConfigured
    ? 'Upload gambar membutuhkan Supabase Storage (bucket "media").'
    : 'Upload butuh login admin Supabase Auth.'
)

const connection = computed(() => adminStore.connection)
const connectionTables = computed(() => {
  const tables = adminStore.connection.database || {}
  if (!Object.keys(tables).length) {
    return {
      supabase: {
        ok: supabaseConfigured,
        message: supabaseConfigured ? 'Klik "Cek Ulang" untuk memeriksa tabel.' : 'Supabase belum dikonfigurasi.'
      }
    }
  }
  return tables
})

const showMessage = (message, type = 'success') => {
  actionMessage.value = message
  actionType.value = type
  window.setTimeout(() => {
    if (actionMessage.value === message) actionMessage.value = ''
  }, 6000)
}

const fillQuickCreds = () => {
  loginUsername.value = 'admin@pesibarwave.id'
  loginPassword.value = 'pesisir2026'
}

const handleLogin = async () => {
  isLoggingIn.value = true
  loginError.value = ''
  try {
    const res = await authStore.loginAdmin(loginUsername.value, loginPassword.value)
    if (!res.success) {
      loginError.value = res.message || 'Kredensial tidak valid!'
      return
    }
    if (res.warning) showMessage(res.warning, 'warn')
    await Promise.all([
      adminStore.fetchBookings(),
      adminStore.refreshConnection(),
      dataStore.fetchAllData({ allowEmpty: true })
    ])
    adminStore.subscribeRealtime()
  } catch (err) {
    loginError.value = err.message
  } finally {
    isLoggingIn.value = false
  }
}

const handleLogout = async () => {
  adminStore.unsubscribeRealtime()
  await authStore.logoutAdmin()
  router.push('/')
}

const switchTab = (tabId) => {
  currentTab.value = tabId
  mobileSidebarOpen.value = false
}

const refreshConnection = async () => {
  checkingConnection.value = true
  try {
    await adminStore.refreshConnection()
  } finally {
    checkingConnection.value = false
  }
}

const changeStatus = async (code, status) => {
  const res = await adminStore.updateStatus(code, status)
  if (res.success) {
    showMessage(`Status ${code} diubah menjadi ${statusLabel(status)}.`, 'success')
  } else {
    showMessage(res.message || 'Gagal memperbarui status.', 'error')
  }
}

const removeBooking = async (code) => {
  if (!window.confirm(`Hapus booking ${code}? Tindakan ini permanen.`)) return
  const res = await adminStore.deleteBooking(code)
  if (res.success) showMessage(`Booking ${code} dihapus.`, 'success')
  else showMessage(res.message || 'Gagal menghapus booking.', 'error')
}

const handleEntityChanged = async () => {
  await dataStore.refresh()
  showMessage('Perubahan tersimpan dan data publik diperbarui.', 'success')
}

const statusLabel = (status) => {
  if (status === 'confirmed') return 'Dikonfirmasi'
  if (status === 'pending') return 'Pending'
  if (status === 'cancelled') return 'Dibatalkan'
  return status || '-'
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
    await Promise.all([
      adminStore.fetchBookings(),
      adminStore.refreshConnection()
    ])
    adminStore.subscribeRealtime()
  }
})

onBeforeUnmount(() => {
  adminStore.unsubscribeRealtime()
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

.auth-hint-box {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  background: #f1f7fb;
  border: 1px solid #d7e9f3;
  color: #0f4c63;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  font-size: 0.78rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.admin-conn-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  margin-bottom: 0.9rem;
}
.admin-conn-chip.is-ok {
  background: #ecfdf5;
  color: #047857;
}
.admin-conn-chip.is-warn {
  background: #fffbeb;
  color: #b45309;
}

.admin-live-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  padding: 0 0.25rem 0.6rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.dot--ok {
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18);
}
.dot--warn {
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18);
}
.dot--bad {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.admin-banner {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  line-height: 1.55;
  margin-bottom: 1rem;
}
.admin-banner strong {
  margin-right: 0.3rem;
}
.admin-banner--warn {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
}
.admin-banner--success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}
.admin-banner--error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.admin-mini-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-deep-navy);
  border-radius: 8px;
  padding: 0.35rem 0.65rem;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.admin-mini-btn:hover {
  border-color: var(--color-turquoise);
  color: var(--color-ocean-blue);
}
.admin-mini-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.admin-mini-btn--ok {
  border-color: #a7f3d0;
  color: #047857;
  background: #ecfdf5;
}
.admin-mini-btn--danger {
  border-color: #fecaca;
  color: #b91c1c;
  background: #fef2f2;
}

.conn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.65rem;
  padding: 1.25rem 1.5rem;
}
.conn-item {
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 0.6rem 0.7rem;
  background: #fbfdff;
}
.conn-item strong {
  font-size: 0.78rem;
  color: var(--color-deep-navy);
  display: block;
}
.conn-item p {
  margin: 0.1rem 0 0;
  font-size: 0.68rem;
  color: var(--color-text-light);
  line-height: 1.4;
  word-break: break-word;
}
.conn-item .dot {
  margin-top: 4px;
}

.pkg-pop-list {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.pkg-pop-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.pkg-rank {
  font-weight: 700;
  color: var(--color-ocean-blue);
  font-size: 1.05rem;
  width: 20px;
}
.pkg-pop-info {
  flex: 1;
  min-width: 0;
}
.pkg-name {
  display: block;
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--color-deep-navy);
}
.pkg-count {
  font-size: 0.75rem;
  color: var(--color-text-light);
}
.pkg-pop-empty {
  font-size: 0.82rem;
  color: var(--color-text-light);
  margin: 0;
}

.admin-empty-cell {
  text-align: center;
  padding: 2.5rem 1rem !important;
  color: var(--color-text-light);
}
.admin-empty-cell i {
  font-size: 1.6rem;
  display: block;
  margin-bottom: 0.5rem;
}
.admin-empty-cell p {
  margin: 0;
  font-size: 0.82rem;
}
</style>
