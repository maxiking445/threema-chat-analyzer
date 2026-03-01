<template>
  <div class="page">
    <ViewPanelTemplate title="Saved Backups">
      <div v-if="savedZips.length === 0" class="empty-state">
        No saved backups yet.
      </div>
      <ZipItem v-for="zip in savedZips" :key="zip.name" :name="zip.name"
        :selected="selectedFile && selectedFile.name === zip.name" @click="selectSavedZip(zip)"
        @delete="deleteZip(zip.name)" />
    </ViewPanelTemplate>
    <ViewPanelTemplate title="Analyse Backup">
      <p class="subtitle">
        Drop your ZIP here or select it via data browser. It will only be computed locally.
      </p>

      <label class="dropzone" :class="{ 'dropzone--active': isActive }" @dragenter.prevent="onDragEnter"
        @dragover.prevent="onDragEnter" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
        <input type="file" class="file-input" accept=".zip,application/zip" @change="onFileSelect" />

        <div class="dropzone-inner">
          <div class="icon">⬆</div>
          <div class="drop-text">
            <span v-if="isActive">Let it go to upload...</span>
            <span v-else>Drop ZIP here</span>
          </div>

          <div v-if="selectedFile" class="file-info">
            <span class="file-name">{{ selectedFile.name }}</span>
          </div>
        </div>
      </label>
      <div class="password-row">
        <label class="password-label" for="zip-password">Password</label>
        <input id="zip-password" v-model="password" type="password" class="password-input"
          placeholder="Enter ZIP password"  @keydown.enter="onUpload"/>
      </div>
      <div class="upload-button-wrapper">
        <button class="upload-button" :disabled="!selectedFile || !password" @click="onUpload">Analyze</button>
      </div>
    </ViewPanelTemplate>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import { uploadZip } from '@/service/ApiService'
import { getSavedZips, saveZipToStorage, deleteZipFromStorage } from '@/service/FileService'
import ZipItem from './ZipItem.vue';

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
  uploadZip(selectedFile.value, password.value).then(() => {
    toast.success('Upload successful')
    router.push('/init')
  }).catch((error) => {
    if (error?.response) {
      error.response.text().then((t) => toast.error(t || 'Upload failed'))
    }
  })
}
const deleteZip = async (zip) => {
  await deleteZipFromStorage(zip)
  savedZips.value = savedZips.value.filter(z => z.name !== zip)
}
const handleFiles = async (files) => {
  const file = files[0]
  if (!file) return

  if (file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')) {
    selectedFile.value = file
    await saveZipToStorage(file)
    savedZips.value = await getSavedZips()
  } else {
    alert('Please select your Backup ZIP.')
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
.page {
  display: flex;
  justify-content: center;
  align-items: center;
}

.subtitle {
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
  color: #9ca3af;
}

.dropzone {
  position: relative;
  display: block;
  border-radius: 12px;
  border: 1px dashed #3f4a56;
  background: #12151a;
  padding: 1.5rem 1.25rem;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.dropzone--active {
  border-color: #1abc5b;
  background: #151b17;
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
}

.icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 0.5rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f2933;
  color: #1abc5b;
  font-size: 1.4rem;
}

.drop-text {
  font-size: 1rem;
  font-weight: 500;
}

.file-info {
  margin-top: 0.9rem;
  padding-top: 0.75rem;
  border-top: 1px solid #262b33;
  font-size: 0.85rem;
  text-align: left;
}

.file-name {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #e5e7eb;
}

.password-row {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.password-label {
  font-size: 0.85rem;
  color: #9ca3af;
}

.password-input {
  border-radius: 8px;
  border: 1px solid #303441;
  background: #111317;
  cursor: pointer;
  font-size: 0.875rem;
  color: #e5e7eb;
  padding: 0.45rem 0.6rem;
  font-size: 0.9rem;
  outline: none;
}

.password-input:focus {
  border-color: #1abc5b;
}

.upload-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
}

.upload-button {
  width: 50%;
  border: none;
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  background: #1abc5b;
  color: #0b1120;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.45);
}

.upload-button:hover {
  background: #18b055;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.5);
}

.upload-button:active {
  transform: translateY(0);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.45);
}

.upload-button:disabled {
  opacity: 0.5;
  cursor: default;
  box-shadow: none;
}
</style>
