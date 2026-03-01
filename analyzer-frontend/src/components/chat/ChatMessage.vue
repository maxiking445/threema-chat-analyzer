<template>
  <div :class="['message-bubble', isSelf ? 'self' : 'other']">
    <div class="text">{{ message }}</div>
    <div class="timestamp">{{ formattedDate }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  message: string
  date: string | Date
  self?: boolean
}>()

const isSelf = computed(() => props.self === true)

const formattedDate = computed(() => {
  const d = typeof props.date === 'string' ? new Date(props.date) : props.date
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<style scoped>
.message-bubble {
  max-width: 70%;
  padding: 8px 12px;
  margin: 6px 0;
  border-radius: 12px;
  display: inline-block;
  position: relative;
  font-size: 0.95rem;
}

.message-bubble.self {
  background: #3d3f44;
  color: #e0e0e0;
  align-self: flex-end;
  border-bottom-right-radius: 2px;
}

.message-bubble.other {
  background: #181b20;
  color: #ffffff;
  align-self: flex-start;
  border-bottom-left-radius: 2px;
}

.text {
  word-wrap: break-word;
}

.timestamp {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 4px;
  text-align: right;
}
</style>
