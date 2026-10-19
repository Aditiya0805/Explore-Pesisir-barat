<template>
  <footer class="footer" id="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <router-link to="/" class="logo">
            <img class="brand-logo brand-logo--sm" src="/assets/images/logo-icon.svg" alt="Pesibar Wave" width="34" height="34" />
            <span>Pesibar <span class="logo-accent">Wave</span></span>
          </router-link>
          <p class="footer-tagline">{{ langStore.t('footer.brandTagline') }}</p>
          <p>{{ langStore.t('footer.tagline') }}</p>
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
          <h4 class="footer-title">{{ langStore.t('footer.navTitle') }}</h4>
          <ul class="footer-links">
            <li><router-link to="/">{{ langStore.t('nav.home') }}</router-link></li>
            <li><router-link to="/#destinasi">{{ langStore.t('nav.destinations') }}</router-link></li>
            <li><router-link to="/#peta">{{ langStore.t('nav.map3d') }}</router-link></li>
            <li><router-link to="/#paket">{{ langStore.t('nav.packages') }}</router-link></li>
            <li><router-link to="/#pemandu">{{ langStore.t('nav.guides') }}</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">{{ langStore.t('footer.popularDestTitle') }}</h4>
          <ul class="footer-links">
            <li><router-link to="/detail/1">Pantai Karang Nyimbor</router-link></li>
            <li><router-link to="/detail/2">Pantai Way Jambu</router-link></li>
            <li><router-link to="/detail/16">Pantai Biha & Pesisir</router-link></li>
            <li><router-link to="/detail/14">Pulau Pisang (Banana Island)</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">{{ langStore.t('footer.supportTitle') }}</h4>
          <ul class="footer-links">
            <li><router-link to="/booking">{{ langStore.t('footer.onlineBooking') }}</router-link></li>
            <li><a href="#" @click.prevent="$emit('openModal', 'modal-terms')">{{ langStore.t('footer.terms') }}</a></li>
            <li><a href="#" @click.prevent="$emit('openModal', 'modal-privacy')">{{ langStore.t('footer.privacy') }}</a></li>
            <li><a href="#" @click.prevent="$emit('openModal', 'modal-faq')">{{ langStore.t('footer.faq') }}</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">{{ langStore.t('footer.contactTitle') }}</h4>
          <ul class="footer-contact">
            <li><i class="fa-solid fa-phone"></i> <span>+62-822-8942-4809</span></li>
            <li><i class="fa-solid fa-envelope"></i> <span>Adityapratama2292@gmail.com</span></li>
            <li><i class="fa-solid fa-location-dot"></i> <span>Krui, Pesisir Tengah, Pesisir Barat, Lampung 34272</span></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom with Language Switcher Bar -->
      <div class="footer-bottom">
        <p>&copy; 2026 {{ langStore.t('footer.copyright') }}</p>
        
        <div class="footer-center-lang">
          <span class="footer-lang-label"><i class="fa-solid fa-globe"></i> {{ langStore.t('footer.switchLang') }}</span>
          <div class="footer-lang-toggle">
            <button
              type="button"
              class="footer-lang-btn"
              :class="{ active: langStore.currentLang === 'id' }"
              @click="langStore.setLang('id')"
            >
              🇮🇩 Indonesia
            </button>
            <button
              type="button"
              class="footer-lang-btn"
              :class="{ active: langStore.currentLang === 'en' }"
              @click="langStore.setLang('en')"
            >
              🇬🇧 English (US)
            </button>
          </div>
        </div>

        <div class="footer-legal">
          <a href="#" @click.prevent="$emit('openModal', 'modal-terms')">{{ langStore.t('footer.termsOfUse') }}</a>
          <a href="#" @click.prevent="$emit('openModal', 'modal-privacy')">{{ langStore.t('footer.privacy') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useLangStore } from '@/stores/langStore'

defineEmits(['openModal'])
const langStore = useLangStore()
</script>

<style scoped>
.footer-center-lang {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0.5rem 0;
}

.footer-lang-label {
  font-size: 0.8rem;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.footer-lang-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--border-radius-full);
  padding: 3px;
  gap: 3px;
}

.footer-lang-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  padding: 0.25rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-lang-btn:hover {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.12);
}

.footer-lang-btn.active {
  background: var(--color-turquoise);
  color: var(--color-deep-navy);
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(24, 183, 176, 0.3);
}

@media (max-width: 900px) {
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
