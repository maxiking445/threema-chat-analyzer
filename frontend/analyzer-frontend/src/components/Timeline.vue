<template>
    <ViewPanelTemplate :title="title">
        <!-- Switch Button -->
        <div class="button-row">
            <div class="button-left"></div>

            <div class="view-mode-switch">
                <button :class="{ active: viewMode === 'year' }" @click="switchView('year')"
                    :disabled="series.length === 0">
                    Year
                </button>
                <button :class="{ active: viewMode === 'month' }" @click="switchView('month')"
                    :disabled="series.length === 0">
                    Month
                </button>
            </div>

            <div class="button-right">
                <MessageCountLabel :message-count="calcMessageCount()" />
            </div>
        </div>
        <!-- Chart -->
        <div class="chart-container">
            <template v-if="series.length === 0">
                <div class="no-data">
                    Please select users to see the timeline data.
                </div>
            </template>
            <template v-else>
                <apexchart type="bar" height="300" :options="chartOptions" :series="series" />
            </template>

        </div>

        <!-- Time Navigation -->
        <div class="time-navigation">
            <button class="period-button" @click="prevPeriod" :disabled="series.length === 0">◀</button>

            <span class="time-label">
                <template v-if="viewMode === 'year'">
                    {{ selectedYear }}
                </template>
                <template v-else>
                    {{ monthNames[selectedMonth!] }} {{ selectedYear }}
                </template>
            </span>

            <button class="period-button" @click="nextPeriod" :disabled="series.length === 0">▶</button>
        </div>
    </ViewPanelTemplate>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { watch } from 'vue';
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import { ModelsDayCount, ModelsGroupTimeline } from '@/generated/api';
import MessageCountLabel from './MessageCountLabel.vue';

const props = defineProps<{
    title: string
    data
    users: string[]
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
    colors: [
        '#00A8E6',
        '#2ECC71',
        '#FF4757',
        '#20B2AA',
        '#E6F2FF'
    ],

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
})

watch(
    () => [props.data, props.users],
    () => {
        loadTimeline();
    }
);


onMounted(async () => {
    loadTimeline();
})

async function loadTimeline() {
    rawSeries = filterByUserIdsMap(props.data, new Set(props.users));
    buildSeries(rawSeries)
}

function filterByUserIdsMap(timelineResponse: ModelsGroupTimeline[], userIds: Set<string>): Map<string, ModelsDayCount[]> {
    const valuesArray = Array.from(userIds);
    valuesArray.push("You")
    const result = new Map<string, ModelsDayCount[]>()
    timelineResponse.forEach(t => {
        if (valuesArray.includes(t.identity.identity)) {
            let key = t.identity.nickName
            if (!key || result.has(key)) {
                key = t.identity.firstName
            }
            if (!key || result.has(key)) {
                key = t.identity.identity
            }
            if (result.has(key)) {
                const oldValue = result.get(key);
                const mergedArray = [
                    ...oldValue,
                    ...t.timeline

                ];
                result.set(key, mergedArray)
                return
            }
            result.set(key, t.timeline)
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
        x: Date.UTC(selectedYear.value, month, 1),
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
        x: Date.UTC(year, month, day),
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

function calcMessageCount() {
    var sum: number = 0
    series.value.forEach(user => {
        user.data.forEach(x => {
            sum += x.y
        })
    })
    return sum
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

.button-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    margin-bottom: 0.5rem;
}

.view-mode-switch {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.button-right {
    display: flex;
    justify-content: flex-end;
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


.no-data {
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    text-align: center;
}
</style>
