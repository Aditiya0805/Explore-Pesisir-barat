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
          <span>Destinasi Surfing & Pantai Kelas Dunia</span>
        </div>
        <h1>Temukan Keindahan<br><span class="text-gradient-orange">Pesisir Barat</span></h1>
        <p class="subheadline">
          Jelajahi surga tersembunyi Lampung: deburan ombak surfing kelas dunia, eksotisme Pulau Pisang, air terjun asri, hingga kekayaan budaya tenun Tapis.
        </p>
        <div class="hero-buttons">
          <a href="#destinasi" class="btn btn-primary btn-lg" @click.prevent="scrollToSection('destinasi')">
            <i class="fa-solid fa-compass"></i> Jelajahi Destinasi
          </a>
          <router-link to="/booking" class="btn btn-outline btn-lg">
            <i class="fa-solid fa-ticket"></i> Pesan Tiket & Pemandu
          </router-link>
        </div>
      </div>
    </div>

    <!-- Search Reservation Bar -->
    <div class="search-bar-container">
      <div class="search-bar bg-glass">
        <div class="search-input-group">
          <label for="search-dest"><i class="fa-solid fa-map-pin"></i> Mau menjelajah apa?</label>
          <select id="search-dest" v-model="selectedPackage">
            <option value="">Pilih Destinasi / Paket</option>
            <option value="surf">Paket Surfing Adventure</option>
            <option value="beach">Paket Explore Krui</option>
            <option value="sunset">Paket Sunset & Culture</option>
            <option value="family">Pulau Pisang</option>
          </select>
        </div>
        <div class="search-input-group">
          <label for="search-date"><i class="fa-solid fa-calendar"></i> Tanggal Kunjungan</label>
          <input type="date" id="search-date" v-model="selectedDate">
        </div>
        <div class="search-input-group">
          <label for="search-guests"><i class="fa-solid fa-users"></i> Jumlah Orang</label>
          <select id="search-guests" v-model="selectedGuests">
            <option value="1">1 Orang</option>
            <option value="2">2 Orang</option>
            <option value="3">3 Orang</option>
            <option value="4">4 Orang</option>
            <option value="5">5+ Orang</option>
          </select>
        </div>
        <button class="btn btn-primary" id="searchBarBtn" @click="handleSearch">
          <i class="fa-solid fa-magnifying-glass"></i> Cari
        </button>
      </div>
    </div>

    <div class="scroll-indicator" @click="scrollToSection('destinasi')">
      <span>Scroll ke bawah</span>
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

const router = useRouter()
const bookingStore = useBookingStore()

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
