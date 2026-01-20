<template>
    <div class="wordCloudContainer">
        <vue-word-cloud class="wordCloud" :words="words" :color="([, weight]) => weight > 900 ? '#1abc5b' : '#ffffff'"
            font-family="Righteous" />
    </div>
</template>

<script setup lang="ts">
import VueWordCloud from 'vuewordcloud';
import { ref, onMounted } from 'vue';
import { loadWordCloudData } from "@/service/ApiService";
import { toast } from 'vue3-toastify';
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
        toast.error('Error during loading wordCloud.', error);
    }
});

</script>

<style>
.wordCloudContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 680px;
}

.wordCloud {
    width: 100%;
    max-width: 1040px;
    height: 100%;
}
</style>