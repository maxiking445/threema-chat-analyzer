<template>
    <vue-word-cloud style="
    height: 680px;
    width: 1040px;
  " :words="words" :color="([, weight]) => {
    if (weight > 900) return '#1abc5b';
}" font-family="Righteous" />
</template>

<script setup lang="ts">
import VueWordCloud from 'vuewordcloud';
import { ref, onMounted } from 'vue';
import { DefaultApi } from '@/generated/api';
import { pushErrorToast } from '@/service/ToastService';
import { loadWordCloudData } from "@/service/ApiService";
const words = ref([]);
const allWords = ref([]);
const batchSize = 10;
const intervalTime = 3000;



onMounted(async () => {
    try {
        const response = await loadWordCloudData();
        allWords.value = response.map(item => [item.word, item.count]);
        allWords.value.reverse();
        let index = 0;
        const addBatch = () => {
            const batch = allWords.value.slice(index, index + batchSize);
            words.value.push(...batch);
            index += batchSize;
            if (index >= allWords.value.length) {
                clearInterval(timer);
            }
        };

        addBatch();
        const timer = setInterval(addBatch, intervalTime);
    } catch (error) {
        pushErrorToast('Error during loading wordCloud.', error);
    }
});

</script>