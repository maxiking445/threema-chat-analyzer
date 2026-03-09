<script setup>
import DragnDrop from "./components/DragnDrop.vue";
</script>

<template>
  <div class="home">
    <div class="home-inner">
      <DragnDrop />
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  min-height: 100%;
}

.home-inner {
  width: 100%;
  max-width: 560px;
}
</style>
