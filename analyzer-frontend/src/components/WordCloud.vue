<template>
    <div class="wordCloudContainer">
        <vue-word-cloud class="wordCloud" :words="words" :color="wordColor"
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

const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue('--color-primary').trim() || '#3bb54a';
const textColor = rootStyles.getPropertyValue('--color-text-primary').trim() || '#f9fafb';
const topThreshold = ref(Infinity);
const wordColor = ([, weight]: [string, number]) => weight >= topThreshold.value ? primaryColor : textColor;
const batchSize = 10;
const intervalTime = 3000;



onMounted(async () => {
    try {
        const response = await loadWordCloudData();
        allWords.value = response.map(item => [item.word, item.count]);
        allWords.value.reverse();
        const counts = allWords.value.map(([, c]) => c as number).sort((a, b) => a - b);
        topThreshold.value = counts[Math.floor(counts.length * 0.8)] || 0;
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
    } catch (error: any) {
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