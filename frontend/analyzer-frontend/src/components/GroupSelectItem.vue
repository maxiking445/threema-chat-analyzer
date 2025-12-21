<template>
    <div class="user-bar">
        <div class="left">
            <Avatar :imageID="props.name" :avatarType="AvatarIdGetTypeEnum.Contact"></Avatar>
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
import { ref, onMounted } from 'vue'
import { Configuration, DefaultApi, AvatarIdGetTypeEnum, AvatarIdGetRequest } from '@/generated/api';
import Avatar from './Avatar.vue';

const placeholder = new URL('../assets/avatar_placeholder.png', import.meta.url).href
const config = new Configuration({
    basePath: '/api',
})

const defaultApi = new DefaultApi(config)


function loadAvatar(name: string) {
    var params: AvatarIdGetRequest = { type: AvatarIdGetTypeEnum.Contact, id: name };
    if (props.name.match("YOU")) {
        params = {
            type: AvatarIdGetTypeEnum.Avatar,
            id: name
        }
    } else {
        params = {
            type: AvatarIdGetTypeEnum.Contact,
            id: name
        }
    }

    console.log("Loading avatar with params", params)
    defaultApi.avatarIdGet(params).then((response) => {
        console.log("Loaded avatar for", response)
        avatarSrc.value = URL.createObjectURL(response);
    }).catch((error) => {
        console.log("Failed to load avatar for", error, ", using placeholder")
        avatarSrc.value = placeholder;
    });
}
const avatarSrc = ref<string>(placeholder)

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

onMounted(() => {
    loadAvatar(props.name)
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
    overflow: hidden;
    background: #444;
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
