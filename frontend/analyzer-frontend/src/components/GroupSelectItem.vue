<template>
    <div class="user-bar">
        <div class="left">
            <div class="avatar"></div>
            <span class="name">{{ name }}</span>
        </div>

        <div class="bar-wrapper">
            <div class="bar-fill" :style="{ width: fillWidth }"></div>
        </div>

        <div class="value">
            {{ value }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'


    const props = defineProps({
        name: String,
        value: Number,
        max: Number
    })

    const max = computed(() => props.max ?? props.value)
    const fillWidth = computed(() => {
        if (!max.value || max.value <= 0) return '0%'
        return Math.min(100, (props.value / max.value) * 100) + '%'
    })

</script>

<style scoped>
    .user-bar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.4rem 0.75rem;
        background: #1b2228;
        border-radius: 3px;
    }

    .left {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 80px;
    }

    .avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #444;
        flex-shrink: 0;
    }

    .name {
        color: #ffffff;
        font-weight: 600;
        font-size: 0.95rem;
    }

    .bar-wrapper {
        flex: 1;
        height: 16px;
        background: #111;
        border-radius: 2px;
        overflow: hidden;
    }

    .bar-fill {
        height: 100%;
        background: #3bb54a;
    }

    .value {
        min-width: 60px;
        text-align: right;
        color: #ffffff;
        font-weight: 600;
    }
</style>