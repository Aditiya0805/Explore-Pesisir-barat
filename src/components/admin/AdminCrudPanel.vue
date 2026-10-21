<template>
  <div class="crud-panel">
    <div class="crud-toolbar">
      <div class="crud-toolbar-info">
        <h3><i :class="config.icon"></i> {{ config.title }}</h3>
        <p>{{ config.description }}</p>
      </div>
      <div class="crud-toolbar-actions">
        <input
          v-model="search"
          type="search"
          class="form-control crud-search"
          placeholder="Cari data..."
          v-if="!config.single"
        />
        <button
          v-if="canCreate"
          class="btn btn-primary crud-btn"
          :disabled="readOnly || saving"
          @click="openCreate"
        >
          <i class="fa-solid fa-plus"></i> Tambah
        </button>
      </div>
    </div>

    <div v-if="!configured" class="crud-alert crud-alert--warn">
      <i class="fa-solid fa-plug-circle-xmark"></i>
      <div>
        <strong>Supabase belum terhubung.</strong>
        <p>Isi <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> pada berkas <code>.env</code>, lalu jalankan <code>supabase_schema.sql</code> di SQL Editor Supabase.</p>
      </div>
    </div>

    <div v-else-if="readOnly" class="crud-alert crud-alert--warn">
      <i class="fa-solid fa-lock"></i>
      <div>
        <strong>Mode demo lokal.</strong>
        <p>{{ readOnlyReason || 'Login memakai akun Supabase Auth agar perubahan tersimpan ke database.' }}</p>
      </div>
    </div>

    <div v-if="toast.message" class="crud-alert" :class="`crud-alert--${toast.type}`">
      <i :class="toast.type === 'error' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check'"></i>
      <div>{{ toast.message }}</div>
    </div>

    <div v-if="loading" class="crud-state">
      <i class="fa-solid fa-spinner fa-spin"></i> Memuat data dari Supabase...
    </div>

    <template v-else>
      <div v-if="!config.single" class="table-responsive">
        <table class="admin-table crud-table">
          <thead>
            <tr>
              <th v-for="col in listFields" :key="col.key">{{ col.label }}</th>
              <th class="crud-actions-col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredRows" :key="row[config.idColumn]">
              <td v-for="col in listFields" :key="col.key">
                <template v-if="col.listType === 'image'">
                  <img v-if="row[col.key]" :src="row[col.key]" :alt="row.name || row.title || 'gambar'" class="crud-thumb" />
                  <span v-else class="crud-muted">—</span>
                </template>
                <template v-else-if="col.listType === 'currency'">
                  {{ formatPrice(row[col.key]) }}
                </template>
                <template v-else-if="col.listType === 'boolean'">
                  <span class="crud-pill" :class="row[col.key] ? 'is-on' : 'is-off'">
                    {{ row[col.key] ? 'Ya' : 'Tidak' }}
                  </span>
                </template>
                <template v-else>
                  {{ displayValue(row[col.key]) }}
                </template>
              </td>
              <td>
                <div class="crud-row-actions">
                  <button class="crud-icon-btn" title="Edit" :disabled="readOnly || saving" @click="openEdit(row)">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button
                    v-if="canDelete"
                    class="crud-icon-btn crud-icon-btn--danger"
                    title="Hapus"
                    :disabled="readOnly || saving"
                    @click="askDelete(row)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredRows.length">
              <td :colspan="listFields.length + 1" class="crud-empty">
                <i class="fa-solid fa-inbox"></i>
                <p>{{ rows.length ? 'Tidak ada data yang cocok dengan pencarian.' : 'Belum ada data pada tabel ini.' }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Settings: single form -->
      <div v-else class="crud-single">
        <div class="crud-form-grid">
          <div v-for="field in visibleFields" :key="field.key" class="crud-field" :class="{ 'is-full': field.full }">
            <label>{{ field.label }}</label>
            <textarea
              v-if="field.type === 'textarea'"
              v-model="form[field.key]"
              class="form-control"
              :rows="field.rows || 3"
              :disabled="readOnly"
            ></textarea>
            <input
              v-else
              v-model="form[field.key]"
              :type="field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'"
              class="form-control"
              :disabled="readOnly"
            />
          </div>
        </div>
        <div class="crud-single-footer">
          <button class="btn btn-primary crud-btn" :disabled="readOnly || saving" @click="save">
            <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-floppy-disk"></i>
            {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
          </button>
        </div>
      </div>
    </template>

    <!-- Create / edit dialog -->
    <div v-if="formOpen" class="crud-overlay" @click.self="closeForm">
      <div class="crud-modal">
        <div class="crud-modal-head">
          <h3>{{ editing ? `Edit ${config.title}` : `Tambah ${config.title}` }}</h3>
          <button class="crud-icon-btn" @click="closeForm"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="crud-modal-body">
          <div v-if="formError" class="crud-alert crud-alert--error">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div>{{ formError }}</div>
          </div>
          <div class="crud-form-grid">
            <template v-for="field in visibleFields" :key="field.key">
              <div class="crud-field" :class="{ 'is-full': field.full || field.type === 'image' || field.type === 'images' || field.type === 'textarea' }">
                <label>
                  {{ field.label }}
                  <span v-if="field.required" class="crud-required">*</span>
                </label>

                <template v-if="field.type === 'image'">
                  <ImageUploader
                    v-model="form[field.key]"
                    :label="field.label"
                    :folder="field.folder || config.table"
                    :upload-disabled="uploadDisabled"
                    :upload-disabled-reason="uploadDisabledReason"
                  />
                </template>

                <template v-else-if="field.type === 'images'">
                  <ImageUploader
                    v-model="form[field.key]"
                    :label="field.label"
                    :folder="field.folder || config.table"
                    :multiple="true"
                    :max="field.max || 6"
                    :upload-disabled="uploadDisabled"
                    :upload-disabled-reason="uploadDisabledReason"
                  />
                </template>

                <template v-else-if="field.type === 'textarea'">
                  <textarea
                    v-model="form[field.key]"
                    class="form-control"
                    :rows="field.rows || 3"
                    :placeholder="field.placeholder"
                  ></textarea>
                </template>

                <template v-else-if="field.type === 'boolean'">
                  <label class="crud-switch">
                    <input type="checkbox" v-model="form[field.key]" />
                    <span>{{ form[field.key] ? 'Aktif' : 'Nonaktif' }}</span>
                  </label>
                </template>

                <template v-else-if="field.type === 'tags'">
                  <textarea
                    v-model="form[field.key]"
                    class="form-control"
                    rows="2"
                    :placeholder="field.hint || 'Pisahkan dengan koma'"
                  ></textarea>
                </template>

                <template v-else>
                  <input
                    v-model="form[field.key]"
                    :type="inputType(field)"
                    :step="field.step"
                    :min="field.min"
                    :max="field.max"
                    :placeholder="field.placeholder"
                    :disabled="editing && field.editable === false"
                    class="form-control"
                  />
                </template>

                <small v-if="field.hint" class="crud-hint">{{ field.hint }}</small>
              </div>
            </template>
          </div>
        </div>
        <div class="crud-modal-foot">
          <button class="btn btn-secondary crud-btn" @click="closeForm" :disabled="saving">Batal</button>
          <button class="btn btn-primary crud-btn" @click="save" :disabled="saving">
            <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="deleteTarget" class="crud-overlay" @click.self="deleteTarget = null">
      <div class="crud-modal crud-modal--sm">
        <div class="crud-modal-head">
          <h3>Hapus data?</h3>
          <button class="crud-icon-btn" @click="deleteTarget = null"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="crud-modal-body">
          <p class="crud-delete-text">
            Data <strong>{{ deleteTarget.name || deleteTarget.title || deleteTarget[config.idColumn] }}</strong>
            akan dihapus permanen dari tabel <code>{{ config.table }}</code>.
          </p>
        </div>
        <div class="crud-modal-foot">
          <button class="btn btn-secondary crud-btn" @click="deleteTarget = null">Batal</button>
          <button class="btn crud-btn crud-btn--danger" :disabled="saving" @click="confirmDelete">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import ImageUploader from '@/components/admin/ImageUploader.vue'
import { listRows, insertRow, updateRow, deleteRow } from '@/lib/db'
import { isSupabaseConfigured } from '@/lib/supabase'

const props = defineProps({
  config: { type: Object, required: true },
  readOnly: { type: Boolean, default: false },
  readOnlyReason: { type: String, default: '' },
  uploadDisabled: { type: Boolean, default: false },
  uploadDisabledReason: { type: String, default: '' }
})

const emit = defineEmits(['changed'])

const configured = isSupabaseConfigured()
const rows = ref([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const formOpen = ref(false)
const editing = ref(false)
const editingId = ref(null)
const form = reactive({})
const formError = ref('')
const deleteTarget = ref(null)
const toast = reactive({ message: '', type: 'success' })

const canCreate = computed(() => !props.config.single && props.config.canCreate !== false)
const canDelete = computed(() => props.config.canDelete !== false && !props.config.single)
const visibleFields = computed(() => props.config.fields || [])
const listFields = computed(() => visibleFields.value.filter((f) => f.list).slice(0, 6))

const filteredRows = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return rows.value
  const keys = props.config.searchKeys || []
  return rows.value.filter((row) =>
    keys.some((key) => String(row[key] ?? '').toLowerCase().includes(query))
  )
})

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number(value) || 0)

const displayValue = (value) => {
  if (Array.isArray(value)) return value.join(', ')
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

const inputType = (field) => {
  if (field.type === 'number') return 'number'
  if (field.type === 'email') return 'email'
  if (field.type === 'url') return 'url'
  return 'text'
}

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  window.setTimeout(() => {
    if (toast.message === message) toast.message = ''
  }, 5000)
}

const blankForm = () => {
  const next = {}
  visibleFields.value.forEach((field) => {
    if (field.type === 'tags') next[field.key] = ''
    else if (field.type === 'images') next[field.key] = []
    else if (field.type === 'boolean') next[field.key] = false
    else if (field.type === 'number') next[field.key] = ''
    else next[field.key] = ''
  })
  Object.assign(next, props.config.defaults || {})
  return next
}

const fillForm = (row) => {
  const next = blankForm()
  visibleFields.value.forEach((field) => {
    const value = row?.[field.key]
    if (field.type === 'tags') next[field.key] = Array.isArray(value) ? value.join(', ') : value || ''
    else if (field.type === 'images') next[field.key] = Array.isArray(value) ? [...value] : []
    else if (field.type === 'boolean') next[field.key] = Boolean(value)
    else next[field.key] = value ?? ''
  })
  return next
}

const load = async () => {
  if (!configured) return
  loading.value = true
  try {
    rows.value = await listRows(props.config.table, {
      orderBy: props.config.orderBy,
      ascending: props.config.ascending
    })
    if (props.config.single) {
      Object.keys(form).forEach((key) => delete form[key])
      Object.assign(form, fillForm(rows.value[0]))
    }
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editing.value = false
  editingId.value = null
  formError.value = ''
  Object.keys(form).forEach((key) => delete form[key])
  Object.assign(form, blankForm())
  formOpen.value = true
}

const openEdit = (row) => {
  editing.value = true
  editingId.value = row[props.config.idColumn]
  formError.value = ''
  Object.keys(form).forEach((key) => delete form[key])
  Object.assign(form, fillForm(row))
  formOpen.value = true
}

const closeForm = () => {
  if (saving.value) return
  formOpen.value = false
  formError.value = ''
}

const buildPayload = () => {
  const payload = {}
  const missing = []

  visibleFields.value.forEach((field) => {
    if (editing.value && field.editable === false) return

    let value = form[field.key]

    if (field.type === 'number') {
      value = value === '' || value === null || value === undefined ? null : Number(value)
    } else if (field.type === 'boolean') {
      value = Boolean(value)
    } else if (field.type === 'tags') {
      value = String(value || '')
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean)
    } else if (field.type === 'images') {
      value = Array.isArray(value) ? value.filter(Boolean) : []
    } else if (typeof value === 'string') {
      value = value.trim()
    }

    if (field.required && (value === '' || value === null || value === undefined)) {
      missing.push(field.label)
      return
    }

    payload[field.key] = value
  })

  if (missing.length) {
    throw new Error(`Lengkapi field wajib: ${missing.join(', ')}.`)
  }
  return payload
}

const save = async () => {
  if (props.readOnly) {
    formError.value = props.readOnlyReason || 'Mode demo lokal tidak dapat menyimpan ke Supabase.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const payload = buildPayload()
    if (props.config.single) {
      const existing = rows.value[0]
      if (existing) {
        await updateRow(props.config.table, props.config.idColumn, existing[props.config.idColumn], payload)
      } else {
        await insertRow(props.config.table, payload)
      }
      showToast('Pengaturan berhasil disimpan.')
    } else if (editing.value) {
      await updateRow(props.config.table, props.config.idColumn, editingId.value, payload)
      showToast('Data berhasil diperbarui.')
    } else {
      await insertRow(props.config.table, payload)
      showToast('Data baru berhasil ditambahkan.')
    }
    formOpen.value = false
    editingId.value = null
    await load()
    emit('changed', props.config.table)
  } catch (err) {
    formError.value = err.message
    showToast(err.message, 'error')
  } finally {
    saving.value = false
  }
}

const askDelete = (row) => {
  if (props.readOnly) return
  deleteTarget.value = row
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  saving.value = true
  try {
    await deleteRow(
      props.config.table,
      props.config.idColumn,
      deleteTarget.value[props.config.idColumn]
    )
    showToast('Data berhasil dihapus.')
    deleteTarget.value = null
    await load()
    emit('changed', props.config.table)
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    saving.value = false
  }
}

watch(
  () => props.config.table,
  () => load()
)

onMounted(load)

defineExpose({ reload: load })
</script>

<style scoped>
.crud-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.crud-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 1.15rem 1.4rem;
}
.crud-toolbar-info h3 {
  margin: 0;
  font-size: 1.05rem;
  font-family: var(--font-secondary);
  color: var(--color-deep-navy);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.crud-toolbar-info h3 i {
  color: var(--color-turquoise);
}
.crud-toolbar-info p {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: var(--color-text-light);
}
.crud-toolbar-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.crud-search {
  width: 200px;
  padding: 0.45rem 0.7rem;
  font-size: 0.8rem;
}
.crud-btn {
  font-size: 0.8rem;
  padding: 0.55rem 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.crud-btn--danger {
  background: #dc2626;
  color: #fff;
  border: none;
}
.crud-table td,
.crud-table th {
  font-size: 0.82rem;
  vertical-align: middle;
}
.crud-thumb {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--color-border);
}
.crud-muted {
  color: var(--color-text-light);
}
.crud-actions-col {
  width: 96px;
}
.crud-row-actions {
  display: flex;
  gap: 0.35rem;
}
.crud-icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-ocean-blue);
  cursor: pointer;
  font-size: 0.75rem;
}
.crud-icon-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.crud-icon-btn--danger {
  color: #dc2626;
  border-color: #fecaca;
}
.crud-pill {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}
.crud-pill.is-on {
  background: #dcfce7;
  color: #15803d;
}
.crud-pill.is-off {
  background: #f1f5f9;
  color: #64748b;
}
.crud-empty {
  text-align: center;
  padding: 2.5rem 1rem !important;
  color: var(--color-text-light);
}
.crud-empty i {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
  display: block;
}
.crud-empty p {
  margin: 0;
  font-size: 0.82rem;
}
.crud-alert {
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  line-height: 1.5;
}
.crud-alert p {
  margin: 0.15rem 0 0;
}
.crud-alert--warn {
  background: #fffbeb;
  color: #92400e;
}
.crud-alert--error {
  background: #fef2f2;
  color: #b91c1c;
}
.crud-alert--success {
  background: #ecfdf5;
  color: #047857;
}
.crud-state {
  padding: 2.5rem;
  text-align: center;
  color: var(--color-text-medium);
  font-size: 0.85rem;
  background: #fff;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}
.crud-overlay {
  position: fixed;
  inset: 0;
  background: rgba(7, 59, 76, 0.45);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.crud-modal {
  width: 100%;
  max-width: 760px;
  max-height: 90vh;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(7, 59, 76, 0.25);
}
.crud-modal--sm {
  max-width: 420px;
}
.crud-modal-head {
  padding: 1rem 1.35rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.crud-modal-head h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--color-deep-navy);
}
.crud-modal-body {
  padding: 1.25rem 1.35rem;
  overflow-y: auto;
}
.crud-modal-foot {
  padding: 0.9rem 1.35rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.crud-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}
.crud-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.crud-field.is-full {
  grid-column: 1 / -1;
}
.crud-field label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-medium);
}
.crud-required {
  color: #dc2626;
}
.crud-field .form-control {
  font-size: 0.85rem;
}
.crud-hint {
  font-size: 0.7rem;
  color: var(--color-text-light);
}
.crud-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-medium);
  cursor: pointer;
}
.crud-single {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 1.35rem;
}
.crud-single-footer {
  margin-top: 1.15rem;
  display: flex;
  justify-content: flex-end;
}
.crud-delete-text {
  font-size: 0.85rem;
  color: var(--color-text-medium);
  line-height: 1.6;
  margin: 0;
}
</style>
