<template>
    <div class="group-item" :class="{ selected: selected }" @click="$emit('click', groupKey)">
        <span class="group-name">{{ groupName }}</span>
        <MessageCountLabel :message-count="messageCount"></MessageCountLabel>
    </div>
</template>

<script setup>
import MessageCountLabel from './MessageCountLabel.vue';

defineProps({
    groupKey: String,
    groupName: String,
    messageCount: Number,
    selected: Boolean
})

defineEmits(['click'])
</script>

<style>
.group-item {
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

.group-item:hover {
    background-color: #2a2e35;
}

.group-item.selected {
    background-color: #2d3138;
}

.group-name {
    font-weight: 600;
}

</style>
