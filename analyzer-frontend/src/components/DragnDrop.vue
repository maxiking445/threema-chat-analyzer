<template>
  <div class="upload-flow">
    <!-- Dropzone -->
    <label
      class="dropzone"
      :class="{ 'dropzone--active': isActive, 'dropzone--has-file': selectedFile }"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        type="file"
        class="file-input"
        accept=".zip,application/zip"
        @change="onFileSelect"
      />

      <div class="dropzone-inner">
        <div class="dropzone-icon" :class="{ 'dropzone-icon--active': isActive }">
          <font-awesome-icon :icon="selectedFile ? 'check' : 'cloud-arrow-up'" />
        </div>

        <template v-if="selectedFile">
          <p class="dropzone-title">{{ selectedFile.name }}</p>
          <p class="dropzone-hint">Click or drop to replace</p>
        </template>
        <template v-else-if="isActive">
          <p class="dropzone-title">Release to upload</p>
        </template>
        <template v-else>
          <p class="dropzone-title">Drop your Threema backup here</p>
          <p class="dropzone-hint">or click to browse files</p>
        </template>
      </div>
    </label>

    <!-- Password + Analyze -->
    <div class="action-row">
      <div class="password-field">
        <font-awesome-icon icon="lock" class="field-icon" />
        <input
          v-model="password"
          type="password"
          class="password-input"
          placeholder="Backup password"
          @keydown.enter="onUpload"
        />
      </div>
      <button
        class="analyze-btn"
        :disabled="!selectedFile || !password"
        @click="onUpload"
      >
        Analyze
      </button>
    </div>

    <p class="privacy-note">
      All data is processed locally in your browser.
    </p>

    <!-- Saved Backups -->
    <div v-if="savedZips.length > 0" class="saved-section">
      <h3 class="saved-title">Saved Backups</h3>
      <div class="saved-list">
        <ZipItem
          v-for="zip in savedZips"
          :key="zip.name"
          :name="zip.name"
          :selected="selectedFile && selectedFile.name === zip.name"
          @click="selectSavedZip(zip)"
          @delete="deleteZip(zip.name)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { uploadZip } from '@/service/ApiService'
import { getSavedZips, saveZipToStorage, deleteZipFromStorage } from '@/service/FileService'
import ZipItem from './ZipItem.vue'

const router = useRouter()

const isActive = ref(false)
const selectedFile = ref(null)
const password = ref('')
const savedZips = ref([])

onMounted(async () => {
  savedZips.value = await getSavedZips()
})

const onDragEnter = () => { isActive.value = true }
const onDragLeave = () => { isActive.value = false }

const onUpload = () => {
  if (!selectedFile.value || !password.value) return
  uploadZip(selectedFile.value, password.value).then(() => {
    router.push('/init')
  }).catch((error) => {
    if (error?.response) {
      toast.error('Analyse ZIP failed: ' + error.response.statusText)
      error.response.text().then((t) => toast.error(t || 'Analyse ZIP failed'))
    }
  })
}

const deleteZip = async (zip) => {
  await deleteZipFromStorage(zip)
  savedZips.value = savedZips.value.filter(z => z.name !== zip)
  if (selectedFile.value?.name === zip) {
    selectedFile.value = null
  }
}

const handleFiles = async (files) => {
  const file = files[0]
  if (!file) return

  if (file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')) {
    selectedFile.value = file
    await saveZipToStorage(file)
    savedZips.value = await getSavedZips()
  } else {
    toast.error('Please select a valid ZIP file.')
  }
}

const selectSavedZip = (zip) => {
  selectedFile.value = zip.file
}

const onDrop = (e) => {
  isActive.value = false
  if (!e.dataTransfer) return
  handleFiles(e.dataTransfer.files)
}

const onFileSelect = (e) => {
  const input = e.target
  if (!input.files) return
  handleFiles(input.files)
  input.value = ''
}
</script>

<style scoped>
.upload-flow {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Dropzone */
.dropzone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 2px dashed var(--color-border-dropzone);
  background: var(--color-bg-surface);
  padding: 2.5rem 1.5rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.dropzone:hover {
  border-color: var(--color-text-secondary);
}

.dropzone--active {
  border-color: var(--color-primary);
  background: var(--color-primary-muted);
}

.dropzone--has-file {
  border-style: solid;
  border-color: var(--color-primary);
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.dropzone-inner {
  text-align: center;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.dropzone-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-elevated);
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
  transition: color 0.2s, background 0.2s;
}

.dropzone:hover .dropzone-icon {
  color: var(--color-text-primary);
}

.dropzone--active .dropzone-icon,
.dropzone-icon--active {
  background: var(--color-primary-muted);
  color: var(--color-primary);
}

.dropzone--has-file .dropzone-icon {
  background: var(--color-primary-muted);
  color: var(--color-primary);
}

.dropzone-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.dropzone-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0;
}

/* Action Row */
.action-row {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.password-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-input);
  background: var(--color-bg-surface);
  transition: border-color 0.15s;
}

.password-field:focus-within {
  border-color: var(--color-primary);
}

.field-icon {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.password-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.9rem;
  padding: 0.65rem 0;
  outline: none;
}

.password-input::placeholder {
  color: var(--color-text-muted);
}

.analyze-btn {
  padding: 0 1.5rem;
  border: none;
  border-radius: 8px;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, opacity 0.15s;
}

.analyze-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.analyze-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Privacy note */
.privacy-note {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
}

/* Saved Backups */
.saved-section {
  margin-top: 0.5rem;
  border-radius: 12px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.saved-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  padding: 0.75rem 1rem 0.25rem;
  margin: 0;
}

.saved-list {
  max-height: 240px;
  overflow-y: auto;
}
</style>
