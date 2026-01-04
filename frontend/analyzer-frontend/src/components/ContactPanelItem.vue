<template>
    <div class="contact-item" :class="{ selected: selected }" @click="$emit('click', userId)">
        <span class="contact-name">{{ userName }}</span>
        <MessageCountLabel :message-count="messageCount"></MessageCountLabel>
    </div>
</template>

<script setup>
import MessageCountLabel from './MessageCountLabel.vue';

defineProps({
    userId: String,
    userName: String,
    messageCount: Number,
    selected: Boolean
})

defineEmits(['click'])
</script>

<style>
.contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #20242b;
    color: #f9fafb;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    cursor: pointer;
    transition: background-color 0.2s;
}

.contact-item:hover {
    background-color: #2a2e35;
}

.contact-item.selected {
    background-color: #2d3138;
}

.contact-name {
    font-weight: 600;
}
</style>
