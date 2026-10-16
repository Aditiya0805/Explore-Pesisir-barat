<template>
  <div>
    <!-- Floating Trigger Button -->
    <div class="ai-assistant-trigger-wrapper" id="aiAssistantTriggerWrapper">
      <button
        class="ai-assistant-trigger"
        id="aiAssistantTrigger"
        aria-label="Buka Asisten Wisata AI"
        title="Tanya Pari AI - Rekomendasi Wisata"
        @click="isOpen = !isOpen"
      >
        <div class="ai-trigger-icon">
          <i class="fa-solid fa-robot"></i>
        </div>
        <div class="ai-trigger-text">
          <span class="ai-trigger-title">Tanya Pari AI</span>
          <span class="ai-trigger-sub">Asisten Wisata</span>
        </div>
        <span class="ai-trigger-pulse"></span>
      </button>
    </div>

    <!-- Chat Window Modal -->
    <div class="ai-chat-modal" :class="{ 'is-open': isOpen }" id="aiChatModal" :aria-hidden="!isOpen">
      <!-- Header -->
      <div class="ai-chat-header">
        <div class="ai-header-profile">
          <div class="ai-avatar-box">
            <i class="fa-solid fa-robot"></i>
            <span class="ai-online-indicator"></span>
          </div>
          <div class="ai-profile-meta">
            <h4>Pari AI • Pemandu Cerdas</h4>
            <span class="ai-profile-status">Siap bantu cari destinasi impianmu ✨</span>
          </div>
        </div>
        <div class="ai-header-controls">
          <button class="ai-btn-icon" id="aiChatResetBtn" title="Mulai percakapan baru" aria-label="Reset chat" @click="resetChat">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
          <button class="ai-btn-icon" id="aiChatCloseBtn" title="Tutup asisten AI" aria-label="Tutup chat" @click="isOpen = false">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Messages List -->
      <div class="ai-chat-body" id="aiChatBody" ref="chatBodyRef">
        <div class="ai-chat-messages" id="aiChatMessages">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="ai-msg-row"
            :class="msg.sender === 'bot' ? 'ai-msg-bot' : 'ai-msg-user'"
          >
            <div class="ai-msg-avatar" v-if="msg.sender === 'bot'">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div class="ai-msg-bubble" v-html="msg.text"></div>
          </div>

          <div v-if="isThinking" class="ai-msg-row ai-msg-bot">
            <div class="ai-msg-avatar">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div class="ai-msg-bubble">
              <span class="typing-dots">Sedang mengetik...</span>
            </div>
          </div>
        </div>

        <!-- Quick Suggestion Chips -->
        <div class="ai-quick-chips" id="aiQuickChips">
          <button
            v-for="(chip, idx) in chips"
            :key="idx"
            class="ai-chip-btn"
            @click="sendQuery(chip.query)"
          >
            {{ chip.label }}
          </button>
        </div>
      </div>

      <!-- Input Footer -->
      <form class="ai-chat-footer" id="aiChatForm" @submit.prevent="handleSubmit">
        <input
          type="text"
          class="ai-chat-input"
          id="aiChatInput"
          v-model="inputQuery"
          placeholder="Ketik pertanyaan atau cari destinasi..."
          autocomplete="off"
          maxlength="250"
        >
        <button type="submit" class="ai-chat-send-btn" id="aiChatSendBtn" aria-label="Kirim pesan">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const isOpen = ref(false)
const inputQuery = ref('')
const isThinking = ref(false)
const chatBodyRef = ref(null)

const chips = [
  { label: '🏄 Surfing Pemula', query: 'Spot surfing terbaik untuk pemula di mana ya?' },
  { label: '👨‍👩‍👧 Pantai Keluarga', query: 'Rekomendasi pantai yang ramah anak dan keluarga?' },
  { label: '🐬 Pulau Pisang', query: 'Bagaimana cara ke Pulau Pisang dan lihat lumba-lumba?' },
  { label: '🍲 Kuliner & Seruit', query: 'Apa saja kuliner khas dan oleh-oleh Pesisir Barat?' },
  { label: '💰 Pemandu & Biaya', query: 'Berapa biaya sewa pemandu lokal dan paket wisata?' }
]

const initialMessage = {
  sender: 'bot',
  text: '<p>Halo Traveler! 👋 Saya <strong>Pari AI</strong>, pemandu wisata pintar Pesisir Barat.</p><p>Mau liburan seru seperti apa? Ceritakan preferensimu (misal: <em>ingin berselancar pemula</em>, <em>wisata santai keluarga</em>, <em>kuliner khas</em>, atau <em>budget hemat</em>), atau klik pertanyaan cepat di bawah:</p>'
}

const messages = ref([{ ...initialMessage }])

const scrollToBottom = async () => {
  await nextTick()
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
}

const resetChat = () => {
  messages.value = [{ ...initialMessage }]
  scrollToBottom()
}

const generateReply = (q) => {
  const query = q.toLowerCase()

  if (query.includes('surfing') || query.includes('selancar') || query.includes('ombak')) {
    return `<strong>🏄 Rekomendasi Spot Surfing:</strong><br>
    1. <strong>Pantai Karang Nyimbor (Ujung Bocur):</strong> Ombak kidal (left-hander) kelas dunia sepanjang 200m. Cocok untuk intermediate hingga pro.<br>
    2. <strong>Pantai Way Jambu:</strong> Ombak barrel cepat bertenaga tinggi.<br>
    3. <strong>Pantai Labuhan Jukung:</strong> Sangat pas untuk surfer pemula karena arusnya lebih bersahabat dan banyak persewaan papan.`
  }

  if (query.includes('keluarga') || query.includes('anak') || query.includes('ramah')) {
    return `<strong>👨‍👩‍👧 Rekomendasi Wisata Keluarga:</strong><br>
    1. <strong>Pantai Biha:</strong> Garis pantai landai, ombak tenang, banyak perahu jukung nelayan, dan pusat kuliner ikan bakar.<br>
    2. <strong>Pantai Labuhan Jukung:</strong> Taman terbuka publik luas dengan fasilitas lengkap.<br>
    3. <strong>Konservasi Penyu Muara Tembulih:</strong> Sangat edukatif untuk anak-anak belajar melepas tukik penyu ke samudra!`
  }

  if (query.includes('pisang') || query.includes('lumba') || query.includes('pulau')) {
    return `<strong>🐬 Eksplorasi Pulau Pisang:</strong><br>
    Pulau terpencil dengan air laut sebening kristal dan pasir putih halus. Anda bisa menyeberang naik perahu dari dermaga Tembakak (sekitar 30-45 menit). Kawanan lumba-lumba liar sering menyapa perahu saat pagi hari (07:00 - 09:00 WIB). Jangan lewatkan rumah bersejarah peninggalan Belanda!`
  }

  if (query.includes('kuliner') || query.includes('makan') || query.includes('seruit') || query.includes('oleh')) {
    return `<strong>🍲 Kuliner Khas Krui:</strong><br>
    1. <strong>Seruit Lampung:</strong> Ikan bakar segar dipadu sambal terasi, tempoyak durian, dan aneka lalapan.<br>
    2. <strong>Ikan Tuhuk (Blue Marlin):</strong> Steak atau sate ikan tuhuk khas Samudra Hindia Krui.<br>
    3. <strong>Oleh-oleh:</strong> Kain tenun Tapis benang emas tradisional khas Saibatin!`
  }

  if (query.includes('harga') || query.includes('biaya') || query.includes('paket') || query.includes('pemandu')) {
    return `<strong>💰 Estimasi Biaya & Paket:</strong><br>
    - <strong>Paket Surfing Adventure:</strong> Rp 2.450.000 / pax (3H2M + homestay + coaching)<br>
    - <strong>Paket Explore Krui:</strong> Rp 1.200.000 / pax (2H1M + vila + motor)<br>
    - <strong>Paket Pulau Pisang:</strong> Rp 300.000 / pack<br>
    - <strong>Jasa Pemandu Lokal:</strong> Rp 250.000 - Rp 350.000 / hari.`
  }

  return `Pesisir Barat Lampung menyimpan pesona luar biasa mulai dari ombak surfing kelas dunia di Karang Nyimbor, keindahan Pulau Pisang, hingga kearifan kain tenun Tapis. Anda bisa memilih menu <strong>Pesan Sekarang</strong> di bagian atas untuk reservasi paket wisata langsung!`
}

const sendQuery = async (queryText) => {
  if (!queryText.trim()) return

  messages.value.push({ sender: 'user', text: queryText })
  inputQuery.value = ''
  scrollToBottom()

  isThinking.value = true
  setTimeout(() => {
    isThinking.value = false
    const botReply = generateReply(queryText)
    messages.value.push({ sender: 'bot', text: botReply })
    scrollToBottom()
  }, 600)
}

const handleSubmit = () => {
  sendQuery(inputQuery.value)
}
</script>

<style scoped>
.ai-chat-modal {
  display: none;
}
.ai-chat-modal.is-open {
  display: flex;
}
.typing-dots {
  font-style: italic;
  color: var(--color-text-medium);
  font-size: 0.85rem;
}
</style>
