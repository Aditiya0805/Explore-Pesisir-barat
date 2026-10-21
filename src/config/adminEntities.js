/**
 * Dashboard CRUD configuration.
 * Every entry maps 1:1 to a Supabase table created by supabase_schema.sql.
 */

const imageField = (key, label, extra = {}) => ({
  key,
  label,
  type: 'image',
  list: true,
  listType: 'image',
  full: true,
  ...extra
})

export const DESTINATIONS_ENTITY = {
  table: 'destinations',
  title: 'Destinasi Wisata',
  icon: 'fa-solid fa-map-location-dot',
  description: 'Kelola data destinasi yang tampil di beranda dan halaman detail.',
  orderBy: 'id',
  ascending: true,
  idColumn: 'id',
  searchKeys: ['name', 'location', 'category'],
  fields: [
    { key: 'name', label: 'Nama Destinasi', type: 'text', required: true, list: true, full: true },
    { key: 'location', label: 'Lokasi', type: 'text', required: true, list: true },
    { key: 'category', label: 'Kategori', type: 'text' },
    { key: 'price', label: 'Harga Tiket (Rp)', type: 'number', min: 0, list: true, listType: 'currency' },
    { key: 'rating', label: 'Rating (teks)', type: 'text', hint: 'Contoh: 4.9 / 5.0 (Rating Peselancar)' },
    { key: 'hours', label: 'Jam Operasional', type: 'text' },
    { key: 'lat', label: 'Latitude', type: 'number', step: 'any', required: true },
    { key: 'lng', label: 'Longitude', type: 'number', step: 'any', required: true },
    { key: 'description', label: 'Deskripsi Singkat', type: 'textarea', full: true },
    { key: 'long_description', label: 'Deskripsi Lengkap', type: 'textarea', full: true },
    imageField('cover_img', 'Foto Utama', { folder: 'destinations' }),
    {
      key: 'thumbs',
      label: 'Galeri Foto (maks. 6)',
      type: 'images',
      folder: 'destinations',
      max: 6,
      full: true
    },
    {
      key: 'facilities',
      label: 'Fasilitas',
      type: 'tags',
      full: true,
      hint: 'Pisahkan dengan koma, contoh: Parkir Luas, Toilet Bersih, Gazebo'
    }
  ]
}

export const MAP_LOCATIONS_ENTITY = {
  table: 'map_locations',
  title: 'Titik Peta 3D',
  icon: 'fa-solid fa-location-dot',
  description: 'Atur 18+ titik peta interaktif beserta kategori, ikon, dan tautan Google Maps.',
  orderBy: 'id',
  ascending: true,
  idColumn: 'id',
  searchKeys: ['name', 'category', 'category_label'],
  fields: [
    { key: 'name', label: 'Nama Titik', type: 'text', required: true, list: true, full: true },
    {
      key: 'dest_id',
      label: 'ID Destinasi Terkait',
      type: 'number',
      hint: 'Kosongkan bila titik peta tidak terhubung ke destinasi.'
    },
    { key: 'category', label: 'Kategori', type: 'text', required: true, list: true },
    { key: 'category_label', label: 'Label Kategori', type: 'text' },
    { key: 'lat', label: 'Latitude', type: 'number', step: 'any', required: true },
    { key: 'lng', label: 'Longitude', type: 'number', step: 'any', required: true },
    { key: 'icon', label: 'Ikon FontAwesome', type: 'text', placeholder: 'fa-water' },
    { key: 'pin_class', label: 'Class Pin', type: 'text', placeholder: 'pin-surf' },
    { key: 'rating', label: 'Rating', type: 'text', list: true },
    { key: 'price', label: 'Harga (teks)', type: 'text', hint: 'Contoh: Rp 10.000 / Gratis' },
    { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
    imageField('img', 'Foto Titik Peta', { folder: 'map' }),
    { key: 'gmaps_query', label: 'Query Google Maps', type: 'text', full: true },
    { key: 'gmaps_dir_url', label: 'URL Rute Google Maps', type: 'url', full: true },
    { key: 'gmaps_search_url', label: 'URL Pencarian Google Maps', type: 'url', full: true }
  ]
}

export const PACKAGES_ENTITY = {
  table: 'packages',
  title: 'Paket Wisata',
  icon: 'fa-solid fa-suitcase',
  description: 'Paket wisata beserta harga, durasi, dan fasilitas.',
  orderBy: 'sort_order',
  ascending: true,
  idColumn: 'id',
  searchKeys: ['name', 'description', 'duration'],
  fields: [
    {
      key: 'id',
      label: 'ID Paket (slug)',
      type: 'text',
      required: true,
      list: true,
      editable: false,
      placeholder: 'surf',
      hint: 'Dipakai pada kode booking. Tidak bisa diubah setelah dibuat.'
    },
    { key: 'name', label: 'Nama Paket', type: 'text', required: true, list: true },
    { key: 'price', label: 'Harga (Rp)', type: 'number', required: true, min: 0, list: true, listType: 'currency' },
    { key: 'duration', label: 'Durasi', type: 'text', list: true },
    { key: 'min_persons', label: 'Minimal Peserta', type: 'text' },
    { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
    { key: 'amenities', label: 'Fasilitas', type: 'tags', full: true, hint: 'Pisahkan dengan koma.' },
    imageField('cover_img', 'Foto Paket', { folder: 'packages' }),
    { key: 'is_popular', label: 'Tandai Populer', type: 'boolean' },
    { key: 'sort_order', label: 'Urutan Tampil', type: 'number', min: 0 }
  ]
}

export const GUIDES_ENTITY = {
  table: 'guides',
  title: 'Jasa Pemandu',
  icon: 'fa-solid fa-user-ninja',
  description: 'Profil pemandu lokal, tarif, bahasa, dan status ketersediaan.',
  orderBy: 'id',
  ascending: true,
  idColumn: 'id',
  searchKeys: ['name', 'specialty', 'languages'],
  fields: [
    { key: 'name', label: 'Nama Pemandu', type: 'text', required: true, list: true },
    { key: 'specialty', label: 'Spesialisasi', type: 'text', list: true },
    { key: 'badge_label', label: 'Label Badge', type: 'text' },
    { key: 'rating', label: 'Rating', type: 'number', step: 0.1, min: 0, max: 5, list: true },
    { key: 'review_count', label: 'Jumlah Ulasan', type: 'number', min: 0 },
    { key: 'experience_years', label: 'Pengalaman (tahun)', type: 'number', min: 0 },
    { key: 'languages', label: 'Bahasa', type: 'text', hint: 'Contoh: ID, EN, JP' },
    { key: 'price', label: 'Tarif (Rp)', type: 'number', min: 0, list: true, listType: 'currency' },
    { key: 'price_unit', label: 'Satuan Tarif', type: 'text', placeholder: '/ hari' },
    { key: 'is_available', label: 'Tersedia', type: 'boolean', list: true, listType: 'boolean' },
    imageField('avatar_url', 'Foto Pemandu', { folder: 'guides' })
  ]
}

export const GALLERY_ENTITY = {
  table: 'gallery',
  title: 'Galeri Foto',
  icon: 'fa-solid fa-images',
  description: 'Foto galeri beranda. Setiap gambar wajib di bawah 1 MB.',
  orderBy: 'sort_order',
  ascending: true,
  idColumn: 'id',
  searchKeys: ['title', 'category'],
  fields: [
    { key: 'title', label: 'Judul Foto', type: 'text', required: true, list: true },
    { key: 'category', label: 'Kategori', type: 'text', required: true, list: true },
    imageField('img_url', 'Foto', { folder: 'gallery', required: true }),
    { key: 'css_class', label: 'Class Layout', type: 'text', hint: 'Contoh: tall, wide, atau kosongkan.' },
    { key: 'sort_order', label: 'Urutan Tampil', type: 'number', min: 0 }
  ]
}

export const ARTICLES_ENTITY = {
  table: 'articles',
  title: 'Artikel Blog',
  icon: 'fa-solid fa-newspaper',
  description: 'Artikel edukasi dan tips wisata Pesisir Barat.',
  orderBy: 'id',
  ascending: false,
  idColumn: 'id',
  searchKeys: ['title', 'category', 'slug'],
  fields: [
    { key: 'title', label: 'Judul Artikel', type: 'text', required: true, list: true, full: true },
    { key: 'category', label: 'Kategori', type: 'text', list: true },
    { key: 'published_date', label: 'Tanggal Publikasi', type: 'text', placeholder: '10 Agustus 2026' },
    { key: 'slug', label: 'Slug', type: 'text', required: true, hint: 'Unik, contoh: panduan-backpacker-pesisir-barat' },
    { key: 'description', label: 'Ringkasan', type: 'textarea', full: true },
    { key: 'content', label: 'Isi Artikel', type: 'textarea', full: true, rows: 8 },
    imageField('img_url', 'Foto Artikel', { folder: 'articles' })
  ]
}

export const SETTINGS_ENTITY = {
  table: 'settings',
  title: 'Pengaturan Situs',
  icon: 'fa-solid fa-gear',
  description: 'Identitas situs dan kontak resmi yang dipakai di seluruh halaman.',
  orderBy: 'id',
  ascending: true,
  idColumn: 'id',
  single: true,
  canCreate: false,
  canDelete: false,
  searchKeys: [],
  fields: [
    { key: 'site_name', label: 'Nama Situs', type: 'text', required: true },
    { key: 'whatsapp', label: 'Nomor WhatsApp', type: 'text' },
    { key: 'email', label: 'Email Kontak', type: 'email' },
    { key: 'address', label: 'Alamat', type: 'textarea', full: true },
    { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
    { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
    { key: 'youtube_url', label: 'YouTube URL', type: 'url' }
  ],
  defaults: {
    site_name: 'Pesibar Wave',
    whatsapp: '+62 822-8942-4809',
    email: 'info@pesibarwave.id',
    address: 'Krui, Pesisir Tengah, Pesisir Barat, Lampung 34272',
    instagram_url: 'https://www.instagram.com/kruitourism_',
    facebook_url: 'https://www.facebook.com/disporaparpesisirbarat',
    youtube_url: 'https://www.youtube.com/@disporaparpesisirbarat'
  }
}

export const ADMIN_ENTITIES = {
  destinasi: DESTINATIONS_ENTITY,
  peta: MAP_LOCATIONS_ENTITY,
  paket: PACKAGES_ENTITY,
  pemandu: GUIDES_ENTITY,
  galeri: GALLERY_ENTITY,
  artikel: ARTICLES_ENTITY,
  pengaturan: SETTINGS_ENTITY
}
