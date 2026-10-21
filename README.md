# Pesibar Wave 🏄‍♂️🌊
**Portal Wisata Cerdas & Sistem Reservasi Terpadu Kabupaten Pesisir Barat, Lampung**  

> 🌊 **Jelajah Cerdas, Lestarikan Pesisir** — *Ride the Wave, Preserve the Coast*

*Karya Web Design untuk GEMATIK VI 2026*

---

## 🪪 Identitas Brand

| Aspek | Keterangan |
| :--- | :--- |
| **Nama Brand** | Pesibar Wave |
| **Makna** | "Pesibar" = singkatan lokal Pesisir Barat, "Wave" = ombak (ikon surfing kelas dunia & laut Pesisir Barat) |
| **Tagline (ID)** | Jelajah Cerdas, Lestarikan Pesisir |
| **Tagline (EN)** | Ride the Wave, Preserve the Coast |
| **Deskripsi** | Portal wisata cerdas Pesisir Barat, Lampung: destinasi, peta 3D, paket wisata, pemandu lokal, dan booking online. |
| **Asisten AI** | Pari AI — pemandu cerdas Pesibar Wave |

> 📝 *Catatan:* "Pesisir Barat" tetap digunakan sebagai nama daerah/kabupaten. Nama brand website adalah **Pesibar Wave**.

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
2. Masuk ke **SQL Editor** → **New Query**.
3. Salin dan jalankan **seluruh** isi berkas [`supabase_schema.sql`](./supabase_schema.sql). Skrip ini aman dijalankan berulang (idempotent) dan akan membuat:
   - 9 tabel konten + tabel `admins` (allowlist admin),
   - Row Level Security: publik hanya bisa **membaca**, penulisan hanya untuk admin,
   - Bucket Storage publik `media` dengan batas **1 MB per gambar**,
   - Seed data awal (destinasi, peta, paket, pemandu, galeri, artikel).
4. Ambil **Project URL** dan **publishable key** di **Project Settings → API**.
5. Buat berkas `.env` di root project (contoh tersedia di [`.env.example`](./.env.example)):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
   ```
   > Kunci lama `VITE_SUPABASE_ANON_KEY` juga masih didukung.
6. Buat akun login admin di **Authentication → Users → Add user**:
   - Email: `admin@pesibarwave.id`
   - Password: `pesisir2026` (ganti dengan kata sandi kuat)
   - Centang **Auto Confirm User**.
7. Pastikan email admin terdaftar pada tabel `admins` (seed sudah berisi `admin@pesibarwave.id`). Untuk email lain:
   ```sql
   INSERT INTO admins (email) VALUES ('email-anda@gmail.com')
   ON CONFLICT (email) DO NOTHING;
   ```

> 💡 *Catatan:* Aplikasi memiliki **Dual-mode Fallback**. Jika Supabase belum dikonfigurasi atau tabel belum dibuat, aplikasi otomatis memakai `src/data/fallbackData.js` + `localStorage` sehingga seluruh fitur tetap berjalan. Dashboard akan menampilkan status koneksi per tabel agar mudah didiagnosis.


---

## 🔐 Kredensial Akun Pengelola (Dashboard Admin)
Untuk kebutuhan demonstrasi, admin dapat masuk melalui menu profil atau rute `/admin`:

| Parameter | Kredensial Admin |
| :--- | :--- |
| **URL Akses** | `/admin` |
| **Email Supabase** | `admin@pesibarwave.id` (buat di Authentication → Users) |
| **Username Demo** | `admin` (atau `admin@pesibarwave.id`) |
| **Kata Sandi** | `pesisir2026` |
| **Role / Hak Akses** | Administrator Penuh (email harus ada di tabel `admins`) |

> ⚠️ Login dengan kredensial demo tanpa akun Supabase Auth membuka **mode lokal read-only**: dashboard tetap bisa dijelajahi, tetapi perubahan tidak dikirim ke database.

Tersedia tombol **Isi Otomatis** pada kartu login untuk kemudahan pengujian.

---

## 🖼️ Upload Gambar & Batas 1 MB

- Semua upload dari dashboard menggunakan bucket Storage publik bernama **`media`**.
- Foto diseleksi di browser lalu **dikompresi otomatis** (canvas + penurunan kualitas/resolusi) hingga ukuran akhir **≤ 1 MB** sebelum dikirim.
- Gambar yang sudah ≤ 1 MB diunggah apa adanya; PNG transparan tetap dipertahankan.
- Batas 1 MB juga ditegakkan di sisi Supabase Storage (`file_size_limit` + `allowed_mime_types`).
- Jika kompresi gagal mencapai 1 MB, unggahan ditolak dan pengguna diminta memilih foto dengan resolusi lebih kecil.
- Dashboard juga menerima URL gambar eksternal (mis. `/assets/images/...`) tanpa upload.

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
   - Step 4: Layar reservasi sukses dengan kode booking otomatis `PW-2026-XXXX`, tersimpan langsung ke tabel `bookings` Supabase.

3. **Pari AI - Asisten Wisata Pintar:**
   - Chatbot rekomendasi wisata interaktif berbasis query preferensi traveler (pantai keluarga, surfing pemula/ahli, kuliner seruit, tips rute perjalanan).

4. **Dashboard Admin Pengelola (CRUD penuh + Supabase Storage):**
   - Statistik real dari tabel `bookings`, grafik tren bulanan, dan paket terpopuler dihitung otomatis.
   - CRUD untuk destinasi, titik peta, paket wisata, pemandu, galeri, artikel, dan pengaturan situs.
   - Upload gambar langsung ke bucket `media`; foto otomatis dikompresi di browser hingga **≤ 1 MB**.
   - Update status booking real-time (Supabase Realtime), filter, pencarian, dan hapus booking.
   - Kartu **Status Koneksi** memeriksa setiap tabel + bucket storage dan menampilkan pesan perbaikan.

5. **Modul Legalitas & Edukasi (Info Modals):**
   - FAQs (Pertanyaan Umum seputar aksesibilitas Krui, musim ombak, Pulau Pisang).
   - Syarat & Ketentuan Pemesanan Berkelanjutan.
   - Kebijakan Privasi Perlindungan Data Pribadi Pengunjung.

---

## 🆕 Fitur Cerdas & Interaktif

1. **Pari AI 2.0 — Rekomendasi Paket Otomatis (Rule-Based, Tanpa API Key):**
   - Mendeteksi **budget** (mis. "1,5 juta", "500rb"), **jumlah orang**, dan **minat** (surfing, keluarga, budaya, kuliner, pulau, alam).
   - Memberi peringkat paket dari **data nyata** di situs (harga paket, destinasi, dan pemandu), lengkap dengan estimasi biaya & alasan.
   - Jawaban menyertakan **tombol aksi langsung** "Pesan paket ini" / "Lihat destinasi" yang membuka form pemesanan.
   - Bilingual (Indonesia / English) dan **tidak pernah menampilkan error** ke pengguna (ada safety net).

2. **Widget Cuaca & Kondisi Ombak per Destinasi (Open-Meteo, tanpa API key):**
   - Suhu, kondisi langit, angin, kelembapan, **tinggi/periode/arah ombak**, dan tingkat kesulitan surfing (pemula–pro).
   - Prakiraan 3 hari. Jika API gagal, otomatis menampilkan **perkiraan pola musiman** (tidak error).

3. **Review & Rating Destinasi:**
   - Ringkasan rata-rata + distribusi bintang dan daftar ulasan pada halaman detail.
   - Form pengiriman ulasan. Tersimpan ke tabel `reviews` Supabase bila dikonfigurasi, atau fallback `localStorage`.

4. **Bukti Booking (PDF) & Kirim WhatsApp:**
   - Setelah booking sukses: tombol **Unduh Bukti Booking (PDF)** (dibuat client-side dengan `jspdf`, dimuat lazy) dan **Kirim via WhatsApp** dengan pesan otomatis terisi.

> 🔧 *Variabel lingkungan opsional:* `VITE_ADMIN_WHATSAPP` (nomor WhatsApp operator, format internasional tanpa `+`) untuk mengarahkan tombol kirim bukti booking.

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
