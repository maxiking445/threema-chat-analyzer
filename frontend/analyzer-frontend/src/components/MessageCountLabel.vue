<template>
    <span class="message-count">{{ messageCount }}</span>
</template>

<script setup>

defineProps({
    messageCount: Number,
})

</script>

<style scoped>
.message-count {
    background: #ffffff;
    color: #181b20;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
}
</style>