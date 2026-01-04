<template>
    <Timeline title="Contact Timeline":data="data" :users="users"></Timeline>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Timeline from './Timeline.vue';
import { loadContactTimeline } from "@/service/ApiService";
import { ModelsContactTimeline } from '@/generated/api';

const props = defineProps<{
    users: string[]
}>()

const data = ref<ModelsContactTimeline[]>([]);


watch(
    () => [props.users],
    () => {
        loadTimeline();
    }
);

async function loadTimeline() {
    const collected: ModelsContactTimeline[] = [];
    await Promise.all(
        props.users.map(async (userID) => {
            const response = await loadContactTimeline(userID);
            collected.push(...response);
        })
    );

    data.value = collected;
}


</script>
<style></style>
