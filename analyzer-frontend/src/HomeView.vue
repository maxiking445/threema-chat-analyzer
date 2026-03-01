<script setup>
import DragnDrop from "./components/DragnDrop.vue";
import Header from "./components/Header.vue";
</script>

<template>
  <div class="app">
    <Header></Header>
    <main class="app-main">
      <div class="content">
        <DragnDrop />
      </div>
    </main>
  </div>
</template>
