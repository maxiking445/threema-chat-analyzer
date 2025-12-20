<template>
    <div class="toast-container">
        <transition-group name="toast-fade">
            <div v-for="toast in toasts" :key="toast.id" class="toast">
                {{ toast.message }}
            </div>
        </transition-group>
    </div>
</template>

<script setup>
import { useErrorToasts } from '@/service/ToastService'

const toasts = useErrorToasts()
</script>

<style scoped>
.toast-container {
    position: fixed;
    justify-content: center;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 2000;
}

.toast {
    max-width: 320px;
    padding: 0.6rem 0.9rem;
    border-radius: 8px;
    background: #b91c1c;
    color: #f9fafb;
    font-size: 0.85rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
