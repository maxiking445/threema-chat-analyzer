<template>
    <div class="user-bar" :class="{ selected: isSelected }" @click="handleClick">
        <div class="left">
            <Avatar v-if="showAvatar" :imageID="uuid"
                :avatarType="uuid.includes('You') ? AvatarIdGetTypeEnum.Avatar : AvatarIdGetTypeEnum.Contact" />
            <span class="name">
                {{ displayName }}
            </span>
        </div>

        <div v-if="showBar" class="bar-wrapper">
            <div class="bar-fill" :style="{ width: fillWidth }"></div>
        </div>
        <div class="message-label-container">
            <MessageCountLabel :message-count="value"></MessageCountLabel>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AvatarIdGetTypeEnum } from '../models/AvatarIdGetTypeEnum';
import Avatar from './Avatar.vue'
import MessageCountLabel from './MessageCountLabel.vue';

const props = defineProps<{
    displayName: string
    id: string
    uuid: string
    value: number
    max?: number
    selected?: boolean
    showBar?: boolean
    showAvatar?: boolean
}>()

const isSelected = computed(() => props.selected === true)

const emit = defineEmits<{
    (e: 'click', id: string): void
}>()

const max = computed(() => props.max ?? props.value)
const fillWidth = computed(() => {
    if (!max.value || max.value <= 0) return '0%'
    return `${Math.min(100, (props.value / max.value) * 100)}%`
})

function handleClick() {
    emit('click', props.id)
}
</script>


<style scoped>
.user-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 3px;
    cursor: pointer;
    border-bottom: 1px solid var(--color-border);
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
    overflow: hidden;
    background: var(--color-btn-bg);
    flex-shrink: 0;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
}

.name {
    color: var(--color-text-primary);
    font-weight: 600;
    font-size: 0.95rem;
}

.bar-wrapper {
    flex: 1;
    height: 16px;
    background: var(--color-bg-bar);
    border-radius: 2px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    background: var(--color-primary);
    pointer-events: none;
}

.user-bar:hover {
    background-color: var(--color-hover-bg);
}

.user-bar.selected {
    background-color: var(--color-selected-bg);
}

.message-label-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: auto;
}
</style>
