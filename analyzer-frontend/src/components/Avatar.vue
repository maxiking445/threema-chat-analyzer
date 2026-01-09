<template>
    <div class="avatar">
        <img :src="avatarSrc" alt="Avatar" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AvatarIdGetTypeEnum, AvatarIdGetRequest } from '@/generated/api';
import { pushErrorToast } from '@/service/ToastService';
import { loadAvatar } from "@/service/ApiService";

const avatarSrc = ref<string>()

const props = defineProps<{
    imageID: string
    avatarType: AvatarIdGetTypeEnum
}>()


onMounted(() => {
    loadAvatar(props.avatarType, props.imageID).then((response) => {
        avatarSrc.value = URL.createObjectURL(response);
    }).catch((error) => {
        pushErrorToast('Failed to load avatar image.', error);
    });
})
</script>

<style scoped>
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
</style>
