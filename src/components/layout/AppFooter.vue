<template>
  <footer class="footer" id="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <router-link to="/" class="logo">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 14.5c2.3 0 3.3-1.8 5.5-1.8s3.2 1.8 5.5 1.8 3.2-1.8 5.5-1.8M2.5 17.5c2.3 0 3.3-1.8 5.5-1.8s3.2 1.8 5.5 1.8 3.2-1.8 5.5-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
              <path d="M12 3v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M12 8c1.5-1.5 4-2 6-1.5m-6 1.5c-1.5-1.5-4-2-6-1.5m6 1.5c1.5 1.5 2 4 1.5 6m-1.5-6c-1.5 1.5-2 4-1.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
            </svg>
            <span>EXPLORE PESISIR BARAT</span>
          </router-link>
          <p>Temukan pengalaman liburan tropis terbaik, petualangan ombak samudra, eksotisme pulau, dan kearifan budaya lokal di Pesisir Barat, Lampung.</p>
          <div class="social-links">
            <a href="https://www.instagram.com/kruitourism_" target="_blank" rel="noopener noreferrer" class="social-link" title="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com/disporaparpesisirbarat" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook Disporapar">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://www.youtube.com/@disporaparpesisirbarat" target="_blank" rel="noopener noreferrer" class="social-link" title="YouTube Pariwisata">
              <i class="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>

        <div>
          <h4 class="footer-title">Navigasi</h4>
          <ul class="footer-links">
            <li><router-link to="/">Beranda</router-link></li>
            <li><router-link to="/#destinasi">Destinasi</router-link></li>
            <li><router-link to="/#peta">Peta Wisata 3D</router-link></li>
            <li><router-link to="/#paket">Paket Wisata</router-link></li>
            <li><router-link to="/#pemandu">Jasa Pemandu</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Destinasi Populer</h4>
          <ul class="footer-links">
            <li><router-link to="/detail/1">Pantai Karang Nyimbor</router-link></li>
            <li><router-link to="/detail/2">Pantai Way Jambu</router-link></li>
            <li><router-link to="/detail/16">Pantai Biha & Pesisir</router-link></li>
            <li><router-link to="/detail/14">Pulau Pisang</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Layanan Bantuan</h4>
          <ul class="footer-links">
            <li><router-link to="/booking">Pemesanan Online</router-link></li>
            <li><a href="#" @click.prevent="$emit('openModal', 'modal-terms')">Syarat Ketentuan</a></li>
            <li><a href="#" @click.prevent="$emit('openModal', 'modal-privacy')">Kebijakan Privasi</a></li>
            <li><a href="#" @click.prevent="$emit('openModal', 'modal-faq')">FAQs</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Hubungi Kami</h4>
          <ul class="footer-contact">
            <li><i class="fa-solid fa-phone"></i> <span>+62-822-8942-4809</span></li>
            <li><i class="fa-solid fa-envelope"></i> <span>Adityapratama2292@gmail.com</span></li>
            <li><i class="fa-solid fa-location-dot"></i> <span>Krui, Pesisir Tengah, Pesisir Barat, Lampung 34272</span></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 Explore Pesisir Barat. Didesain oleh Aditiya Pratama.</p>
        <div class="footer-legal">
          <a href="#" @click.prevent="$emit('openModal', 'modal-terms')">Syarat Penggunaan</a>
          <a href="#" @click.prevent="$emit('openModal', 'modal-privacy')">Kebijakan Privasi</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineEmits(['openModal'])
</script>
