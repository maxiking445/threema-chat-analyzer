<template>
  <nav class="sidebar" :class="{ collapsed }">
    <div class="sidebar-top">
      <div class="brand" @click="navigateTo('/')">
        <img alt="Logo" class="logo" src="../assets/logo.svg" width="28" height="28" />
        <span class="brand-text" v-show="!collapsed">Threema Chat Analyzer</span>
      </div>

      <button class="collapse-btn" @click="collapsed = !collapsed" :title="collapsed ? 'Expand' : 'Collapse'">
        <font-awesome-icon :icon="collapsed ? 'bars' : 'angles-left'" />
      </button>
    </div>

    <ul class="nav-links">
      <li v-for="item in navItems" :key="item.route">
        <a
          class="nav-link"
          :class="{ active: isActive(item.route) }"
          @click="navigateTo(item.route)"
          :title="item.label"
        >
          <font-awesome-icon :icon="item.icon" class="nav-icon" />
          <span class="nav-label" v-show="!collapsed">{{ item.label }}</span>
        </a>
      </li>
    </ul>

    <div class="sidebar-bottom">
      <a
        class="nav-link clear-cache"
        @click="clearCache"
        title="Clear Cache"
      >
        <font-awesome-icon icon="trash" class="nav-icon" />
        <span class="nav-label" v-show="!collapsed">Clear Cache</span>
      </a>
      <a
        class="nav-link"
        href="https://github.com/maxiking445/threema-chat-analyzer"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
      >
        <img src="../assets/github.svg" alt="GitHub" class="github-icon" />
        <span class="nav-label" v-show="!collapsed">GitHub</span>
      </a>
      <div class="version" v-show="!collapsed">v{{ appVersion }}</div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)
const appVersion = ref(import.meta.env.PACKAGE_VERSION)

const navItems = [
  { route: '/', icon: 'home', label: 'Home' },
  { route: '/view', icon: 'chart-bar', label: 'Analysis' },
  { route: '/chat', icon: 'comments', label: 'Chat' },
]

function isActive(path: string) {
  return route.path === path
}

function navigateTo(path: string) {
  router.push(path)
}

async function clearCache() {
  try {
    localStorage.clear()
    sessionStorage.clear()

    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(name => caches.delete(name)))

    const databases = await indexedDB.databases()
    databases.forEach(db => {
      if (db.name) indexedDB.deleteDatabase(db.name)
    })

    window.location.href = '/'
  } catch (error) {
    window.location.href = '/'
  }
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 220px;
  height: 100vh;
  background: var(--color-bg-surface);
  border-right: 1px solid var(--color-border-light);
  transition: width 0.2s ease;
  flex-shrink: 0;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 56px;
}

.sidebar-top {
  display: flex;
  flex-direction: column;
  padding: 16px 12px 8px;
  gap: 12px;
  border-bottom: 1px solid var(--color-border-light);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.15s;
  min-height: 32px;
}

.brand:hover {
  background: var(--color-bg-elevated);
}

.logo {
  flex-shrink: 0;
}

.brand-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  font-size: 14px;
  transition: background 0.15s, color 0.15s;
  width: 32px;
  height: 32px;
}

.collapse-btn:hover {
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
}

.nav-links {
  list-style: none;
  padding: 8px;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-decoration: none;
  white-space: nowrap;
}

.nav-link:hover {
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
}

.nav-link.active {
  background: var(--color-primary-muted);
  color: var(--color-primary);
}

.nav-icon {
  width: 18px;
  text-align: center;
  flex-shrink: 0;
  font-size: 16px;
}

.nav-label {
  font-size: 0.88rem;
  font-weight: 500;
}

.sidebar-bottom {
  padding: 12px 8px;
  border-top: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.clear-cache:hover {
  background: var(--color-danger-muted);
  color: var(--color-danger);
}

.github-icon {
  width: 18px;
  height: 18px;
  filter: invert(0.6);
  flex-shrink: 0;
}

.nav-link:hover .github-icon {
  filter: invert(1);
}

.version {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  padding: 4px 12px;
  white-space: nowrap;
}

.sidebar.collapsed .sidebar-top {
  align-items: center;
}

.sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 10px;
}

.sidebar.collapsed .sidebar-bottom .nav-link {
  justify-content: center;
}
</style>
