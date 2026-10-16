<template>
  <header class="header" id="header">
    <div class="container">
      <router-link to="/" class="logo" id="logoLink" @click="closeMobileMenu">
        <div class="logo-icon-box">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 14.5c2.3 0 3.3-1.8 5.5-1.8s3.2 1.8 5.5 1.8 3.2-1.8 5.5-1.8M2.5 17.5c2.3 0 3.3-1.8 5.5-1.8s3.2 1.8 5.5 1.8 3.2-1.8 5.5-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
            <path d="M12 3v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M12 8c1.5-1.5 4-2 6-1.5m-6 1.5c-1.5-1.5-4-2-6-1.5m6 1.5c1.5 1.5 2 4 1.5 6m-1.5-6c-1.5 1.5-2 4-1.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          </svg>
        </div>
        <span class="logo-text">EXPLORE PESISIR BARAT</span>
      </router-link>

      <!-- Desktop Nav Menu -->
      <nav class="nav-wrapper" :class="{ 'open': mobileMenuOpen }">
        <ul class="nav-menu" id="navMenu">
          <li>
            <router-link to="/" class="nav-link" :class="{ active: currentSection === 'home' }" @click="navigateSection('hero')">
              Beranda
            </router-link>
          </li>
          <li>
            <a href="#destinasi" class="nav-link" :class="{ active: currentSection === 'destinasi' }" @click.prevent="navigateSection('destinasi')">
              Destinasi
            </a>
          </li>
          <li>
            <a href="#peta" class="nav-link" :class="{ active: currentSection === 'peta' }" @click.prevent="navigateSection('peta')">
              <i class="fa-solid fa-earth-asia"></i> Peta 3D
            </a>
          </li>
          <li>
            <a href="#paket" class="nav-link" :class="{ active: currentSection === 'paket' }" @click.prevent="navigateSection('paket')">
              Paket Wisata
            </a>
          </li>
          <li>
            <a href="#pemandu" class="nav-link" :class="{ active: currentSection === 'pemandu' }" @click.prevent="navigateSection('pemandu')">
              Jasa Pemandu
            </a>
          </li>
          <li>
            <a href="#galeri" class="nav-link" :class="{ active: currentSection === 'galeri' }" @click.prevent="navigateSection('galeri')">
              Galeri
            </a>
          </li>
          <li>
            <a href="#artikel" class="nav-link" :class="{ active: currentSection === 'artikel' }" @click.prevent="navigateSection('artikel')">
              Artikel
            </a>
          </li>
          <li>
            <a href="#tentang" class="nav-link" :class="{ active: currentSection === 'tentang' }" @click.prevent="navigateSection('tentang')">
              Tentang Kami
            </a>
          </li>
        </ul>
      </nav>

      <!-- Nav Actions -->
      <div class="header-actions">
        <router-link to="/booking" class="btn btn-primary" id="headerBookingBtn" @click="closeMobileMenu">
          <i class="fa-solid fa-calendar-check"></i> <span>Pesan Sekarang</span>
        </router-link>

        <router-link to="/admin" class="profile-trigger" id="profileTrigger" title="Portal Admin / Login" @click="closeMobileMenu">
          <i class="fa-solid fa-user"></i>
        </router-link>

        <div class="menu-toggle" id="menuToggle" title="Buka Menu" @click="toggleMobileMenu">
          <i :class="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const currentSection = ref('home')

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const navigateSection = (sectionId) => {
  closeMobileMenu()
  currentSection.value = sectionId === 'hero' ? 'home' : sectionId
  
  // Scroll to the section element
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// Track scroll to update active navigation item and header state
const handleScroll = () => {
  const header = document.getElementById('header')
  const scrollPos = window.scrollY
  
  // Toggle .scrolled class for navbar color transition
  if (scrollPos > 50) {
    header?.classList.add('scrolled')
  } else {
    header?.classList.remove('scrolled')
  }
  
  if (route.path !== '/') return
  const sections = ['hero', 'destinasi', 'peta', 'paket', 'pemandu', 'galeri', 'artikel', 'tentang']
  const scrollPosNav = scrollPos + 200

  for (const s of sections) {
    const el = document.getElementById(s)
    if (el) {
      const top = el.offsetTop
      const height = el.offsetHeight
      if (scrollPosNav >= top && scrollPosNav < top + height) {
        currentSection.value = s === 'hero' ? 'home' : s
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
