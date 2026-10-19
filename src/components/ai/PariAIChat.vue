<template>
  <div>
    <!-- Floating Trigger Button -->
    <div class="ai-assistant-trigger-wrapper" id="aiAssistantTriggerWrapper">
      <button
        class="ai-assistant-trigger"
        id="aiAssistantTrigger"
        :aria-label="langStore.t('ai.triggerTitle')"
        :title="langStore.t('ai.headerTitle')"
        @click="isOpen = !isOpen"
      >
        <div class="ai-trigger-icon">
          <i class="fa-solid fa-robot"></i>
        </div>
        <div class="ai-trigger-text">
          <span class="ai-trigger-title">{{ langStore.t('ai.triggerTitle') }}</span>
          <span class="ai-trigger-sub">{{ langStore.t('ai.triggerSub') }}</span>
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
            <h4>{{ langStore.t('ai.headerTitle') }}</h4>
            <span class="ai-profile-status">{{ langStore.t('ai.headerStatus') }}</span>
          </div>
        </div>
        <div class="ai-header-controls">
          <button class="ai-btn-icon" id="aiChatResetBtn" :title="langStore.t('ai.resetTitle')" :aria-label="langStore.t('ai.resetTitle')" @click="resetChat">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
          <button class="ai-btn-icon" id="aiChatCloseBtn" :title="langStore.t('ai.closeTitle')" :aria-label="langStore.t('ai.closeTitle')" @click="isOpen = false">
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
            <div class="ai-msg-bubble">
              <div class="ai-msg-content" v-html="msg.text"></div>
              <div v-if="msg.actions && msg.actions.length" class="ai-msg-actions">
                <button
                  v-for="(action, aIndex) in msg.actions"
                  :key="aIndex"
                  type="button"
                  class="ai-action-btn"
                  :class="'ai-action-' + action.type"
                  @click="runAction(action)"
                >
                  <i :class="actionIcon(action)"></i>
                  <span>{{ action.label }}</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="isThinking" class="ai-msg-row ai-msg-bot">
            <div class="ai-msg-avatar">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div class="ai-msg-bubble">
              <span class="typing-dots">{{ langStore.t('ai.typing') }}</span>
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
          :placeholder="langStore.t('ai.placeholder')"
          autocomplete="off"
          maxlength="250"
        >
        <button type="submit" class="ai-chat-send-btn" id="aiChatSendBtn" aria-label="Send">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLangStore } from '@/stores/langStore'
import { useDataStore } from '@/stores/dataStore'
import { useBookingStore } from '@/stores/bookingStore'
import { generatePariReply } from '@/lib/pariAI'

const router = useRouter()
const langStore = useLangStore()
const dataStore = useDataStore()
const bookingStore = useBookingStore()

const isOpen = ref(false)
const inputQuery = ref('')
const isThinking = ref(false)
const chatBodyRef = ref(null)

const chips = computed(() => {
  return [
    { label: langStore.t('ai.chip1'), query: langStore.t('ai.chip1Query') },
    { label: langStore.t('ai.chip2'), query: langStore.t('ai.chip2Query') },
    { label: langStore.t('ai.chip3'), query: langStore.t('ai.chip3Query') },
    { label: langStore.t('ai.chip4'), query: langStore.t('ai.chip4Query') },
    { label: langStore.t('ai.chip5'), query: langStore.t('ai.chip5Query') }
  ]
})

const getInitialGreeting = () => ({
  sender: 'bot',
  text: langStore.t('ai.greeting'),
  actions: []
})

const messages = ref([getInitialGreeting()])

watch(() => langStore.currentLang, () => {
  // If only initial message exists, update it to the current language
  if (messages.value.length === 1 && messages.value[0].sender === 'bot') {
    messages.value = [getInitialGreeting()]
  }
})

const scrollToBottom = async () => {
  await nextTick()
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
}

const resetChat = () => {
  messages.value = [getInitialGreeting()]
  scrollToBottom()
}

// Build the live data context so answers reflect real site content.
const buildContext = () => {
  const destinations = dataStore.destinations
    .map(d => langStore.getLocalizedDestination(d))
    .filter(Boolean)

  return {
    isEn: langStore.isEn,
    fmt: langStore.formatCurrency,
    packages: dataStore.packages,
    guides: dataStore.guides,
    destinations
  }
}

const generateReply = (q) => generatePariReply(q, buildContext())

const actionIcon = (action) => {
  if (action.type === 'book') return 'fa-solid fa-ticket'
  if (action.type === 'detail') return 'fa-solid fa-location-dot'
  return 'fa-solid fa-arrow-right'
}

// Direct call-to-action handling from AI replies.
const runAction = (action) => {
  if (!action) return
  if (action.type === 'book' && action.packageId) {
    bookingStore.setPackage(action.packageId)
    isOpen.value = false
    router.push('/booking')
  } else if (action.type === 'detail' && action.destinationId) {
    isOpen.value = false
    router.push(`/detail/${action.destinationId}`)
  } else if (action.type === 'route' && action.route) {
    isOpen.value = false
    router.push(action.route)
  }
}

const sendQuery = async (queryText) => {
  if (!queryText.trim()) return

  messages.value.push({ sender: 'user', text: queryText })
  inputQuery.value = ''
  scrollToBottom()

  isThinking.value = true
  setTimeout(() => {
    isThinking.value = false
    const reply = generateReply(queryText)
    messages.value.push({
      sender: 'bot',
      text: reply.text,
      actions: reply.actions || []
    })
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
