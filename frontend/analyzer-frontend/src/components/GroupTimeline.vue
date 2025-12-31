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
    userIDs: Set<string>
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
    tooltip: {
        enabled: true,

    },
    xaxis: {
        type: 'datetime',
        labels: {
            formatter: (value: number) => {
                return new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                })
            },
        }
    },
    yaxis: {
        min: 0,
    },
    title: {
        text: 'Messages Timeline',
    },
})

watch(
    () => [props.groupName, props.userIDs],
    ([newGroup, newUser], [oldGroup, oldUser]) => {
        console.log('Group changed from', oldGroup, 'to', newGroup);
        console.log('User changed from', oldUser, 'to', newUser);
        loadTimeline();
    }
);


onMounted(async () => {
    loadTimeline();
})

async function loadTimeline() {
    console.log("Loading timeline for group:", props.groupName, "and user:", props.userIDs);
    const timelineResponse: ModelsGroupTimeline[] = await loadGroupTimeline(props.groupName)
    const filteredRes: Map<string, ModelsDayCount[]> = filterByUserIdsMap(timelineResponse, props.userIDs);

    series.value = Array.from(filteredRes.entries()).map(([userId, timeline]) => ({
        name: userId,
        data: timeline.map(t => ({
            x: new Date(t.date).getTime(),
            y: t.count,
        })),
    }))

    chartOptions.value.title.text = `Messages Timeline: ${props.userIDs} in Group ${props.groupName}`


}

function filterByUserIdsMap(
    timelineResponse: ModelsGroupTimeline[],
    userIds: Set<string>
): Map<string, ModelsDayCount[]> {
    console.log("Filtering timeline for user IDs:", userIds)
    const result = new Map<string, ModelsDayCount[]>()
    const userIdsSet = new Set(userIds) 
    timelineResponse.forEach(t => {
        if (userIdsSet.has(t.user)) {
            result.set(t.user, t.timeline)
        }
    })

    return result
}

</script>
<style>
.apexcharts-tooltip {
    color: black !important;
    background-color: black;
}
</style>
