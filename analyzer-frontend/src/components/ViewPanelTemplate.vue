<template>
    <div class="panel" :class="{ compact }">
        <h1 class="title">{{ title }}</h1>
        <div class="accent-line"></div>
        <div class="content" :class="directionClass">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    title: String,
    direction: {
        type: String,
        default: 'vertical',
        validator: (v: string) => ['vertical', 'horizontal'].includes(v)
    },
    compact: {
        type: Boolean,
        default: false
    }
})

const directionClass = computed(() =>
    props.direction === 'horizontal' ? 'horizontal' : 'vertical'
)
</script>

<style scoped>
.panel {
    margin: 20px;
    width: fit-content;
    min-width: 300px;
    min-height: 600px;
    padding: 1.75rem 1.75rem 2rem;
    border-radius: 16px;
    background: var(--color-bg-surface);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-border);
    color: var(--color-text-primary);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.panel.compact {
    min-height: auto;
}

.title {
    margin: 0 0 0.25rem;
    font-size: 1.4rem;
    font-weight: 600;
}

.accent-line {
    height: 2px;
    width: 100%;
    background: var(--color-text-primary);
    opacity: 0.18;
    margin-bottom: 1rem;
}

.content {
    display: flex;
    gap: 1rem;
}

.content.vertical {
    flex-direction: column;
}

.content.horizontal {
    flex-direction: row;
    flex-wrap: wrap;
}
</style>
