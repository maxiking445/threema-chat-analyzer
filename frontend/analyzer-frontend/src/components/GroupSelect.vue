<template>
  <div>
    <ViewPanelTemplate :title="`Group Activity: ${props.selectedGroup.groupName}`" :key="props.selectedGroup?.id">
      <GroupSelectItem v-for="groupMember in selectedGroup.groupMember" :identity="groupMember.identity"
        :max="props.selectedGroup.messageCount" :value="groupMember.messageCount"
        :selected="isSelected(groupMember.identity.identity)" @click="handleItemClick" />
    </ViewPanelTemplate>
  </div>
</template>


<script setup lang="ts">
import { ModelsGroup } from '@/generated/api';
import ViewPanelTemplate from './ViewPanelTemplate.vue'
import { watch, ref } from 'vue'
import { PropType } from 'vue'
import GroupSelectItem from './GroupSelectItem.vue';

const selectedMembers = ref<string[]>([])


const props = defineProps({
  selectedGroup: { type: Object as PropType<ModelsGroup>, required: false, default: () => [] }
})

watch(() => props.selectedGroup, (newGroupName) => {
  console.log("Selected group changed to", newGroupName)
  newGroupName.groupMember.forEach(member => {
    console.log("Member:", member.identity, "Messages:", member.messageCount)
  });

})

function isSelected(identityID: string): boolean {
  return selectedMembers.value.includes(identityID)
}

function handleItemClick(identityID: string) {
  const index = selectedMembers.value.indexOf(identityID)
  if (index !== -1) {
    selectedMembers.value.splice(index, 1)
  } else {
    selectedMembers.value.push(identityID)
  }
  emit('update:selectedMembers', selectedMembers.value)
}

const emit = defineEmits<{
  (e: 'update:selectedMembers', value: Array<string>): void
}>()
</script>
