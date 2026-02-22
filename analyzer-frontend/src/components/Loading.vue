<template>
    <div v-if="showLoading" class="fullscreen-overlay">
        <div class="loading-content">
            <div class="spinner"></div>
            <div class="loading-text">{{ loadingText }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { dataCache } from '@/service/DataLoadService';
import { useRouter } from 'vue-router'
const showLoading = ref(false)
const loadingText = ref("Daten werden geladen...")
const router = useRouter();

onMounted(async () => {
    showLoading.value = true;
    loadingText.value = "Loading Groups..."
    dataCache.clear();
    dataCache.loadGroupsOnly().then(() => {
        loadingText.value = "Loading Groupchats..."
        return dataCache.loadGroupTimelinesOnly()
    }).then(() => {
        loadingText.value = "Loading Contacts..."
        return dataCache.loadContactsOnly()
    }).then(() => {
        loadingText.value = "Loading Contact Timelines..."
        return dataCache.loadContactTimelinesOnly()
    }).then(() => {
        loadingText.value = "Loading Avatars..."
        return dataCache.loadAvatarsOnly()
    }).finally(() => {
        showLoading.value = false;
        router.push('/view')
    })
});
</script>

<style scoped>
.fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.spinner {
    width: 64px;
    height: 64px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    color: white;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
