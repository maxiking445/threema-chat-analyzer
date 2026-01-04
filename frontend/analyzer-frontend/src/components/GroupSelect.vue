<template>
  <div>
    <ViewPanelTemplate :title="`Group Activity: ${props.selectedGroup.groupName}`" :key="props.selectedGroup?.id">
      <div v-if="selectedGroup.groupMember == undefined">
       <NoData></NoData>
      </div>
      <PanelItem v-for="groupMember in selectedGroup.groupMember" :display-name="resolveUserName(groupMember.identity)"
        :id="groupMember.identity.identity" :uuid="groupMember.identity.identityID" :show-avatar="true" :show-bar="true"
        :max="props.selectedGroup.messageCount" :value="groupMember.messageCount"
        :selected="isSelected(groupMember.identity.identity)" @click="handleItemClick" />
    </ViewPanelTemplate>
  </div>
</template>


<script setup lang="ts">
import { ModelsGroup, ModelsIdentity } from '@/generated/api';
import ViewPanelTemplate from './ViewPanelTemplate.vue'
import { watch, ref } from 'vue'
import { PropType } from 'vue'
import PanelItem from './PanelItem.vue';
import NoData from './NoData.vue';

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

function resolveUserName(identity: ModelsIdentity): string {
  return identity.nickName || identity.firstName || identity.lastName || identity.identity;
}

function isSelected(identityID: string): boolean {
  return selectedMembers.value.includes(identityID)
}

function handleItemClick(id: string) {
  console.log("Clicked member:", id)
  const index = selectedMembers.value.indexOf(id)
  if (index !== -1) {
    selectedMembers.value.splice(index, 1)
  } else {
    selectedMembers.value.push(id)
  }
  emit('update:selectedMembers', selectedMembers.value)
}

const emit = defineEmits<{
  (e: 'update:selectedMembers', value: Array<string>): void
}>()
</script>
