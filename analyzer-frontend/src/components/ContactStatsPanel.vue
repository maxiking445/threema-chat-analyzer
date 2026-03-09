<template>
  <div class="stats-panel">
    <h3 class="panel-title">Contact Statistics</h3>

    <div v-if="loading" class="loading-state">Loading...</div>
    <div v-else-if="stats" class="stats-grid">
      <!-- Messages -->
      <div class="stat-group">
        <h4 class="stat-group-title">Messages</h4>
        <div class="stat-row">
          <StatItem icon="paper-plane" label="Sent" :value="stats.sentCount" />
          <StatItem icon="inbox" label="Received" :value="stats.receivedCount" />
        </div>
        <div class="stat-row">
          <StatItem icon="hashtag" label="Total Days" :value="stats.totalDays" />
          <StatItem icon="calendar-day" label="Per Day" :value="stats.avgMessagesPerDay" />
        </div>
      </div>

      <!-- Media -->
      <div class="stat-group">
        <h4 class="stat-group-title">Media</h4>
        <div class="stat-row">
          <StatItem icon="image" label="Images" :value="stats.imageCount" />
          <StatItem icon="video" label="Videos" :value="stats.videoCount" />
        </div>
        <div class="stat-row">
          <StatItem icon="microphone" label="Voice" :value="stats.voiceMessageCount" />
        </div>
      </div>

      <!-- Timing -->
      <div class="stat-group">
        <h4 class="stat-group-title">Timing</h4>
        <div class="stat-row">
          <StatItem icon="calendar" label="First Message" :value="formatDate(stats.firstMessageDate)" />
        </div>
        <div class="stat-row">
          <StatItem icon="calendar" label="Last Message" :value="formatDate(stats.lastMessageDate)" />
        </div>
        <div class="stat-row">
          <StatItem icon="clock" label="Avg. Response" :value="formatDuration(stats.avgResponseTimeMs)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import StatItem from './StatItem.vue'
import { loadContactStats } from '@/service/ContactStatsService'
import { ModelsContactStats } from '@/models/ModelsContactStats'

const props = defineProps<{
  contactId: string | null
}>()

const stats = ref<ModelsContactStats | null>(null)
const loading = ref(false)

watch(() => props.contactId, async (id) => {
  if (!id) {
    stats.value = null
    return
  }
  loading.value = true
  try {
    stats.value = await loadContactStats(id)
  } catch {
    stats.value = null
  } finally {
    loading.value = false
  }
}, { immediate: true })

function formatDate(date: Date | null): string {
  if (!date) return '-'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDuration(ms: number | null): string {
  if (ms === null) return '-'
  const totalSeconds = Math.round(ms / 1000)
  if (totalSeconds < 60) return `${totalSeconds}s`
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes < 60) return `${minutes}m ${seconds}s`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}
</script>

<style scoped>
.stats-panel {
  padding: 1.25rem;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 1rem;
}

.loading-state {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  padding: 1rem 0;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.stat-group-title {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.stat-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.stat-row:last-child {
  margin-bottom: 0;
}
</style>
