<template>
    <Timeline :title="groupName ? 'Group Timeline: ' + groupName : 'Group Timeline:'" :data="data" :users="userIDs"  :loading="isLoading">
    </Timeline>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watch } from 'vue';
import Timeline from './Timeline.vue';
import { dataCache } from "@/service/DataLoadService";
import { ModelsGroupTimeline } from '@/models/ModelsGroupTimeline';


const props = defineProps<{
    groupName: string | undefined
    groupID: string | undefined
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
        if (!props.groupID) {
            data.value = []
            return
        }
        const response: ModelsGroupTimeline[]  = await dataCache.getGroupTimeline(props.groupID)
        data.value = response
    } finally {
        isLoading.value = false
    }
}
</script>
<style></style>
