<template>
  <div v-if="activeModal" class="info-modal-backdrop" role="dialog" aria-modal="true" @click.self="close">
    <div class="info-modal-card">
      <div class="info-modal-header">
        <h3 v-if="activeModal === 'modal-terms'">
          <i class="fa-solid fa-file-contract"></i> Syarat & Ketentuan Penggunaan
        </h3>
        <h3 v-else-if="activeModal === 'modal-privacy'">
          <i class="fa-solid fa-shield-halved"></i> Kebijakan Privasi
        </h3>
        <h3 v-else-if="activeModal === 'modal-faq'">
          <i class="fa-solid fa-circle-question"></i> Pertanyaan yang Sering Diajukan (FAQs)
        </h3>
        <button class="info-modal-close-btn" aria-label="Tutup modal" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Syarat & Ketentuan -->
      <div v-if="activeModal === 'modal-terms'" class="info-modal-body">
        <p>Dengan menggunakan platform <strong>Explore Pesisir Barat</strong>, Anda menyetujui ketentuan berikut:</p>
        <h4>1. Penggunaan Platform</h4>
        <p>Platform ini disediakan sebagai sarana promosi dan pemesanan wisata Kabupaten Pesisir Barat, Lampung. Pengguna wajib mengisi data yang benar dan valid pada form pemesanan.</p>
        <h4>2. Pemesanan & Pembayaran</h4>
        <p>Pemesanan bersifat reservasi awal. Konfirmasi dan verifikasi dilakukan secara langsung melalui pengelola melalui WhatsApp/email dalam 1×24 jam setelah reservasi online diterima.</p>
        <h4>3. Pembatalan</h4>
        <p>Pembatalan yang dilakukan lebih dari 3 hari sebelum tanggal kunjungan tidak dikenakan biaya.</p>
        <h4>4. Tanggung Jawab</h4>
        <p>Pengelola tidak bertanggung jawab atas kerugian akibat force majeure (cuaca ekstrem, bencana alam).</p>
      </div>

      <!-- Kebijakan Privasi -->
      <div v-else-if="activeModal === 'modal-privacy'" class="info-modal-body">
        <p>Kami berkomitmen menjaga privasi dan keamanan data pribadi Anda.</p>
        <h4>Data yang Dikumpulkan</h4>
        <p>Nama lengkap, nomor WhatsApp, dan alamat email yang diisi pada formulir pemesanan digunakan hanya untuk keperluan konfirmasi reservasi wisata Pesisir Barat.</p>
        <h4>Database Supabase & Keamanan</h4>
        <p>Data pemesanan disimpan secara aman di PostgreSQL Supabase dengan perlindungan Row Level Security (RLS) serta enkripsi standar industri.</p>
        <h4>Kontak Privasi</h4>
        <p>Email: <strong>Adityapratama2292@gmail.com</strong> | WhatsApp: <strong>+62-822-8942-4809</strong></p>
      </div>

      <!-- FAQs -->
      <div v-else-if="activeModal === 'modal-faq'" class="info-modal-body">
        <details class="faq-item">
          <summary>🏄 Apakah bisa surfing meskipun belum berpengalaman?</summary>
          <p>Ya! Pesisir Barat memiliki spot untuk semua level. Pantai Labuhan Jukung dan beberapa titik di Krui sangat cocok untuk pemula dengan dampingan pelatih berlisensi.</p>
        </details>
        <details class="faq-item">
          <summary>📅 Kapan waktu terbaik berkunjung ke Pesisir Barat?</summary>
          <p>Musim ombak puncak untuk surfing adalah <strong>April – Oktober</strong>. Untuk wisata keluarga dan pulau, disarankan <strong>Mei – Agustus</strong>.</p>
        </details>
        <details class="faq-item">
          <summary>🚗 Bagaimana cara menuju Pesisir Barat dari Bandar Lampung?</summary>
          <p>Rute darat via Lintas Barat Sumatera sekitar 5-6 jam. Tersedia travel AC Krui dari Terminal Rajabasa Bandar Lampung.</p>
        </details>
        <details class="faq-item">
          <summary>🐬 Bagaimana cara ke Pulau Pisang dan melihat lumba-lumba?</summary>
          <p>Pulau Pisang berjarak sekitar 45-60 menit dari dermaga Kuala Stabas/Tembakak via perahu jukung. Lumba-lumba liar kerap terlihat di pagi hari (07:00-09:00 WIB).</p>
        </details>
      </div>

      <div class="info-modal-footer">
        <button class="btn btn-primary info-modal-footer-close" @click="close">
          Mengerti & Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeModal: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>
