<template>
    <div class="app">
        <header class="app-header">
            <div class="header-left">
                <img alt="Vue logo" class="logo" src="../assets/logo.svg" width="32" height="32" />
                <h1 class="title">Threema Chat Analyzer</h1>
            </div>
            <div class="header-right">
                <div class="additional-link">
                    <button :class="{ active: true }" @click="handleRemoveData">
                        REMOVE DATA
                    </button>
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
import { UploadApi } from '@/generated/api';
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify';

const router = useRouter()


const uploadApi = new UploadApi();

const handleRemoveData = () => {
    uploadApi.deleteZipDelete().then(() => {
        toast.success('Data removed successfully');
        router.push('/')
    }).catch((error) => {
        toast.error(error.response?.data || 'Error removing data');
        console.error('Error removing data:', error);
    });
}

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
    padding: 0.3rem 0.8rem;
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