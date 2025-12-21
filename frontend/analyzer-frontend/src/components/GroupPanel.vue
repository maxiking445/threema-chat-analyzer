<template>
  <div>
    <ViewPanelTemplate title="Groups">
      <GroupItem
        v-for="group in groups"
        :groupKey="group.groupUid"
        :groupName="group.groupName"
        :messageCount="group.messageCount"
        @click="handleItemClick"
      />
    </ViewPanelTemplate>
  </div>
</template>

<script setup lang="ts">
import GroupItem from './GroupPanelItem.vue'
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import {  ModelsGroup } from '@/generated/api';
import { PropType } from 'vue'

defineProps({
  groups: { type: Array as PropType<ModelsGroup[]>, required: false, default: () => [] }
})

const emit = defineEmits(['groupSelected'])

function handleItemClick(groupKey) {

  emit('groupSelected', groupKey)
}



</script>

