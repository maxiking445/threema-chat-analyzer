<template>
    <Timeline :title="groupName ? 'Group Timeline: ' + groupName : 'Group Timeline:'" :data="data" :users="userIDs">
    </Timeline>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watch } from 'vue';
import { loadGroupTimeline } from "@/service/ApiService";
import { ModelsGroupTimeline } from '@/generated/api';
import Timeline from './Timeline.vue';

const props = defineProps<{
    groupName: string
    groupID: string
    userIDs: string[]
}>()


const data = ref<ModelsGroupTimeline[]>([]);

watch(
    () => [props.userIDs],
    () => {
        loadTimeline();
    }
);

async function loadTimeline() {
    if (props.userIDs.length === 0) {
        data.value = []
        return
    }
    const response = await loadGroupTimeline(props.groupID);
    data.value = response;
}
</script>
<style></style>
