<template>
  <div class="user-bar" :class="{ selected: isSelected }" @click="handleClick">
    <div class="left">
      <font-awesome-icon icon="file-zipper" class="zip-icon" />
      <span class="name">{{ name }}</span>
    </div>

    <div class="message-label-container">
      <button class="delete-btn" @click.stop="handleDelete">
        <font-awesome-icon icon="trash" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  selected?: boolean
}>()

const isSelected = computed(() => props.selected === true)

const emit = defineEmits<{
  (e: 'click', name: string): void
  (e: 'delete', name: string): void
}>()

function handleClick() {
  emit('click', props.name)
}

function handleDelete() {
  emit('delete', props.name)
}
</script>

<style scoped>
.user-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 3px;
  cursor: pointer;
  border-bottom: 1px solid #20242b;
}

.left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.zip-icon {
  color: #3bb54a;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.name {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-bar:hover {
  background-color: #2a2e35;
}

.user-bar.selected {
  background-color: #2d3138;
}

.message-label-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  transition: color 0.15s;
  font-size: 0.95rem;
}

.delete-btn:hover {
  color: #ef4444;
}
</style>