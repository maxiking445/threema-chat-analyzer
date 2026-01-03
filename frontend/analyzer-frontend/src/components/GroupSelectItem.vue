<template>
  <div class="user-bar" :class="{ selected: isSelected }" @click="handleClick">
    <div class="left">
      <Avatar :imageID="identity.identityID"
        :avatarType="identity.identityID.includes('You') ? AvatarIdGetTypeEnum.Avatar : AvatarIdGetTypeEnum.Contact" />
      <span v-if="identity.nickName" class="name">
        {{ identity.nickName }}
      </span>
      <span v-else class="name">
        {{ identity.firstName || identity.lastName || identity.identity }}
      </span>
    </div>

    <div class="bar-wrapper">
      <div class="bar-fill" :style="{ width: fillWidth }"></div>
    </div>
    <MessageCountLabel :message-count="value"></MessageCountLabel>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ModelsIdentity, AvatarIdGetTypeEnum } from '@/generated/api'
import Avatar from './Avatar.vue'
import MessageCountLabel from './MessageCountLabel.vue';

const props = defineProps<{
  identity: ModelsIdentity
  value: number
  max: number
  selected?: boolean
}>()

const isSelected = computed(() => props.selected === true)

const emit = defineEmits<{
  (e: 'click', identityID: string): void
}>()

const max = computed(() => props.max ?? props.value)
const fillWidth = computed(() => {
  if (!max.value || max.value <= 0) return '0%'
  return `${Math.min(100, (props.value / max.value) * 100)}%`
})

function handleClick() {
  emit('click', props.identity.identity)
}
</script>


<style scoped>
.user-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0.75rem;
  border-radius: 3px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #20242b;
}

.left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  background: #444;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
}

.name {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
}

.bar-wrapper {
  flex: 1;
  height: 16px;
  background: #111;
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #3bb54a;
  pointer-events: none;
}

.user-bar:hover {
  background-color: #2a2e35;
}

.user-bar.selected {
  background-color: #2d3138;
}
</style>
