<template>
  <div class="dropdown-wrapper">
    <label for="chat-dropdown">Select:</label>
    <select
      id="chat-dropdown"
      v-model="selectedValue"
      @change="handleChange"
      class="dropdown"
    >
      <option value="">-- Select a contact or group --</option>
      <optgroup label="Contacts" v-if="contacts.length > 0">
        <option
          v-for="contact in contacts"
          :key="'contact-' + contact.identity.identity"
          :value="'contact:' + contact.identity.identity"
        >
          {{ getContactName(contact) }}
        </option>
      </optgroup>
      <optgroup label="Groups" v-if="groups.length > 0">
        <option
          v-for="group in groups"
          :key="'group-' + group.groupUid"
          :value="'group:' + group.groupUid"
        >
          {{ group.groupName }}
        </option>
      </optgroup>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ModelsContact } from '@/models/ModelsContact'
import { ModelsGroup } from '@/models/ModelsGroup'

// Define props for contacts and groups
const props = defineProps<{
  contacts: ModelsContact[]
  groups: ModelsGroup[]
}>()

const selectedValue = ref<string>('')

const emit = defineEmits<{
  (e: 'selection', value: ModelsContact | ModelsGroup): void
}>()

function handleChange() {
  if (!selectedValue.value) return
  
  const [type, id] = selectedValue.value.split(':')
  
  if (type === 'contact') {
    const contact = props.contacts.find(c => c.identity.identity === id)
    if (contact) emit('selection', contact)
  } else if (type === 'group') {
    const group = props.groups.find(g => g.groupUid === id)
    if (group) emit('selection', group)
  }
}

function getContactName(contact: ModelsContact): string {
  return (
    contact.identity.nickName ||
    contact.identity.firstName ||
    contact.identity.lastName ||
    contact.identity.identity
  )
}
</script>

<style scoped>
.dropdown-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-wrapper label {
  color: #f9fafb;
  font-weight: 500;
  white-space: nowrap;
}

.dropdown {
  padding: 8px 12px;
  background: #181b20;
  color: #f9fafb;
  border: 1px solid #3bb54a;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  min-width: 250px;
}

.dropdown:hover {
  background: #1e2127;
}

.dropdown:focus {
  outline: none;
  border-color: #4cc859;
  box-shadow: 0 0 0 2px rgba(59, 181, 74, 0.2);
}

.dropdown option,
.dropdown optgroup {
  background: #181b20;
  color: #f9fafb;
}
</style>
