<template>
  <div>
    <ViewPanelTemplate title="Contacts">
      <div class="contacts-list" :style="{ maxHeight: '400px', overflow: 'auto' }">
        <PanelItem v-for="contact in filteredContacts" :id="contact.identity.identity"
          :uuid="contact.identity.identityID" :showAvatar="true" :showBar="false"
          :displayName="resolveUserName(contact)" :value="contact.messageCount || 0"
          :selected="isSelected(contact.identity.identity)" @click="handleItemClick" />
      </div>

    </ViewPanelTemplate>
  </div>
</template>

<script setup lang="ts">
import { ModelsContact } from '@/generated/api';
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import { computed, PropType, ref } from 'vue'
import PanelItem from './PanelItem.vue';

const props = defineProps({
  contacts: { type: Array as PropType<ModelsContact[]>, required: false, default: () => [] }
})
const selectedContacts = ref<string[]>([])


const emit = defineEmits(['contactSelected'])

function isSelected(identityID: string): boolean {
  return selectedContacts.value.includes(identityID)
}

function handleItemClick(id: string) {
  const index = selectedContacts.value.indexOf(id)
  if (index !== -1) {
    selectedContacts.value.splice(index, 1)
  } else {
    selectedContacts.value.push(id)
  }
  emit('contactSelected', selectedContacts.value)
}

const filteredContacts = computed(() => {
  return props.contacts.filter(contact => contact.messageCount > 0)
})

function resolveUserName(contact: ModelsContact): string {
  return contact.identity.nickName || contact.identity.firstName || contact.identity.lastName || contact.identity.identity;
}
</script>

<style scoped>
.contacts-list {
  max-height: 100%;
  overflow-y: auto;
  padding: 8px 0;
}

:deep(.contacts-list::-webkit-scrollbar) {
  width: 8px;
}

:deep(.contacts-list::-webkit-scrollbar-thumb) {
  background-color: #3bb54a;
}
</style>