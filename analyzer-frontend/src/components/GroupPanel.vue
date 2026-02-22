<template>
  <div>
    <ViewPanelTemplate title="Your Groups">
      <PanelItem v-for="group in groups" :uuid="group.groupUid":id="group.groupUid" :displayName="group.groupName" :showAvatar="false" :showBar="false"
        :value="group.messageCount" :selected="group.groupUid === selectedGroupKey" @click="handleItemClick"  class="panelItem"/>
    </ViewPanelTemplate>
  </div>
</template>

<script setup lang="ts">
import { ModelsGroup } from '@/models/ModelsGroup';
import PanelItem from './PanelItem.vue';
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import { PropType, ref } from 'vue'

defineProps({
  groups: { type: Array as PropType<ModelsGroup[]>, required: false, default: () => [] }
})

const selectedGroupKey = ref<string | null>(null)


const emit = defineEmits(['groupSelected'])

function handleItemClick(groupKey: string) {
  selectedGroupKey.value = groupKey
  emit('groupSelected', groupKey)
}
</script>

