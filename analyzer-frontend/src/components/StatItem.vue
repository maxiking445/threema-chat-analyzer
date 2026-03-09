<template>
  <div class="stat-item">
    <div class="stat-icon">
      <font-awesome-icon :icon="icon" />
    </div>
    <div class="stat-content">
      <span class="stat-value">{{ value }}</span>
      <span class="stat-label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string | number
}>()
</script>

<style scoped>
.stat-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  min-width: 0;
}

.stat-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-muted);
  color: var(--color-primary);
  font-size: 0.75rem;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-label {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  line-height: 1.3;
}
</style>
