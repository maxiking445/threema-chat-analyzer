<template>
  <div>
    <ViewPanelTemplate title="Your Groups">
      <PanelItem v-for="group in groups" :uuid="group.groupUid":id="group.groupUid" :displayName="group.groupName" :showAvatar="false" :showBar="false"
        :value="group.messageCount" :selected="group.groupUid === selectedGroupKey" @click="handleItemClick" />
    </ViewPanelTemplate>
  </div>
</template>

<script setup lang="ts">
import PanelItem from './PanelItem.vue';
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
