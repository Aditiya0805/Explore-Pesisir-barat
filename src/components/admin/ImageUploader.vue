<template>
  <div class="image-uploader">
    <div class="iu-head">
      <div>
        <span class="iu-label">{{ label }}</span>
        <p class="iu-hint">
          Otomatis dikompresi di browser, maksimal <strong>1 MB</strong> per gambar.
        </p>
      </div>
      <span class="iu-badge" :class="{ 'is-full': atLimit }">
        {{ multiple ? `${values.length} gambar` : values.length ? '1 gambar' : 'kosong' }}
      </span>
    </div>

    <div v-if="values.length" class="iu-grid">
      <div v-for="(url, idx) in values" :key="`${url}-${idx}`" class="iu-item">
        <img :src="url" :alt="`Gambar ${idx + 1}`" />
        <button type="button" class="iu-remove" title="Hapus gambar" @click="removeAt(idx)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <div
      v-if="!atLimit"
      class="iu-drop"
      :class="{ 'is-over': dragOver, 'is-disabled': uploadDisabled }"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
      @click="pickFile"
    >
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <p v-if="!busy">Klik atau tarik foto ke sini untuk mengunggah</p>
      <p v-else>{{ progressMessage }}</p>
      <span v-if="!busy" class="iu-sub">JPG / PNG / WEBP &middot; foto besar otomatis dikompres</span>
    </div>

    <input ref="fileInput" type="file" accept="image/*" :multiple="multiple" class="iu-input" @change="onChange" />

    <div v-if="uploadDisabled" class="iu-note iu-note--warn">
      <i class="fa-solid fa-circle-info"></i>
      {{ uploadDisabledReason || 'Upload butuh login admin Supabase.' }}
    </div>

    <div v-if="errorMessage" class="iu-note iu-note--error">
      <i class="fa-solid fa-triangle-exclamation"></i> {{ errorMessage }}
    </div>

    <div v-if="lastResult" class="iu-note iu-note--success">
      <i class="fa-solid fa-circle-check"></i>
      Terunggah {{ lastResult.compressed ? `(dikompresi dari ${formatBytes(lastResult.originalSize)} ke ${formatBytes(lastResult.size)})` : `(${formatBytes(lastResult.size)})` }}.
    </div>

    <div class="iu-url-row">
      <input
        v-model="manualUrl"
        type="url"
        class="form-control"
        placeholder="atau tempel URL gambar (https://... / /assets/images/...)"
        @keydown.enter.prevent="addManualUrl"
      />
      <button type="button" class="iu-btn" @click="addManualUrl" :disabled="!manualUrl.trim()">Tambah</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { uploadImage, formatBytes, MAX_UPLOAD_BYTES } from '@/lib/imageUpload'

const props = defineProps({
  modelValue: { type: [String, Array], default: '' },
  label: { type: String, default: 'Gambar' },
  folder: { type: String, default: 'misc' },
  multiple: { type: Boolean, default: false },
  max: { type: Number, default: 6 },
  uploadDisabled: { type: Boolean, default: false },
  uploadDisabledReason: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const busy = ref(false)
const dragOver = ref(false)
const errorMessage = ref('')
const lastResult = ref(null)
const progressMessage = ref('Memproses...')
const manualUrl = ref('')

const values = computed(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? props.modelValue.filter(Boolean) : []
  return props.modelValue ? [props.modelValue] : []
})

const atLimit = computed(() => (props.multiple ? values.value.length >= props.max : values.value.length >= 1))

const setValues = (next) => {
  emit('update:modelValue', props.multiple ? next : next[0] || '')
}

const pickFile = () => {
  if (busy.value) return
  if (props.uploadDisabled) {
    errorMessage.value = props.uploadDisabledReason || 'Upload gambar membutuhkan login admin Supabase.'
    return
  }
  fileInput.value?.click()
}

const onChange = (event) => {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  handleFiles(files)
}

const onDrop = (event) => {
  if (props.uploadDisabled) {
    errorMessage.value = props.uploadDisabledReason || 'Upload gambar membutuhkan login admin Supabase.'
    return
  }
  dragOver.value = false
  handleFiles(Array.from(event.dataTransfer?.files || []))
}

const handleFiles = async (files) => {
  if (!files.length) return
  errorMessage.value = ''
  lastResult.value = null

  const images = files.filter((f) => /^image\//i.test(f.type))
  if (!images.length) {
    errorMessage.value = 'Pilih berkas gambar (JPG, PNG, atau WEBP).'
    return
  }

  busy.value = true
  try {
    const current = [...values.value]
    const limit = props.multiple ? props.max : 1
    for (const file of images) {
      if (current.length >= limit) break
      const result = await uploadImage(file, {
        folder: props.folder,
        onProgress: (p) => {
          progressMessage.value = p.message
        }
      })
      lastResult.value = result
      current.push(result.url)
      setValues([...current])
    }
  } catch (err) {
    errorMessage.value = err?.message || 'Upload gagal.'
  } finally {
    busy.value = false
    progressMessage.value = 'Memproses...'
  }
}

const removeAt = (idx) => {
  const next = [...values.value]
  next.splice(idx, 1)
  setValues(next)
  lastResult.value = null
}

const addManualUrl = () => {
  const url = manualUrl.value.trim()
  if (!url || atLimit.value) return
  setValues([...values.value, url])
  manualUrl.value = ''
}

defineExpose({ MAX_UPLOAD_BYTES })
</script>

<style scoped>
.image-uploader {
  border: 1px dashed var(--color-border);
  border-radius: 12px;
  padding: 0.9rem;
  background: #fbfdff;
}
.iu-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.65rem;
}
.iu-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-deep-navy);
}
.iu-hint {
  margin: 0.15rem 0 0;
  font-size: 0.74rem;
  color: var(--color-text-light);
}
.iu-badge {
  flex-shrink: 0;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--color-ocean-blue);
  background: rgba(8, 126, 164, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}
.iu-badge.is-full {
  color: #b45309;
  background: #fef3c7;
}
.iu-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 0.7rem;
}
.iu-item {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: #fff;
}
.iu-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.iu-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(15, 23, 42, 0.72);
  color: #fff;
  font-size: 0.68rem;
  cursor: pointer;
  display: grid;
  place-items: center;
}
.iu-drop {
  border: 1px dashed #b7d5e4;
  background: #f2f9fc;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.iu-drop.is-over {
  background: #e2f4fb;
  border-color: var(--color-turquoise);
}
.iu-drop.is-disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.iu-drop i {
  color: var(--color-ocean-blue);
  font-size: 1.2rem;
}
.iu-drop p {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-deep-navy);
}
.iu-sub {
  font-size: 0.7rem;
  color: var(--color-text-light);
}
.iu-input {
  display: none;
}
.iu-url-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.65rem;
}
.iu-url-row .form-control {
  flex: 1;
  font-size: 0.78rem;
  padding: 0.45rem 0.65rem;
}
.iu-btn {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 8px;
  padding: 0 0.8rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-deep-navy);
  cursor: pointer;
}
.iu-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.iu-note {
  margin-top: 0.55rem;
  font-size: 0.75rem;
  border-radius: 8px;
  padding: 0.5rem 0.65rem;
  line-height: 1.4;
}
.iu-note--warn {
  background: #fffbeb;
  color: #92400e;
}
.iu-note--error {
  background: #fef2f2;
  color: #b91c1c;
}
.iu-note--success {
  background: #ecfdf5;
  color: #047857;
}
</style>
