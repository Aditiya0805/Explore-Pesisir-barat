<template>
  <header class="header" id="header">
    <div class="container">
      <router-link to="/" class="logo" id="logoLink" @click="closeMobileMenu">
        <img class="brand-logo" src="/assets/images/logo-icon.svg" alt="Pesibar Wave" width="40" height="40" />
        <span class="logo-text">Pesibar <span class="logo-accent">Wave</span></span>
      </router-link>

      <!-- Backdrop for mobile menu -->
      <div v-if="mobileMenuOpen" class="mobile-nav-backdrop" @click="closeMobileMenu"></div>

      <!-- Nav Menu (Desktop & Mobile Drawer) -->
      <nav class="nav-wrapper" :class="{ 'open': mobileMenuOpen }">
        <ul class="nav-menu" id="navMenu" :class="{ 'active': mobileMenuOpen }">
          <li>
            <router-link to="/" class="nav-link" :class="{ active: currentSection === 'home' }" @click="navigateSection('hero')">
              <i class="fa-solid fa-house nav-icon-mobile"></i> {{ langStore.t('nav.home') }}
            </router-link>
          </li>
          <li>
            <a href="#destinasi" class="nav-link" :class="{ active: currentSection === 'destinasi' }" @click.prevent="navigateSection('destinasi')">
              <i class="fa-solid fa-umbrella-beach nav-icon-mobile"></i> {{ langStore.t('nav.destinations') }}
            </a>
          </li>
          <li>
            <a href="#peta" class="nav-link" :class="{ active: currentSection === 'peta' }" @click.prevent="navigateSection('peta')">
              <i class="fa-solid fa-earth-asia"></i> {{ langStore.t('nav.map3d') }}
            </a>
          </li>
          <li>
            <a href="#paket" class="nav-link" :class="{ active: currentSection === 'paket' }" @click.prevent="navigateSection('paket')">
              <i class="fa-solid fa-box-open nav-icon-mobile"></i> {{ langStore.t('nav.packages') }}
            </a>
          </li>
          <li>
            <a href="#pemandu" class="nav-link" :class="{ active: currentSection === 'pemandu' }" @click.prevent="navigateSection('pemandu')">
              <i class="fa-solid fa-user-tie nav-icon-mobile"></i> {{ langStore.t('nav.guides') }}
            </a>
          </li>
          <li>
            <a href="#galeri" class="nav-link" :class="{ active: currentSection === 'galeri' }" @click.prevent="navigateSection('galeri')">
              <i class="fa-solid fa-images nav-icon-mobile"></i> {{ langStore.t('nav.gallery') }}
            </a>
          </li>
          <li>
            <a href="#artikel" class="nav-link" :class="{ active: currentSection === 'artikel' }" @click.prevent="navigateSection('artikel')">
              <i class="fa-solid fa-newspaper nav-icon-mobile"></i> {{ langStore.t('nav.articles') }}
            </a>
          </li>
          <li>
            <a href="#tentang" class="nav-link" :class="{ active: currentSection === 'tentang' }" @click.prevent="navigateSection('tentang')">
              <i class="fa-solid fa-circle-info nav-icon-mobile"></i> {{ langStore.t('nav.about') }}
            </a>
          </li>
          <li class="mobile-booking-row">
            <router-link to="/booking" class="btn btn-primary btn-block mobile-drawer-booking-btn" @click="closeMobileMenu">
              <i class="fa-solid fa-calendar-check"></i> {{ langStore.t('nav.bookNow') }}
            </router-link>
          </li>
          <li class="mobile-lang-row">
            <span class="mobile-lang-label"><i class="fa-solid fa-globe"></i> {{ langStore.t('nav.language') }}:</span>
            <div class="mobile-lang-buttons">
              <button
                type="button"
                class="mobile-lang-btn"
                :class="{ active: langStore.currentLang === 'id' }"
                @click="langStore.setLang('id')"
              >
                🇮🇩 ID
              </button>
              <button
                type="button"
                class="mobile-lang-btn"
                :class="{ active: langStore.currentLang === 'en' }"
                @click="langStore.setLang('en')"
              >
                🇬🇧 EN
              </button>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Nav Actions -->
      <div class="header-actions">
        <!-- International Language Switcher -->
        <LanguageSwitcher />

        <router-link to="/booking" class="btn btn-primary btn-header-booking" id="headerBookingBtn" @click="closeMobileMenu">
          <i class="fa-solid fa-calendar-check"></i> <span>{{ langStore.t('nav.bookNow') }}</span>
        </router-link>

        <router-link to="/admin" class="profile-trigger" id="profileTrigger" :title="langStore.t('nav.adminTitle')" @click="closeMobileMenu">
          <i class="fa-solid fa-user"></i>
        </router-link>

        <div class="menu-toggle" id="menuToggle" :title="langStore.t('nav.menuTitle')" @click="toggleMobileMenu">
          <i :class="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLangStore } from '@/stores/langStore'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const router = useRouter()
const route = useRoute()
const langStore = useLangStore()
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

<style scoped>
.nav-icon-mobile {
  display: none;
}

.mobile-booking-row {
  display: none;
}

.mobile-lang-row {
  display: none;
}

.mobile-nav-backdrop {
  position: fixed;
  inset: 0;
  top: 60px;
  background: rgba(7, 59, 76, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 999;
  animation: backdropFade 0.25s ease forwards;
}

@keyframes backdropFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 1100px) {
  .nav-icon-mobile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    margin-right: 0.65rem;
    font-size: 0.95rem;
    color: var(--color-ocean-blue);
  }

  .mobile-booking-row {
    display: block;
    padding: 0.6rem 0.5rem 0.25rem;
    margin-top: 0.4rem;
  }

  .mobile-drawer-booking-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    font-weight: 700;
    border-radius: var(--border-radius-md);
    box-shadow: 0 4px 14px rgba(8, 126, 164, 0.35);
  }

  .mobile-lang-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 0.5rem 0.4rem;
    margin-top: 0.35rem;
    border-top: 1px solid rgba(8, 126, 164, 0.12);
  }

  .mobile-lang-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--color-deep-navy);
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .mobile-lang-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .mobile-lang-btn {
    padding: 0.4rem 0.85rem;
    font-size: 0.8rem;
    font-weight: 700;
    border-radius: var(--border-radius-full);
    border: 1.5px solid rgba(8, 126, 164, 0.2);
    background: rgba(255, 255, 255, 0.85);
    color: var(--color-deep-navy);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mobile-lang-btn.active {
    background: var(--color-ocean-blue);
    color: var(--color-white);
    border-color: var(--color-ocean-blue);
    box-shadow: 0 2px 8px rgba(8, 126, 164, 0.3);
  }
}

/* ==========================================================================
   ENHANCED PROMINENT BOOKING CTA BUTTON
   ========================================================================== */
#headerBookingBtn,
.btn-header-booking {
  background: linear-gradient(135deg, #FF5E36 0%, #FFA034 100%) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
  padding: 0.55rem 1.25rem !important;
  border-radius: 9999px !important;
  white-space: nowrap !important;
  gap: 0.45rem !important;
  box-shadow: 0 4px 16px rgba(255, 94, 54, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  display: inline-flex !important;
  align-items: center !important;
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
  position: relative !important;
}

#headerBookingBtn span,
#headerBookingBtn i,
.btn-header-booking span,
.btn-header-booking i {
  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}

#headerBookingBtn i,
.btn-header-booking i {
  font-size: 0.95rem !important;
  transition: transform 0.25s ease !important;
}

#headerBookingBtn:hover,
.btn-header-booking:hover {
  background: linear-gradient(135deg, #F4511E 0%, #FB8C00 100%) !important;
  transform: translateY(-2px) scale(1.04) !important;
  box-shadow: 0 8px 25px rgba(255, 94, 54, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.5) !important;
  color: #ffffff !important;
}

#headerBookingBtn:hover i,
.btn-header-booking:hover i {
  transform: scale(1.2) rotate(-8deg);
}

.mobile-drawer-booking-btn {
  background: linear-gradient(135deg, #FF5E36 0%, #FFA034 100%) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  box-shadow: 0 4px 16px rgba(255, 94, 54, 0.45) !important;
}

.mobile-drawer-booking-btn span,
.mobile-drawer-booking-btn i {
  color: #ffffff !important;
}
</style>
