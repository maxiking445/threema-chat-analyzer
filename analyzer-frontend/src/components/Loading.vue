<template>
    <div class="loading-screen">
        <div class="loading-card">
            <div class="logo-area">
                <img src="../assets/logo.svg" alt="Logo" class="logo" width="48" height="48" />
            </div>

            <div class="progress-section">
                <div class="progress-track">
                    <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                </div>
                <p class="step-text">{{ loadingText }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { dataCache } from '@/service/DataLoadService';
import { useRouter } from 'vue-router'

const loadingText = ref("Preparing...")
const progress = ref(0)
const router = useRouter();

const steps = [
    { label: "Loading Groups...", action: () => dataCache.loadGroupsOnly() },
    { label: "Loading Group Chats...", action: () => dataCache.loadGroupTimelinesOnly() },
    { label: "Loading Contacts...", action: () => dataCache.loadContactsOnly() },
    { label: "Loading Contact Timelines...", action: () => dataCache.loadContactTimelinesOnly() },
    { label: "Loading Avatars...", action: () => dataCache.loadAvatarsOnly() },
    { label: "Loading All Chats...", action: () => dataCache.loadAllChats() },
];

onMounted(async () => {
    dataCache.clear();

    try {
        for (let i = 0; i < steps.length; i++) {
            loadingText.value = steps[i].label;
            progress.value = Math.round((i / steps.length) * 100);
            await steps[i].action();
        }
        progress.value = 100;
        loadingText.value = "Done!";
        dataCache.setLoaded(true);

        await new Promise(r => setTimeout(r, 200));
        router.push('/view');
    } catch {
        router.push('/');
    }
});
</script>

<style scoped>
.loading-screen {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-base);
}

.loading-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 320px;
}

.logo-area {
    width: 72px;
    height: 72px;
    border-radius: 16px;
    background: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 2s ease-in-out infinite;
}

.logo {
    display: block;
}

.progress-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.progress-track {
    width: 100%;
    height: 4px;
    background: var(--color-bg-surface);
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--color-primary);
    border-radius: 2px;
    transition: width 0.4s ease;
}

.step-text {
    text-align: center;
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    margin: 0;
    min-height: 1.2em;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.04);
        opacity: 0.85;
    }
}
</style>
