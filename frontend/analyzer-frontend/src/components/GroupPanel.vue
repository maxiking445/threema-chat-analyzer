<template>
  <div>
    <ViewPanelTemplate title="Groups">
      <GroupItem v-for="group in groups" :groupKey="group.groupUid" :groupName="group.groupName"
        :messageCount="group.messageCount" :selected="group.groupUid === selectedGroupKey" @click="handleItemClick" />
    </ViewPanelTemplate>
  </div>
</template>

<script setup lang="ts">
import GroupItem from './GroupPanelItem.vue'
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import { ModelsGroup } from '@/generated/api';
import { PropType, ref } from 'vue'

defineProps({
  groups: { type: Array as PropType<ModelsGroup[]>, required: false, default: () => [] }
})

const selectedGroupKey = ref<string | null>(null)


const emit = defineEmits(['groupSelected'])

function handleItemClick(groupKey) {
  selectedGroupKey.value = groupKey
  emit('groupSelected', groupKey)
}
</script>
