<template>
  <div class="app-layout" v-if="showSidebar">
    <Sidebar />
    <main class="app-content">
      <RouterView />
    </main>
  </div>
  <RouterView v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()
const showSidebar = computed(() => route.path !== '/init')
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  background: #111317;
}
</style>
