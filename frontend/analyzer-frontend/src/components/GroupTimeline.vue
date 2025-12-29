<template>
    <ViewPanelTemplate :title="`Group Messages: ${props.groupName}`" - {{ props.userID }}>
        <div>
            <apexchart type="bar" height="300" :options="chartOptions" :series="series" />
        </div>
    </ViewPanelTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { watch } from 'vue';
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import { loadGroupTimeline } from "@/service/ApiService";
import { ModelsDayCount, ModelsGroupTimeline } from '@/generated/api';
const props = defineProps<{
    groupName: string
    userID: string
}>()

const series = ref<any[]>([])
const chartOptions = ref({
    chart: {
        type: 'bar',
        height: 400,
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '50%',
        },
    },
    xaxis: {
        type: 'category',
        categories: [] as string[],
    },
    yaxis: {
        min: 0,
    },
    title: {
        text: 'Messages Timeline',
    },
})

watch(
    () => [props.groupName, props.userID], // beobachte beide Props
    ([newGroup, newUser], [oldGroup, oldUser]) => {
        console.log('Group changed from', oldGroup, 'to', newGroup);
        console.log('User changed from', oldUser, 'to', newUser);
        loadTimeline();
    }
);


onMounted(async () => {
    loadTimeline();
})

async function loadTimeline(){
    console.log("Loading timeline for group:", props.groupName, "and user:", props.userID);
    const timeline: ModelsDayCount[] = await loadGroupTimeline(props.groupName, props.userID)

    chartOptions.value.xaxis.categories = timeline.map(t => t.date)

    series.value = [
        {
            name: `${props.userID} in Group ${props.groupName}`,
            data: timeline.map(t => t.count),
        },
    ]

    chartOptions.value.title.text = `Messages Timeline: ${props.userID} in Group ${props.groupName}`
}

</script>
