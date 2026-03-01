<template>
  <div class="chat-container">
    <Header />
    <main class="chat-main">
      <div class="top-bar">
        <BackButton to="/view" />
        <DropDown :contacts="contacts" :groups="groups" @selection="handleSelection" />
      </div>

      <div class="chat-display-area">
        <template v-if="chats?.messages">
            <div
              v-for="(msg, index) in chats.messages"
              :key="index"
              :class="['message-row', msg.sender.identityID === 'You' ? 'row-self' : 'row-other']"
            >
              <ChatMessage
                :message="msg.text"
                :date="msg.date"
                :identity="msg.sender"
                :showName="showName"
              />
                </div>
            </template>
            <div v-else class="no-messages">No Messages</div>
          </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import BackButton from './components/BackButton.vue'
import DropDown from './components/chat/DropDown.vue'
import ChatMessage from './components/chat/ChatMessage.vue'
import { dataCache } from '@/service/DataLoadService'
import { ModelsContact } from '@/models/ModelsContact'
import { ModelsGroup } from '@/models/ModelsGroup'
import { toast } from 'vue3-toastify'
import { ModelsChat } from './models/ModelsChat'
import { useAppLoading } from './composables/useAppLoading'

const contacts = ref<ModelsContact[]>([])
const groups = ref<ModelsGroup[]>([])
const chats = ref<ModelsChat>()
const selectedItem = ref<string>('')
const isLoading = ref(false)
const showName = ref(false)
const loadingDiv = ref(null)
const $loading = useAppLoading();
const loader = ref<ReturnType<typeof $loading.show> | null>(null)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  isLoading.value = true
  try {
    const [contactsData, groupsData] = await Promise.all([
      dataCache.loadContacts(),
      dataCache.loadGroups(),
    ])
    contacts.value = contactsData
    groups.value = groupsData

  } catch (error) {
    toast.error('Error loading data. Please try again.', error)
  } finally {
    isLoading.value = false
  }
}

async function handleSelection(value: ModelsContact | ModelsGroup) {
  loader.value = $loading.show({
    container: loadingDiv.value,
    isFullPage: false,
  })
  const isContact: boolean = 'identity' in value;
  if (isContact) {
    showName.value = false;
  } else {
    showName.value = true;
  }
  const id = 'identity' in value ? value.identity.identityID : value.groupUid
  selectedItem.value = id
  console.log('Selected:', value)
  const result = await dataCache.loadChats(id);
  chats.value = { id, messages: [] } as ModelsChat;
  const BATCH_SIZE = 500;

  // append first chunk and reveal UI quickly
  if (result.messages.length > 0) {
    const first = result.messages
      .slice(0, BATCH_SIZE)
      .map((m, idx) => ({ ...m, id: `${idx}-${id}-${m.date || ''}` }));
    chats.value.messages.push(...first);
  }
 

  for (let i = BATCH_SIZE; i < result.messages.length; i += BATCH_SIZE) {
    const slice = result.messages
      .slice(i, i + BATCH_SIZE)
      .map((m, idx) => ({ ...m, id: `${i + idx}-${id}-${m.date || ''}` }));
    chats.value.messages.push(...slice);
    await new Promise<void>(r => requestAnimationFrame(() => r()));
  }

   loader.value?.hide();
}

</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0f1115;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #20242b;
}



.chat-display-area {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
  margin: 20px auto;
  max-width: 800px;
  width: 90%;
  border: 1px solid #2a2e34;
  border-radius: 8px;
  background: #0f1115;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.scroller {
  height: 100%;
  width: 100%;
}

.no-messages {
  color: #9ca3af;
  text-align: center;
  margin-top: 20px;
}

.message-row {
  display: flex;
  width: 100%;
}

.message-row.row-self {
  justify-content: flex-end;
}

.message-row.row-other {
  justify-content: flex-start;
}
</style>
