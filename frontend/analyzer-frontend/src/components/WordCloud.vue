<template>
    <vue-word-cloud style="
    height: 680px;
    width: 1040px;
  " :words="words" :color="([, weight]) => weight > 10 ? '#1abc5b' : weight > 5 ? 'RoyalBlue' : 'Indigo'"
        font-family="Righteous"
         />
</template>

<script setup>
import VueWordCloud from 'vuewordcloud';
import { ref, onMounted } from 'vue';
import { DefaultApi } from '@/generated/api';
import { pushErrorToast } from '@/service/ToastService';

const words = ref([]);
const defaultApi = new DefaultApi({
    basePath: '/api',
    middleware: []
});

onMounted(async () => {
    try {
        const response = await defaultApi.wordcloudGet()
        words.value = response.map(item => [item.word, item.count]);
    } catch (error) {
        pushErrorToast('Error during loading wordCloud.', error);
    }
});
</script>