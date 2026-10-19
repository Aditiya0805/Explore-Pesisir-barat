<template>
  <div v-if="activeModal" class="info-modal-backdrop" role="dialog" aria-modal="true" @click.self="close">
    <div class="info-modal-card">
      <div class="info-modal-header">
        <h3 v-if="activeModal === 'modal-terms'">
          <i class="fa-solid fa-file-contract"></i> {{ langStore.t('modals.termsTitle') }}
        </h3>
        <h3 v-else-if="activeModal === 'modal-privacy'">
          <i class="fa-solid fa-shield-halved"></i> {{ langStore.t('modals.privacyTitle') }}
        </h3>
        <h3 v-else-if="activeModal === 'modal-faq'">
          <i class="fa-solid fa-circle-question"></i> {{ langStore.t('modals.faqTitle') }}
        </h3>
        <button class="info-modal-close-btn" :aria-label="langStore.isEn ? 'Close modal' : 'Tutup modal'" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Syarat & Ketentuan -->
      <div v-if="activeModal === 'modal-terms'" class="info-modal-body">
        <p>{{ langStore.t('modals.termsP1') }}</p>
        <h4>{{ langStore.t('modals.termsH1') }}</h4>
        <p>{{ langStore.t('modals.termsP2') }}</p>
        <h4>{{ langStore.t('modals.termsH2') }}</h4>
        <p>{{ langStore.t('modals.termsP3') }}</p>
        <h4>{{ langStore.t('modals.termsH3') }}</h4>
        <p>{{ langStore.t('modals.termsP4') }}</p>
        <h4>{{ langStore.t('modals.termsH4') }}</h4>
        <p>{{ langStore.t('modals.termsP5') }}</p>
      </div>

      <!-- Kebijakan Privasi -->
      <div v-else-if="activeModal === 'modal-privacy'" class="info-modal-body">
        <p>{{ langStore.t('modals.privacyP1') }}</p>
        <h4>{{ langStore.t('modals.privacyH1') }}</h4>
        <p>{{ langStore.t('modals.privacyP2') }}</p>
        <h4>{{ langStore.t('modals.privacyH2') }}</h4>
        <p>{{ langStore.t('modals.privacyP3') }}</p>
        <h4>{{ langStore.t('modals.privacyH3') }}</h4>
        <p>Email: <strong>Adityapratama2292@gmail.com</strong> | WhatsApp: <strong>+62-822-8942-4809</strong></p>
      </div>

      <!-- FAQs -->
      <div v-else-if="activeModal === 'modal-faq'" class="info-modal-body">
        <details class="faq-item">
          <summary>{{ langStore.t('modals.faq1Q') }}</summary>
          <p>{{ langStore.t('modals.faq1A') }}</p>
        </details>
        <details class="faq-item">
          <summary>{{ langStore.t('modals.faq2Q') }}</summary>
          <p>{{ langStore.t('modals.faq2A') }}</p>
        </details>
        <details class="faq-item">
          <summary>{{ langStore.t('modals.faq3Q') }}</summary>
          <p>{{ langStore.t('modals.faq3A') }}</p>
        </details>
        <details class="faq-item">
          <summary>{{ langStore.t('modals.faq4Q') }}</summary>
          <p>{{ langStore.t('modals.faq4A') }}</p>
        </details>
      </div>

      <div class="info-modal-footer">
        <button class="btn btn-primary info-modal-footer-close" @click="close">
          {{ langStore.t('modals.close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLangStore } from '@/stores/langStore'

const langStore = useLangStore()

defineProps({
  activeModal: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>
