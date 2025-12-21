<template>
    <div>
        <ViewPanelTemplate :title="`Group Activity: ${props.selectedGroup.groupname}`">
      <GroupSelectItem
        v-for="(count, username) in selectedGroup.messageCountByUser"
        :name="username"
        :max="props.selectedGroup.messageCount"
        :value="count"
      />
        </ViewPanelTemplate>
    </div>
</template>


<script setup lang="ts"> 
import { ModelsGroup } from '@/generated/api';
import ViewPanelTemplate from './ViewPanelTemplate.vue'
import { watch } from 'vue'
import { PropType } from 'vue'
import GroupSelectItem from './GroupSelectItem.vue';

const props = defineProps({
      selectedGroup: { type: Object as PropType<ModelsGroup>, required: false, default: () => [] }
})


watch(() => props.selectedGroup, (newGroupName) => {
    console.log("Selected group changed to", newGroupName)
})

</script>
