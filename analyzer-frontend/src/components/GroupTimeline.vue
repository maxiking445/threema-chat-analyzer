<template>
    <Timeline :title="groupName ? 'Group Timeline: ' + groupName : 'Group Timeline:'" :data="data" :users="userIDs"  :loading="isLoading">
    </Timeline>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watch } from 'vue';
import { ModelsGroupTimeline } from '@/generated/api';
import Timeline from './Timeline.vue';
import { dataCache } from "@/service/DataLoadService";


const props = defineProps<{
    groupName: string
    groupID: string
    userIDs: string[]
}>()


const data = ref<ModelsGroupTimeline[]>([]);
const isLoading = ref(false)

watch(
    () => [props.userIDs],
    () => {
        loadTimeline();
    }
);

async function loadTimeline() {
    if (props.userIDs.length === 0) {
        data.value = []
        isLoading.value = false
        return
    }
    isLoading.value = true
    try {
        const response = await dataCache.getGroupTimeline(props.groupID)
        data.value = response
    } finally {
        isLoading.value = false
    }
}
</script>
<style></style>
