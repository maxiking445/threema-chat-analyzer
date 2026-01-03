<template>
    <ViewPanelTemplate :title="`Group Messages: ${props.groupName}`" - {{ props.userID }}>
        <!-- Switch Button -->
        <div class="view-mode-switch">
            <button :class="{ active: viewMode === 'year' }" @click="switchView('year')">
                Year
            </button>
            <button :class="{ active: viewMode === 'month' }" @click="switchView('month')">
                Month
            </button>
        </div>

        <!-- Chart -->
        <div class="chart-container">
            <apexchart type="bar" height="300" :options="chartOptions" :series="series" />
        </div>

        <!-- Time Navigation -->
        <div class="time-navigation">
            <button class="period-button" @click="prevPeriod">◀</button>

            <span class="time-label">
                <template v-if="viewMode === 'year'">
                    {{ selectedYear }}
                </template>
                <template v-else>
                    {{ monthNames[selectedMonth!] }} {{ selectedYear }}
                </template>
            </span>

            <button class="period-button" @click="nextPeriod">▶</button>
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
        toolbar: { show: false },
        type: 'bar',
        height: 400,
        stacked: true,
        animations: { enabled: true },
        zoom: { enabled: true }
    },
    dataLabels: {
        enabled: false,     
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
    },
    xaxis: {
        type: 'datetime',
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


    chartOptions.value.title.text = `Messages Timelines: ${props.userIDs} in Group ${props.groupID}`


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
        data: viewMode.value === 'year' ? aggregateToMonths(timeline) : aggregateToDays(timeline)
    }))
}


function aggregateToMonths(
    timeline: ModelsDayCount[]
): Array<{ x: number; y: number }> {
    const monthMap = new Map<number, number>()

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

function aggregateToDays(timeline: ModelsDayCount[]) {
    const dayMap = new Map<number, number>()
    const year = selectedYear.value
    if (selectedMonth.value === null) {
        selectedMonth.value = new Date().getMonth()
    }
    const month: number = selectedMonth.value
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let d = 1; d <= daysInMonth; d++) dayMap.set(d, 0)

    timeline.forEach(t => {
        const date = new Date(t.date)
        if (date.getFullYear() !== year || date.getMonth() !== month) return
        const day = date.getDate()
        dayMap.set(day, (dayMap.get(day) ?? 0) + t.count)
    })

    return Array.from(dayMap.entries()).map(([day, count]) => ({
        x: new Date(year, month, day).getTime(),
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

function switchView(mode: ViewMode) {
    viewMode.value = mode
    if (mode === 'month' && selectedMonth.value === null) selectedMonth.value = new Date().getMonth()
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

.time-navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 0.5rem;
}

.period-button {
    padding: 0.3rem 0.8rem;
    font-weight: 600;
    border-radius: 0.25rem;
    border: none;
    background-color: #2d3138;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
}

.period-button:hover {
    background-color: #44484f;
}

.period-button:active {
    background-color: #3bb54a;
    color: #181b20;
}

.time-label {
    font-weight: 600;
    font-size: 1rem;
    color: #fff;
    min-width: 90px;
    text-align: center;
}

.view-mode-switch {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 0.5rem;
}

.view-mode-switch button {
    padding: 0.3rem 0.8rem;
    font-weight: 600;
    border-radius: 0.25rem;
    border: none;
    background-color: #2d3138;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s;
}

.view-mode-switch button.active {
    background-color: #3bb54a;
    color: #181b20;
}

.view-mode-switch button:hover {
    background-color: #44484f;
}
</style>
