<template>
    <div class="no-data">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M12 3L1 21h22L12 3zm0 6c.55 0 1 .45 1 1v4a1 1 0 1 1-2 0v-4c0-.55.45-1 1-1zm0 9a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 12 18z" />
        </svg>

        <div class="text">
            <slot>No data selected</slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    text?: string
}>()
</script>

<style scoped>
.no-data {
    height: 100%;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    color: #9ca3af;
    text-align: center;
}

.icon {
    width: 40px;
    height: 40px;
    fill: #facc15;
    opacity: 0.9;
}

.text {
    font-size: 1rem;
    font-weight: 600;
}
</style>
