<template>
  <div class="page">
    <div class="panel">
      <h1 class="title">ZIP Upload</h1>
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
          placeholder="Enter ZIP password" />
      </div>
      <div class="upload-button-wrapper">
        <button class="upload-button"   :disabled="!selectedFile || !password" @click="onUpload">Analyze</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isActive = ref(false)
const selectedFile = ref(null)
const password = ref('')

const onDragEnter = () => {
  isActive.value = true
}
const onDragLeave = () => {
  isActive.value = false
}

const onUpload = () => {
  console.log('UPLOAD', selectedFile.value, password.value)
}

const handleFiles = (files) => {
  const file = files[0]
  if (!file) return

  if (file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')) {
    selectedFile.value = file
  } else {
    alert('Please select your Backup ZIP.')
  }
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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111317;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #f9fafb;
}

.panel {
  width: 100%;
  max-width: 420px;
  padding: 1.75rem 1.75rem 2rem;
  border-radius: 16px;
  background: #181b20;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  border: 1px solid #20242b;
}

.title {
  margin: 0 0 0.25rem;
  font-size: 1.4rem;
  font-weight: 600;
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
