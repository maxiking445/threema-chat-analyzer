<template>
  <div :class="['message', isSelf ? 'self' : 'other']">
    <div :class="['message-bubble', isSelf ? 'self' : 'other']">
      <div v-if="showName && senderName" class="sender">{{ senderName }}</div>
      <div class="text">{{ message }}</div>
      <div class="timestamp">{{ formattedDate }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModelsIdentity } from '@/models/ModelsIdentity';
import { computed } from 'vue'

const props = defineProps<{
  message: string
  date: string | Date
  identity?: ModelsIdentity
  showName?: boolean
}>()

const isSelf = computed(() => (props.identity?.identityID === 'You') === true)

const senderName = computed(() => {
  if (!props.identity) return '';
  return (
    props.identity.firstName ||
    props.identity.identity ||
    props.identity.identityID ||
    ''
  );
});

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
.message {
  display: flex;
  flex-direction: column;
  margin: 6px 0;
}

.message.self {
  align-items: flex-end;
}

.message.other {
  align-items: flex-start;
}

.sender {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 4px;
  padding-right: 6px;
}

.message-bubble {
  max-width: 100%;
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
  white-space: pre-wrap;
  word-break: normal;
  overflow-wrap: normal;
}

.timestamp {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 4px;
  text-align: right;
}
</style>
