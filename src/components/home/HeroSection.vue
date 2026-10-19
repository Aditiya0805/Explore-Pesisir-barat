<template>
  <section class="hero" id="hero">
    <div
      class="hero-bg"
      id="heroBg"
      style="background-image: url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1920&q=80');"
    ></div>
    <div class="hero-overlay"></div>
    <div class="container">
      <div class="hero-content">
        <div class="hero-tag">
          <span class="circle"></span>
          <span>{{ langStore.t('hero.tag') }}</span>
        </div>
        <h1>{{ langStore.t('hero.title1') }}<br><span class="text-gradient-orange">{{ langStore.t('hero.title2') }}</span></h1>
        <p class="subheadline">
          {{ langStore.t('hero.subheadline') }}
        </p>
        <div class="hero-buttons">
          <a href="#destinasi" class="btn btn-primary btn-lg" @click.prevent="scrollToSection('destinasi')">
            <i class="fa-solid fa-compass"></i> {{ langStore.t('hero.exploreBtn') }}
          </a>
          <router-link to="/booking" class="btn btn-outline btn-lg">
            <i class="fa-solid fa-ticket"></i> {{ langStore.t('hero.bookTicketBtn') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Search Reservation Bar -->
    <div class="search-bar-container">
      <div class="search-bar bg-glass">
        <div class="search-input-group">
          <label for="search-dest"><i class="fa-solid fa-map-pin"></i> {{ langStore.t('hero.searchLabel') }}</label>
          <select id="search-dest" v-model="selectedPackage">
            <option value="">{{ langStore.t('hero.selectPackagePlaceholder') }}</option>
            <option value="surf">{{ langStore.t('hero.packageSurf') }}</option>
            <option value="beach">{{ langStore.t('hero.packageBeach') }}</option>
            <option value="sunset">{{ langStore.t('hero.packageSunset') }}</option>
            <option value="family">{{ langStore.t('hero.packageFamily') }}</option>
          </select>
        </div>
        <div class="search-input-group">
          <label for="search-date"><i class="fa-solid fa-calendar"></i> {{ langStore.t('hero.dateLabel') }}</label>
          <input type="date" id="search-date" v-model="selectedDate">
        </div>
        <div class="search-input-group">
          <label for="search-guests"><i class="fa-solid fa-users"></i> {{ langStore.t('hero.guestsLabel') }}</label>
          <select id="search-guests" v-model="selectedGuests">
            <option value="1">{{ langStore.t('hero.guest1') }}</option>
            <option value="2">{{ langStore.t('hero.guest2') }}</option>
            <option value="3">{{ langStore.t('hero.guest3') }}</option>
            <option value="4">{{ langStore.t('hero.guest4') }}</option>
            <option value="5">{{ langStore.t('hero.guest5') }}</option>
          </select>
        </div>
        <button class="btn btn-primary" id="searchBarBtn" @click="handleSearch">
          <i class="fa-solid fa-magnifying-glass"></i> {{ langStore.t('hero.searchBtn') }}
        </button>
      </div>
    </div>

    <div class="scroll-indicator" @click="scrollToSection('destinasi')">
      <span>{{ langStore.t('hero.scrollDown') }}</span>
      <div class="scroll-mouse">
        <div class="scroll-wheel"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/bookingStore'
import { useLangStore } from '@/stores/langStore'

const router = useRouter()
const bookingStore = useBookingStore()
const langStore = useLangStore()

const selectedPackage = ref('')
const selectedDate = ref('')
const selectedGuests = ref('1')

const handleSearch = () => {
  if (selectedPackage.value) {
    bookingStore.setPackage(selectedPackage.value)
  }
  if (selectedDate.value) {
    bookingStore.date = selectedDate.value
  }
  bookingStore.guests = Number(selectedGuests.value) || 1
  router.push('/booking')
}

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
