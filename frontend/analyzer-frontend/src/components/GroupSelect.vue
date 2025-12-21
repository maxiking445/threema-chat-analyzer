<template>
    <div>
        <ViewPanelTemplate :title="`Group Activity: ${props.selectedGroup.groupName}`" :key="props.selectedGroup?.id">
      <GroupSelectItem
        v-for="groupMember in selectedGroup.groupMember"
        :identity="groupMember.identity"
        :max="props.selectedGroup.messageCount"
        :value="groupMember.messageCount"
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
    newGroupName.groupMember.forEach(member => {
        console.log("Member:", member.identity, "Messages:", member.messageCount)
    });

})
</script>
