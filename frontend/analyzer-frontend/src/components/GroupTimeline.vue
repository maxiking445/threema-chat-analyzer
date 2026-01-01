<template>
    <ViewPanelTemplate :title="`Group Messages: ${props.groupName}`" - {{ props.userID }}>
        <div class="chart-container">
            <apexchart type="bar" height="300"  :options="chartOptions" :series="series" />
        </div>
        <div class="time-navigation">
            <button @click="prevPeriod">◀</button>

            <span class="time-label">
                <template v-if="viewMode === 'year'">
                    {{ selectedYear }}
                </template>
                <template v-else>
                    {{ monthNames[selectedMonth!] }} {{ selectedYear }}
                </template>
            </span>

            <button @click="nextPeriod">▶</button>
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
    groupID: string
    userIDs: Set<string>
}>()


const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
]

var rawSeries: Map<string, ModelsDayCount[]> = new Map()
const series = ref<any[]>([])
type ViewMode = 'year' | 'month'
const viewMode = ref<ViewMode>('year')
const selectedYear = ref<number>(2025)
const selectedMonth = ref<number | null>(null)


const chartOptions = ref({
    chart: {
        type: 'bar',
        height: 400,
        animations: { enabled: false },
        zoom: { enabled: false }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '50%',
        },
    },
    tooltip: {
        enabled: true,
        theme: 'dark',
        x: {
            format: 'MMMM yyyy'
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            format: 'MMM'
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
    () => [props.groupID, props.userIDs],
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
    console.log("Loading timeline for group:", props.groupID, "and user:", props.userIDs);
    const timelineResponse: ModelsGroupTimeline[] = await loadGroupTimeline(props.groupID)
    rawSeries = filterByUserIdsMap(timelineResponse, props.userIDs);
    buildSeries(rawSeries)


    chartOptions.value.title.text = `Messages Timeline: ${props.userIDs} in Group ${props.groupID}`


}

function filterByUserIdsMap(timelineResponse: ModelsGroupTimeline[], userIds: Set<string>): Map<string, ModelsDayCount[]> {
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

function buildSeries(filteredRes: Map<string, ModelsDayCount[]>) {
    series.value = Array.from(filteredRes.entries()).map(([userId, timeline]) => ({
        name: userId,
        data: aggregateToMonths(timeline)
    }))
}


function aggregateToMonths(
    timeline: ModelsDayCount[]
): Array<{ x: number; y: number }> {
    const monthMap = new Map<number, number>()
    chartOptions.value.tooltip.x.format = 'MMMM yyyy'

    for (let m = 0; m < 12; m++) {
        monthMap.set(m, 0)
    }

    timeline.forEach(t => {
        const date = new Date(t.date)

        if (date.getFullYear() !== selectedYear.value) {
            return
        }

        const month = date.getMonth()
        monthMap.set(month, (monthMap.get(month) ?? 0) + t.count)
    })

    return Array.from(monthMap.entries()).map(([month, count]) => ({
        x: new Date(selectedYear.value, month, 1).getTime(),
        y: count
    }))
}


function prevPeriod() {
    if (viewMode.value === 'year') {
        selectedYear.value--
    } else {
        if (selectedMonth.value === 0) {
            selectedMonth.value = 11
            selectedYear.value--
        } else {
            selectedMonth.value!--
        }
    }
    buildSeries(rawSeries)
}

function nextPeriod() {
    if (viewMode.value === 'year') {
        selectedYear.value++
    } else {
        if (selectedMonth.value === 11) {
            selectedMonth.value = 0
            selectedYear.value++
        } else {
            selectedMonth.value!++
        }
    }
    buildSeries(rawSeries)
}

</script>
<style>
.apexcharts-tooltip {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}
.chart-container {
  width: 100%;       
  max-width: 100%;  
  display: block;   
}
</style>
