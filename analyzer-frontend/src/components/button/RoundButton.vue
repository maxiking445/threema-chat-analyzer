<template>
  <button class="generic-button" @click="handleClick">
    <font-awesome-icon :icon="icon" />
  </button>
</template>

<script setup lang="ts">
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

defineProps<{
  icon: IconDefinition | string
  onClick?: () => void
}>()

const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.generic-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background-color: #3dca6e;
  color: #000;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.generic-button:hover {
  background-color: #2fb85e;
}
</style>