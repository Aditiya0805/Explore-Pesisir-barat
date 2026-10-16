<template>
  <section class="section-padding" id="artikel" style="background-color: var(--color-white);">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-primary">Informasi & Edukasi</span>
        <h2>Cerita & Informasi Pesisir Barat</h2>
        <p>Temukan tips perjalanan menarik, kabar desa wisata terbaru, dan panduan liburan di sini.</p>
      </div>

      <div class="articles-grid">
        <article v-for="item in dataStore.articles" :key="item.id" class="article-card">
          <div class="article-img-box">
            <span class="article-category">{{ item.category }}</span>
            <img :src="item.img_url || item.imgUrl" :alt="item.title" class="article-img" loading="lazy">
          </div>
          <div class="article-content">
            <span class="article-date"><i class="fa-solid fa-clock"></i> {{ item.published_date || item.publishedDate }}</span>
            <h3 class="article-title">{{ item.title }}</h3>
            <p class="article-desc">{{ item.description }}</p>
            <a href="#artikel" class="article-link" @click.prevent="openArticle(item)">
              Baca Selengkapnya <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDataStore } from '@/stores/dataStore'

const dataStore = useDataStore()

const openArticle = (item) => {
  alert(`Artikel: ${item.title}\n\n${item.description}\n\n(Informasi lengkap tersedia di pusat informasi Krui).`)
}
</script>
