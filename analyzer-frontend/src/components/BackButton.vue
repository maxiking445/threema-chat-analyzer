<template>
  <button class="back-button" @click="goBack">
    <font-awesome-icon icon="arrow-left" />
  </button>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps<{
  to: string
}>()

const router = useRouter();

function goBack() {
  router.push(props.to);
}
</script>

<style scoped>
.back-button {
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

.back-button:hover {
  background-color: #2fb85e;
}
</style>