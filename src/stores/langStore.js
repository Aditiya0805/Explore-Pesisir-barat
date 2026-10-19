import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { translations } from '@/i18n/translations'

export const useLangStore = defineStore('lang', () => {
  // Read initial language from localStorage or browser navigator
  const getInitialLang = () => {
    const saved = localStorage.getItem('pw_lang')
    if (saved && (saved === 'id' || saved === 'en')) {
      return saved
    }
    const navLang = navigator.language || navigator.userLanguage || 'id'
    return navLang.toLowerCase().startsWith('en') ? 'en' : 'id'
  }

  const currentLang = ref(getInitialLang())

  const isEn = computed(() => currentLang.value === 'en')

  // Reactive translation lookup
  const t = (keyPath, fallback = '') => {
    const lang = currentLang.value
    const keys = keyPath.split('.')

    // Try current language first
    let val = translations[lang]
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k]
      } else {
        val = undefined
        break
      }
    }

    if (val !== undefined && typeof val === 'string') {
      return val
    }

    // Fallback to Indonesian if missing in current
    if (lang !== 'id') {
      let idVal = translations['id']
      for (const k of keys) {
        if (idVal && typeof idVal === 'object' && k in idVal) {
          idVal = idVal[k]
        } else {
          idVal = undefined
          break
        }
      }
      if (idVal !== undefined && typeof idVal === 'string') {
        return idVal
      }
    }

    return fallback || keyPath
  }

  const setLang = (langCode) => {
    if (langCode !== 'id' && langCode !== 'en') return
    currentLang.value = langCode
    localStorage.setItem('pw_lang', langCode)
    updateDocumentMetadata()
  }

  const toggleLang = () => {
    setLang(currentLang.value === 'id' ? 'en' : 'id')
  }

  const updateDocumentMetadata = () => {
    document.documentElement.lang = currentLang.value
    document.title = t('meta.title')

    const setMeta = (selector, value) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', value)
    }

    setMeta('meta[name="description"]', t('meta.description'))
    setMeta('meta[property="og:title"]', t('meta.title'))
    setMeta('meta[property="og:description"]', t('meta.description'))
    setMeta('meta[name="twitter:title"]', t('meta.title'))
    setMeta('meta[name="twitter:description"]', t('meta.description'))
    setMeta('meta[name="title"]', t('meta.title'))
  }

  // Format currency dynamically based on selected locale
  const formatCurrency = (val) => {
    if (!val && val !== 0) return currentLang.value === 'en' ? 'Free' : 'Gratis'
    if (val === 0) return currentLang.value === 'en' ? 'Free' : 'Gratis'

    if (currentLang.value === 'en') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }).format(val).replace('IDR', 'IDR ')
    }

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val)
  }

  // Localized package helper
  const getPackageInfo = (pkgId) => {
    const pkgTranslations = {
      surf: {
        en: {
          name: 'Surfing Adventure Package',
          subtitle: 'Homestay, surfboards, professional coach & spot transfers',
          duration: '3 Days 2 Nights',
          minPersons: '1 Person',
          amenities: ['Surf Camp / Homestay', 'ISA Certified Coach', 'Board Rental & Wax', '4WD Spot Shuttle', 'All Destination Passes']
        },
        id: {
          name: 'Paket Surfing Adventure',
          subtitle: 'Homestay, papan selancar, pelatih profesional & antar jemput spot',
          duration: '3 Hari 2 Malam',
          minPersons: '1 Orang',
          amenities: ['Homestay Tepi Pantai', 'Pelatih Bersertifikat ISA', 'Sewa Papan Selancar', 'Transport Antar Jemput', 'Tiket Masuk Spot']
        }
      },
      beach: {
        en: {
          name: 'Explore Krui Package',
          subtitle: 'Beachfront villa, local guide, motorbike rental & entry tickets',
          duration: '2 Days 1 Night',
          minPersons: '2 Persons',
          amenities: ['Beachfront Villa', 'Motorbike Rental', 'Destination Passes', 'Local Tour Guide', 'Traditional Seruit Meal']
        },
        id: {
          name: 'Paket Explore Krui',
          subtitle: 'Vila tepi pantai, pemandu lokal, sewa motor & dokumentasi',
          duration: '2 Hari 1 Malam',
          minPersons: '2 Orang',
          amenities: ['Vila Tepi Pantai', 'Sewa Motor', 'Tiket Wisata', 'Tour Guide', 'Kuliner Seruit']
        }
      },
      sunset: {
        en: {
          name: 'Sunset & Culture Package',
          subtitle: 'Seafood dining, Saibatin cultural village & traditional Tapis weaving',
          duration: '1 Full Day',
          minPersons: '2 Persons',
          amenities: ['Grilled Seafood Lunch', 'Tapis Weaving Workshop', 'Local Transportation', 'Cultural Heritage Guide']
        },
        id: {
          name: 'Paket Sunset & Culture',
          subtitle: 'Kuliner seafood tepi pantai, keliling desa adat & tenun Tapis',
          duration: '1 Hari Penuh',
          minPersons: '2 Orang',
          amenities: ['Kuliner Ikan Bakar', 'Workshop Tapis', 'Transport Lokal', 'Pemandu Budaya']
        }
      },
      family: {
        en: {
          name: 'Banana Island Tour',
          subtitle: 'Island boat trip, Batu Ghuri, Liang Cave & Fresh Grilled Fish BBQ',
          duration: '1 Full Day',
          minPersons: '4 Persons',
          amenities: ['Round-trip Jukung Boat', 'Snorkeling Gear', 'Fresh Grilled Fish Lunch', 'Full Island Guided Tour']
        },
        id: {
          name: 'Paket Wisata Pulau Pisang',
          subtitle: 'Tour Pulau Pisang, Batu Ghuri, Goa Liang & BBQ Ikan Bakar',
          duration: '1 Hari Penuh',
          minPersons: '4 Orang',
          amenities: ['Sewa Kapal PP', 'Snorkeling Gear', 'Makan Siang Ikan Bakar', 'Keliling Pulau']
        }
      }
    }

    const lang = currentLang.value
    return pkgTranslations[pkgId]?.[lang] || pkgTranslations[pkgId]?.['id'] || null
  }

  // English dictionary for destinations
  const destinationEnData = {
    1: {
      category: "World-Class Beach & Surfing",
      description: "A world-renowned surfing haven featuring the legendary Ujung Bocur peeling left-hander wave.",
      long_description: "Karang Nyimbor Beach is the international ground zero for wave riding in Pesisir Barat. It boasts one of the longest, most consistent peeling left-handers on the planet known as the 'Ujung Bocur Wave', holding swells up to 6–7 meters during prime season (May - October). In addition to world-class surfing, the shoreline offers scenic coral formations, traditional relaxation gazebos, and golden sands at dusk.",
      facilities: ["Spacious Secure Parking", "Clean Toilets & Showers", "Surf Camps & Oceanfront Lodging", "Board & Gear Rental", "Seafood Beach Shacks"]
    },
    2: {
      category: "Beach & Nature Conservation",
      description: "Renowned as Sumatra's 'Pipeline' with high-powered, hollow reef barrels.",
      long_description: "Way Jambu Beach offers classic tropical scenery framed by lush palm groves along a pristine sandy coastline. Its waves form fast, powerful, and heavy barrels over shallow reefs, making it a favorite for advanced surfing enthusiasts. Non-surfers enjoy serene seclusion away from city noise, pristine cleanliness, and fiery sunsets against crushing ocean spray.",
      facilities: ["Oceanfront Camping Grounds", "Clean Restrooms", "Shaded Gazebos", "Beach Apparel Stalls", "Licensed Local Guides"]
    },
    3: {
      category: "Volcanic Black Sand Beach",
      description: "Expanses of shimmering black volcanic sand with breathtaking sunset panoramas.",
      long_description: "Mandiri Beach is famed for its wide expanse of smooth volcanic black sand that sparkles under the afternoon sun. Its long stretch makes it ideal for leisurely strolls, coastal horseback riding, enjoying sunsets over the Indian Ocean, and cinematic landscape photography.",
      facilities: ["Sunset Photography Vantage", "Beachfront Coffee Shacks", "Vehicle Parking", "Prayer Room (Mushola)", "Restful Gazebos"]
    },
    4: {
      category: "Recreation & Cultural Hub",
      description: "The signature urban beach of Krui featuring open amphitheaters and coastal culinary spots.",
      long_description: "Labuhan Jukung Beach is the lively recreational heart of Krui. Featuring open green spaces, cultural performance stages, and rows of local seafood stalls, its welcoming waters are also ideal for beginner to intermediate surfers.",
      facilities: ["Public Waterfront Park", "Cultural Amphitheater", "Fresh Grilled Fish Stalls", "Visitor Center", "Spacious Restrooms & Parking"]
    },
    6: {
      category: "Tropical Rainforest Ecotourism",
      description: "Pristine mountain cascade hidden amidst the lush rainforest canopies of Krui.",
      long_description: "Way Detun Waterfall offers crystal-clear, refreshing mountain waters with natural turquoise pools underneath. Surrounded by dramatic rock shelves and lush greenery, it provides the ultimate refreshing escape after exploring ocean swells.",
      facilities: ["Scenic Trekking Paths", "Resting Shelters", "Local Nature Guides", "Snack Stalls", "Natural Photo Spots"]
    },
    10: {
      category: "Cultural Heritage & Crafts (SDG 11.4)",
      description: "Center of traditional Saibatin gold-thread handwoven Tapis textiles.",
      long_description: "The Pesisir Barat Tapis Weaving Center empowers local women artisans in safeguarding traditional Lampung motifs woven with fine golden threads. Visitors can experience hand-weaving demonstrations and purchase authentic hand-crafted textiles directly from makers.",
      facilities: ["Tapis Craft Gallery", "Weaving Workshops", "Souvenir Boutique", "Cultural Educators", "Restroom Facilities"]
    },
    14: {
      category: "Exotic Island & Marine Paradise",
      description: "Secluded island haven with crystal-clear waters, wild dolphins & historic colonial architecture.",
      long_description: "Banana Island is the most captivating marine gem of Pesisir Barat. Floating in the Indian Ocean off Krui, it offers crystalline waters, vibrant coral gardens, powder-soft white sand, morning pods of wild dolphins leaping beside wooden boats, and classic heritage houses from the colonial era.",
      facilities: ["Boat Pier & Harbour", "Traditional Wooden Homestays", "Snorkeling Equipment Rental", "Island Guides", "Fresh Catch Dining"]
    },
    16: {
      category: "Marine Leisure & Seruit Dining",
      description: "Gentle golden sandy beach, home to traditional Jukung fishing fleets and local grilled fish centers.",
      long_description: "Biha Beach features gentle slopes and moderate waves, making it one of the safest swimming and family relaxation spots in the regency. Travelers can watch colorful traditional 'Jukung' outrigger boats return with fresh catches, accompanied by traditional Krui grilled fish and spicy sambal seruit.",
      facilities: ["Fresh Seruit Dining", "Children's Swim Ring Rental", "Prayer Room", "Jukung Boat Photography", "Tapis Souvenir Center"]
    },
    17: {
      category: "Marine Wildlife Sanctuary (SDG 14)",
      description: "Conservation and nesting sanctuary for endangered leatherback and hawksbill sea turtles.",
      long_description: "Muara Tembulih Turtle Sanctuary is dedicated to preserving endangered marine turtles (leatherback, hawksbill, and olive ridley). Visitors learn about the turtle lifecycle, observe semi-natural hatchery nests, and take part in releasing hatchlings into the open Indian Ocean.",
      facilities: ["Hatchery & Education Center", "Turtle Quarantine Pools", "Conservation Guides", "Hatchling Release Zone", "Toilets & Observation Gazebos"]
    }
  }

  const getLocalizedDestination = (dest) => {
    if (!dest) return null
    if (currentLang.value === 'id') return dest

    const enOverride = destinationEnData[dest.id]
    if (!enOverride) return dest

    return {
      ...dest,
      category: enOverride.category || dest.category,
      description: enOverride.description || dest.description,
      long_description: enOverride.long_description || dest.long_description,
      facilities: enOverride.facilities || dest.facilities
    }
  }

  // Watch for language changes to sync metadata
  watch(currentLang, () => {
    updateDocumentMetadata()
  }, { immediate: true })

  return {
    currentLang,
    isEn,
    t,
    setLang,
    toggleLang,
    formatCurrency,
    getPackageInfo,
    getLocalizedDestination
  }
})
