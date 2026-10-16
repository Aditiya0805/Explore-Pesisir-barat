<template>
  <div class="app-layout">
    <!-- Preloader Splash Screen -->
    <SplashScreen />

    <!-- App Header (Navbar) -->
    <AppHeader v-if="showHeaderFooter" />

    <!-- Main Dynamic Content via Vue Router -->
    <main id="main-content">
      <router-view />
    </main>

    <!-- App Footer -->
    <AppFooter v-if="showHeaderFooter" @openModal="openModal" />

    <!-- Floating AI Assistant (Pari AI) -->
    <PariAIChat v-if="showHeaderFooter" />

    <!-- Info Modals (Terms, Privacy, FAQs) -->
    <InfoModal :activeModal="activeModal" @close="activeModal = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SplashScreen from '@/components/layout/SplashScreen.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import PariAIChat from '@/components/ai/PariAIChat.vue'
import InfoModal from '@/components/modals/InfoModal.vue'
import { useDataStore } from '@/stores/dataStore'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const dataStore = useDataStore()
const authStore = useAuthStore()

const activeModal = ref(null)

const showHeaderFooter = computed(() => {
  return route.name !== 'Admin'
})

const openModal = (modalName) => {
  activeModal.value = modalName
}

onMounted(async () => {
  await Promise.all([
    dataStore.fetchAllData(),
    authStore.initAuth()
  ])
})
</script>

<style>
/* Global Layout Fixes */
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
#main-content {
  flex: 1;
}
</style>
