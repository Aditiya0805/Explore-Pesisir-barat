<template>
  <section class="section-padding" id="artikel" style="background-color: var(--color-white);">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-primary">{{ langStore.t('articles.badge') }}</span>
        <h2>{{ langStore.t('articles.title') }}</h2>
        <p>{{ langStore.t('articles.subtitle') }}</p>
      </div>

      <div class="articles-grid">
        <article v-for="item in dataStore.articles" :key="item.id" class="article-card">
          <div class="article-img-box">
            <span class="article-category">{{ getArticleCategory(item) }}</span>
            <a
              v-if="getArticleUrl(item)"
              :href="getArticleUrl(item)"
              target="_blank"
              rel="noopener noreferrer"
              class="article-img-link"
              :title="getArticleTitle(item)"
            >
              <img :src="item.img_url || item.imgUrl" :alt="getArticleTitle(item)" class="article-img" loading="lazy">
            </a>
            <img v-else :src="item.img_url || item.imgUrl" :alt="getArticleTitle(item)" class="article-img" loading="lazy">
          </div>
          <div class="article-content">
            <span class="article-date"><i class="fa-solid fa-clock"></i> {{ getArticleDate(item) }}</span>
            <h3 class="article-title">
              <a
                v-if="getArticleUrl(item)"
                :href="getArticleUrl(item)"
                target="_blank"
                rel="noopener noreferrer"
                class="article-title-link"
              >
                {{ getArticleTitle(item) }}
              </a>
              <span v-else>{{ getArticleTitle(item) }}</span>
            </h3>
            <p class="article-desc">{{ getArticleDesc(item) }}</p>
            <a
              v-if="getArticleUrl(item)"
              :href="getArticleUrl(item)"
              target="_blank"
              rel="noopener noreferrer"
              class="article-link"
            >
              {{ langStore.t('articles.readMore') }} <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <a
              v-else
              href="#artikel"
              class="article-link"
              @click.prevent="openArticle(item)"
            >
              {{ langStore.t('articles.readMore') }} <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDataStore } from '@/stores/dataStore'
import { useLangStore } from '@/stores/langStore'

const dataStore = useDataStore()
const langStore = useLangStore()

const enArticles = {
  1: {
    title: "Complete Surfing Guide to Krui & Pesisir Barat: From Beginner to Pro",
    description: "Learn about prime swell seasons, beachfront surf camps, and ocean safety tips along Sumatra's Indian Ocean coast.",
    category: "Travel Guide",
    date: "October 12, 2026",
    url: "https://thesurfatlas.com/surfing-indonesia/krui-surf/"
  },
  2: {
    title: "Unveiling the Hidden Wonders of Banana Island: How to Get There & Highlights",
    description: "A pristine tropical island with powder-soft white sand, morning wild dolphin sightings, and heritage colonial houses.",
    category: "Destinations",
    date: "October 5, 2026",
    url: "https://www.beritasatu.com/nusantara/2957318/pesona-pulau-pisang-lampung-surga-tersembunyi-yang-wajib-dikunjungi"
  },
  3: {
    title: "Exploring the Ancient Art of Gold-Thread Tapis Weaving in Pesisir Barat",
    description: "Traditional Saibatin woven gold-thread fabrics carrying rich coastal cultural symbolism and heritage craftsmanship.",
    category: "Culture",
    date: "September 28, 2026",
    url: "https://wawainews.id/mengenal-kain-tapis-lampung-jenis-motif-makna-filosofis-dan-sejarah-warisan-budaya/"
  }
}

const getArticleTitle = (item) => {
  return langStore.isEn && enArticles[item.id] ? enArticles[item.id].title : item.title
}

const getArticleDesc = (item) => {
  return langStore.isEn && enArticles[item.id] ? enArticles[item.id].description : item.description
}

const getArticleCategory = (item) => {
  return langStore.isEn && enArticles[item.id] ? enArticles[item.id].category : item.category
}

const getArticleDate = (item) => {
  return langStore.isEn && enArticles[item.id] ? enArticles[item.id].date : (item.published_date || item.publishedDate)
}

const getArticleUrl = (item) => {
  if (item.id === 1 || (item.title && (item.title.includes('Surfing di Krui') || item.title.includes('Surfing Guide')))) {
    return 'https://thesurfatlas.com/surfing-indonesia/krui-surf/'
  }
  if (item.id === 2 || (item.title && item.title.includes('Pulau Pisang'))) {
    return 'https://www.beritasatu.com/nusantara/2957318/pesona-pulau-pisang-lampung-surga-tersembunyi-yang-wajib-dikunjungi'
  }
  if (item.id === 3 || (item.title && item.title.includes('Kain Tapis'))) {
    return 'https://wawainews.id/mengenal-kain-tapis-lampung-jenis-motif-makna-filosofis-dan-sejarah-warisan-budaya/'
  }
  return item.url || (langStore.isEn && enArticles[item.id]?.url) || null
}

const openArticle = (item) => {
  const url = getArticleUrl(item)
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
    return
  }
  const title = getArticleTitle(item)
  const desc = getArticleDesc(item)
  const notice = langStore.t('articles.noticeFull')
  alert(`${title}\n\n${desc}\n\n(${notice})`)
}
</script>

<style scoped>
.article-title-link {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast, 0.2s ease);
}
.article-title-link:hover {
  color: var(--color-ocean-blue);
}
.article-img-link {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
