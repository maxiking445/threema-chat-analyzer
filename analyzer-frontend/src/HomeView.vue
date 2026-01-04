<script setup>
import DragnDrop from "./components/DragnDrop.vue";
import HowTo from "./components/HowTo.vue";
import Header from "./components/Header.vue";
</script>

<template>
  <div class="app">
    <Header></Header>
    <main class="app-main">
      <div class="content">
        <HowTo />
        <DragnDrop />
      </div>
    </main>
  </div>
</template>


