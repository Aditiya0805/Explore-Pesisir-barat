<template>
  <div class="lang-switcher-wrapper" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      type="button"
      class="lang-btn"
      :class="{ 'is-open': isOpen, 'compact': compact }"
      :title="langStore.currentLang === 'id' ? 'Ganti Bahasa (Change Language)' : 'Switch Language'"
      aria-label="Language selector"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      @click="toggleDropdown"
    >
      <i class="fa-solid fa-globe lang-globe-icon"></i>
      <span class="lang-code">{{ currentOption.code }}</span>
      <span class="lang-flag">{{ currentOption.flag }}</span>
      <i class="fa-solid fa-chevron-down lang-chevron" :class="{ 'rotate': isOpen }"></i>
    </button>

    <!-- Dropdown Menu -->
    <transition name="lang-dropdown-anim">
      <div v-if="isOpen" class="lang-dropdown-menu" role="menu">
        <div class="lang-dropdown-header">
          <i class="fa-solid fa-language"></i>
          <span>{{ langStore.currentLang === 'id' ? 'Pilih Bahasa' : 'Select Language' }}</span>
        </div>
        <button
          v-for="opt in options"
          :key="opt.code"
          type="button"
          class="lang-dropdown-item"
          :class="{ 'active': langStore.currentLang === opt.code }"
          role="menuitem"
          @click="selectLang(opt.code)"
        >
          <span class="lang-flag-lg">{{ opt.flag }}</span>
          <div class="lang-text-group">
            <span class="lang-name">{{ opt.name }}</span>
            <span class="lang-native">{{ opt.native }}</span>
          </div>
          <i v-if="langStore.currentLang === opt.code" class="fa-solid fa-circle-check lang-check"></i>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLangStore } from '@/stores/langStore'

const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  }
})

const langStore = useLangStore()
const isOpen = ref(false)
const dropdownRef = ref(null)

const options = [
  { code: 'id', name: 'Bahasa Indonesia', native: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English (US)', native: 'International', flag: '🇬🇧' }
]

const currentOption = computed(() => {
  return options.find(o => o.code === langStore.currentLang) || options[0]
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLang = (code) => {
  langStore.setLang(code)
  isOpen.value = false
}

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.lang-switcher-wrapper {
  position: relative;
  display: inline-block;
  user-select: none;
}

.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.12);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--border-radius-full);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.15);
}

.lang-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.45);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.lang-btn.is-open {
  background: rgba(255, 255, 255, 0.25);
  border-color: var(--color-turquoise);
  box-shadow: 0 0 0 3px rgba(24, 183, 176, 0.25);
}

/* Scrolled Navbar Adaptations */
:global(.header.scrolled) .lang-btn {
  color: var(--color-deep-navy);
  background: rgba(8, 126, 164, 0.07);
  border-color: rgba(8, 126, 164, 0.2);
}

:global(.header.scrolled) .lang-btn:hover {
  background: rgba(8, 126, 164, 0.14);
  border-color: rgba(8, 126, 164, 0.35);
  color: var(--color-ocean-blue);
}

:global(.header.scrolled) .lang-btn.is-open {
  background: rgba(8, 126, 164, 0.15);
  border-color: var(--color-ocean-blue);
}

.lang-globe-icon {
  font-size: 0.85rem;
  color: var(--color-turquoise);
}

.lang-code {
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.lang-flag {
  font-size: 1rem;
  line-height: 1;
}

.lang-chevron {
  font-size: 0.65rem;
  opacity: 0.8;
  transition: transform 0.25s ease;
}

.lang-chevron.rotate {
  transform: rotate(180deg);
}

/* Dropdown Menu styling */
.lang-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 210px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(8, 126, 164, 0.15);
  border-radius: var(--border-radius-md);
  padding: 0.5rem;
  box-shadow: 0 16px 36px -4px rgba(7, 59, 76, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.6);
  z-index: 1000;
  transform-origin: top right;
}

.lang-dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.65rem 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--color-text-light);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0.35rem;
}

.lang-dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.75rem;
  border-radius: var(--border-radius-sm);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.lang-dropdown-item:hover {
  background: rgba(8, 126, 164, 0.08);
}

.lang-dropdown-item.active {
  background: linear-gradient(135deg, rgba(8, 126, 164, 0.12), rgba(24, 183, 176, 0.12));
}

.lang-flag-lg {
  font-size: 1.35rem;
  line-height: 1;
}

.lang-text-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.lang-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-deep-navy);
}

.lang-native {
  font-size: 0.7rem;
  color: var(--color-text-light);
  font-weight: 500;
}

.lang-check {
  color: var(--color-turquoise);
  font-size: 0.95rem;
}

/* Animations */
.lang-dropdown-anim-enter-active,
.lang-dropdown-anim-leave-active {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.lang-dropdown-anim-enter-from,
.lang-dropdown-anim-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

@media (max-width: 1100px) {
  .lang-btn {
    color: var(--color-deep-navy);
    background: rgba(8, 126, 164, 0.08);
    border-color: rgba(8, 126, 164, 0.2);
  }
  .lang-dropdown-menu {
    right: 0;
    left: auto;
  }
}

@media (max-width: 480px) {
  .lang-btn {
    padding: 0.35rem 0.55rem;
    gap: 0.3rem;
  }
  .lang-globe-icon {
    display: none;
  }
  .lang-code {
    font-size: 0.75rem;
  }
  .lang-dropdown-menu {
    min-width: 195px;
    right: 0;
    left: auto;
  }
}
</style>
