<template>
    <div class="app">
        <header class="app-header">
            <div class="header-left">
                <img alt="Vue logo" class="logo" src="../assets/logo.svg" width="32" height="32" />
                <h1 class="title">Threema Chat Analyzer</h1>
            </div>
            <div class="header-right">
                <div class="additional-link">
                    <h4>v{{ appVersion }}</h4>
                </div>
                <a class="github-link" href="https://github.com/maxiking445/threema-chat-analyzer" target="_blank"
                    rel="noopener noreferrer">
                    <img src="../assets/github.svg" alt="GitHub" class="github-icon" />
                </a>
            </div>
        </header>
    </div>
</template>

<script setup>
import { getVersion } from '@tauri-apps/api/app'
import { ref,  onMounted } from 'vue'

const appVersion = ref('0.0.0')

onMounted(async () => {
    try {
        appVersion.value = await getVersion()
    } catch {
        appVersion.value = '0.0.0'
    }
})


</script>
<style scoped>
.header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}




.github-link {
    filter: invert(1);
}

.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #242731;
    background: #181b20;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.logo {
    display: block;
}

.title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #f9fafb;
}

.github-link {
    display: inline-flex;
    align-items: center;
}

.github-icon {
    width: 20px;
    height: 20px;
}

.additional-link button {
    padding: 1rem 0.8rem;
    font-weight: 600;
    border-radius: 0.25rem;
    border: none;
    background-color: #2d3138;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s;
}

.additional-link button.active {
    background-color: #3bb54a;
    color: #181b20;
}

.additional-link button:hover {
    background-color: #44484f;
}
</style>