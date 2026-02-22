<template>
    <Timeline title="Contact Timeline" :data="data" :users="users" :loading="isLoading"></Timeline>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Timeline from './Timeline.vue';
import { dataCache } from "@/service/DataLoadService";
import { ModelsContactTimeline } from '@/models/ModelsContactTimeline';


const props = defineProps<{
    users: string[]
}>()

const data = ref<ModelsContactTimeline[]>([]);
const isLoading = ref(false)

watch(
    () => [props.users],
    () => {
        loadTimeline();
    }
);

async function loadTimeline() {
    if (props.users.length === 0) {
        data.value = []
        return
    }

    isLoading.value = true
    const collected: ModelsContactTimeline[] = []

    await Promise.all(
        props.users.map(async (userID) => {
            if (userID === "You") return
            const response = await dataCache.getContactTimeline(userID)
            collected.push(...response)
        })
    )

    data.value = collected
    isLoading.value = false
}


</script>
<style></style>
