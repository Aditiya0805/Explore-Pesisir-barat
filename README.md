# Explore Pesisir Barat 🏄‍♂️🌊
**Portal Pariwisata & Sistem Reservasi Terpadu Kabupaten Pesisir Barat, Lampung**  
*Karya Web Design untuk GEMATIK VI 2026*

---

## 🏆 Konteks Lomba GEMATIK VI 2026
- **Tema Utama:** *"Empowering Global Innovators for an Intelligent Future"*
- **Implementasi SDGs (Sustainable Development Goals):**
  - **SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi):** Pemberdayaan pemandu lokal, UMKM kuliner ikan bakar seruit, pengrajin suvenir, dan persewaan papan surfing.
  - **SDG 9 (Industri, Inovasi & Infrastruktur):** Transformasi digital pariwisata daerah melalui peta 3D interaktif, GPS navigation real-time, dan asisten cerdas Pari AI.
  - **SDG 11 (Kota & Permukiman Berkelanjutan - Target 11.4):** Perlindungan warisan budaya dan kearifan lokal kerajinan Tenun Tapis Saibatin serta agroforestri Repong Damar Krui.
  - **SDG 14 (Ekosistem Lautan):** Edukasi konservasi penyu Muara Tembulih dan kampanye pantai bebas sampah plastik.
  - **SDG 15 (Ekosistem Daratan):** Pelestarian flora dan fauna endemik Taman Nasional Bukit Barisan Selatan (TNBBS).
  - **SDG 12 (Konsumsi & Produksi Bertanggung Jawab):** Penggunaan sistem reservasi digital nir-kertas (paperless booking).

---

## 🛠️ Arsitektur Teknologi Baru (Vue.js 3 + Vite + Supabase)

- **Frontend Framework:** Vue 3 (Composition API `<script setup>`)
- **Build Tool:** Vite 6
- **Routing:** Vue Router 4 (SPA Navigation & deep linking)
- **State Management:** Pinia 3
- **Database & Authentication:** Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Mapping Engine:** Leaflet.js v1.9.4 & ArcGIS World Imagery Tile Service
- **Styles:** Custom Design System (Glassmorphism, Dark/Light modes, Micro-animations)
- **Backup Data:** Dual-mode persistence (Supabase PostgreSQL + Local Storage fallback)

---

## 🗄️ Setup Database Supabase

1. Buat project baru di [Supabase Dashboard](https://supabase.com).
2. Masuk ke **SQL Editor** → Klik **New Query**.
3. Salin dan jalankan seluruh isi berkas: [`supabase_schema.sql`](./supabase_schema.sql).
4. Dapatkan URL & Anon Key dari project Supabase Anda:
   - Masuk ke **Project Settings** → **API**.
   - Salin **Project URL** dan **anon public key**.
5. Buka berkas `.env` di root project dan masukkan kredensial:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

> 💡 *Catatan:* Aplikasi ini memiliki fitur **Dual-mode Fallback**. Jika kredensial Supabase belum diisi, aplikasi otomatis menggunakan fallback data lokal sehingga seluruh fitur (Peta 3D, Booking Wizard, Pari AI, dan Admin Dashboard) tetap berjalan 100% normal tanpa error.

---

## 🔐 Kredensial Akun Pengelola (Dashboard Admin)
Untuk kebutuhan demonstrasi, admin dapat masuk melalui menu profil atau rute `/admin`:

| Parameter | Kredensial Admin |
| :--- | :--- |
| **URL Akses** | `/admin` |
| **Username** | `admin` |
| **Kata Sandi** | `pesisir2026` |
| **Role / Hak Akses** | Administrator Penuh (Pengelola Pariwisata Pesisir Barat) |

Tersedia tombol **Isi Otomatis** pada kartu login untuk kemudahan pengujian.

---

## 🚀 Fitur Unggulan Sistem

1. **Peta Wisata 3D & Navigasi GPS Real-Time:**
   - 18 Titik spot wisata lengkap (Surfing, Pantai, Air Terjun, Budaya, Landmark, Pulau, Kuliner, Konservasi).
   - Terhubung langsung dengan Google Maps Turn-by-Turn GPS direction.
   - Pilihan layer satelit ArcGIS World Imagery, topografi, dan mode malam.
   - 3D perspective tilt toggle dan deteksi GPS pengguna.

2. **Wizard Pemesanan Multi-Langkah (Booking Wizard):**
   - Step 1: Pilihan paket wisata terintegrasi dan opsi layanan tambahan (Pemandu Eksklusif +Rp250.000/hari, Dokumentasi Drone +Rp100.000).
   - Step 2: Formulir data wisatawan dengan validasi nomor WhatsApp, tanggal, dan email.
   - Step 3: Rincian konfirmasi transparan dengan sinkronisasi kalkulasi harga real-time.
   - Step 4: Layar reservasi sukses dengan kode booking otomatis `EPB-2026-XXXX`, tersimpan langsung ke tabel `bookings` Supabase.

3. **Pari AI - Asisten Wisata Pintar:**
   - Chatbot rekomendasi wisata interaktif berbasis query preferensi traveler (pantai keluarga, surfing pemula/ahli, kuliner seruit, tips rute perjalanan).

4. **Dashboard Admin Pengelola:**
   - Pemantauan statistik total reservasi, pemesanan pending, terkonfirmasi, estimasi omset, verifikasi status, filter pencarian, dan integrasi tabel Supabase.

5. **Modul Legalitas & Edukasi (Info Modals):**
   - FAQs (Pertanyaan Umum seputar aksesibilitas Krui, musim ombak, Pulau Pisang).
   - Syarat & Ketentuan Pemesanan Berkelanjutan.
   - Kebijakan Privasi Perlindungan Data Pribadi Pengunjung.

---

## 💻 Cara Menjalankan Project

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Build untuk production
npm run build
```

---
*Didesain dan dikembangkan dengan bangga oleh Aditiya Pratama untuk Pesisir Barat, Lampung.*
