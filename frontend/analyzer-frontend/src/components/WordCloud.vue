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
const allWords = ref([]);
const batchSize = 10;
const intervalTime = 3000;

const defaultApi = new DefaultApi({
    basePath: '/api',
    middleware: []
});

onMounted(async () => {
    try {
        const response = await defaultApi.wordcloudGet();
        allWords.value = response.map(item => [item.word, item.count]);

        let index = 0;
        const addBatch = () => {
            const batch = allWords.value.slice(index, index + batchSize);
            words.value.push(...batch);
            index += batchSize;
            if (index >= allWords.value.length) {
                clearInterval(timer);
            }
        };

        addBatch(); // Ersten Batch hinzufügen
        const timer = setInterval(addBatch, intervalTime);
    } catch (error) {
        pushErrorToast('Error during loading wordCloud.', error);
    }
});

</script>