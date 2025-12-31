<template>
  <div>
    <ViewPanelTemplate :title="`Group Activity: ${props.selectedGroup.groupName}`" :key="props.selectedGroup?.id">
      <GroupSelectItem v-for="groupMember in selectedGroup.groupMember" :identity="groupMember.identity"
        :max="props.selectedGroup.messageCount" :value="groupMember.messageCount"
        :selected="selectedMembers.has(groupMember.identity.identityID)" @click="handleItemClick" />
    </ViewPanelTemplate>
  </div>
</template>


<script setup lang="ts">
import { ModelsGroup } from '@/generated/api';
import ViewPanelTemplate from './ViewPanelTemplate.vue'
import { watch, ref } from 'vue'
import { PropType } from 'vue'
import GroupSelectItem from './GroupSelectItem.vue';

const selectedMembers = ref<Set<string>>(new Set())


const props = defineProps({
  selectedGroup: { type: Object as PropType<ModelsGroup>, required: false, default: () => [] }
})

watch(() => props.selectedGroup, (newGroupName) => {
  console.log("Selected group changed to", newGroupName)
  newGroupName.groupMember.forEach(member => {
    console.log("Member:", member.identity, "Messages:", member.messageCount)
  });

})

function handleItemClick(identityID: string) {
  console.log("Handling click for identityID:", identityID)
  if (selectedMembers.value.has(identityID)) {
    selectedMembers.value.delete(identityID)
  } else {
    selectedMembers.value.add(identityID)
  }
  selectedMembers.value = new Set(selectedMembers.value)
  console.log("Clicked on member with ID:", selectedMembers)
}
</script>
