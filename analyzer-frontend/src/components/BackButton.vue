<template>
  <RoundButton icon="arrow-left" @click="goBack" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import RoundButton from "./button/RoundButton.vue";

const props = defineProps<{
  to: string
}>()

const router = useRouter();

function goBack() {
  router.push(props.to);
}
</script>