<template>
    <div class="avatar">
        <img :src="avatarSrc" alt="Avatar" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Configuration, DefaultApi, AvatarIdGetTypeEnum, AvatarIdGetRequest } from '@/generated/api';
import { pushErrorToast } from '@/service/ToastService';

const config = new Configuration({
    basePath: '/api',
})

const defaultApi = new DefaultApi(config)


function loadAvatar(imageID: string, avatarType: AvatarIdGetTypeEnum) {
    var params: AvatarIdGetRequest = { type: avatarType, id: imageID };
    defaultApi.avatarIdGet(params).then((response) => {
        avatarSrc.value = URL.createObjectURL(response);
    }).catch((error) => {
        pushErrorToast('Failed to load avatar image.', error);
    });
}
const avatarSrc = ref<string>()

const props = defineProps<{
    imageID: string
    avatarType: AvatarIdGetTypeEnum
}>()


onMounted(() => {
    loadAvatar(props.imageID, props.avatarType)
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
