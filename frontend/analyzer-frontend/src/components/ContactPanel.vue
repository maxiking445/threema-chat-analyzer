<template>
  <div>
    <ViewPanelTemplate title="Contacts">
      <button @click="toggleShowUnreadOnly" :class="{ 'active': !showUnreadOnly }">
        {{ showUnreadOnly ? 'All Contacts' : 'Only with messages' }}
      </button>
      <div class="contacts-list" :style="{ maxHeight: '300px', overflow: 'auto' }">
        <PanelItem  v-for="contact in filteredContacts" :id="contact.identity.identity" :uuid="contact.identity.identityID" :showAvatar="true" :showBar="false"
          :displayName="resolveUserName(contact)" :value="contact.messageCount || 0"
          :selected="contact.identity.identityID === selectedContactKey" @click="handleItemClick" />
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

const selectedContactKey = ref<string | null>(null)
const showUnreadOnly = ref(false)


const emit = defineEmits(['contactSelected'])

function handleItemClick(userId) {
  selectedContactKey.value = userId
  emit('contactSelected', userId)
}


function toggleShowUnreadOnly() {
  showUnreadOnly.value = !showUnreadOnly.value
}

const filteredContacts = computed(() => {
  if (showUnreadOnly.value) {
    return props.contacts.filter(contact => contact.messageCount > 0)
  }
  return props.contacts
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
  background-color: rgba(0, 150, 136, 0.6);
}
</style>