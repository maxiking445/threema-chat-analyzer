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
    () => [props.groupName, props.userID],
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
    console.log("Loading timeline for group:", props.groupName, "and user:", props.userID);
    const timelineResponse: ModelsGroupTimeline[] = await loadGroupTimeline(props.groupName)
    const filteredRes: ModelsDayCount[] = filterByUserId(timelineResponse, props.userID);

    series.value = [
        {
            name: props.userID,
            data: filteredRes.map(t => ({
                x: new Date(t.date).getTime(),
                y: t.count,
            })),
        },
    ]

    chartOptions.value.title.text = `Messages Timeline: ${props.userID} in Group ${props.groupName}`


}

function filterByUserId(timelineResponse: ModelsGroupTimeline[], userId: string): ModelsDayCount[] {
    const filteredRes = timelineResponse.filter(t => t.user === userId);
    if (filteredRes.length > 0) {
        console.log("Filtered Timeline Data:", filteredRes[0].timeline);
        return filteredRes[0].timeline;
    }
    return [];
}

</script>
