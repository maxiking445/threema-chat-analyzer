<template>
  <div class="zip-item" :class="{ selected: isSelected }" @click="handleClick">
    <div class="zip-left">
      <font-awesome-icon icon="file-zipper" class="zip-icon" />
      <span class="zip-name">{{ name }}</span>
    </div>
    <button class="delete-btn" @click.stop="handleDelete" title="Delete backup">
      <font-awesome-icon icon="trash" />
    </button>
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
.zip-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: background 0.12s;
}

.zip-item:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}

.zip-item:hover {
  background: var(--color-hover-bg);
}

.zip-item.selected {
  background: var(--color-primary-muted);
}

.zip-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

.zip-icon {
  color: var(--color-primary);
  font-size: 0.95rem;
  flex-shrink: 0;
}

.zip-name {
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: 0.88rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.12s, color 0.12s;
}

.zip-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: var(--color-danger);
}
</style>
