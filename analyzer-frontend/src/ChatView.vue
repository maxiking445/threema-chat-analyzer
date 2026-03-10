<template>
  <div class="chat-view">
    <!-- Top bar -->
    <div class="top-bar">
      <div class="top-controls">
        <DropDown :contacts="contacts" :groups="groups" @selection="handleSelection" />
        <RoundButton icon="download" @click="downloadHtmlContent" title="Download HTML" />
      </div>
    </div>

    <!-- Main content area -->
    <div class="chat-body">
      <!-- Stats sidebar (contacts only) -->
      <aside v-if="isContactSelected && statsContactId" class="stats-sidebar">
        <ContactStatsPanel :contactId="statsContactId" />
      </aside>

      <!-- Chat area -->
      <div class="chat-main">
        <div class="chat-display-area" ref="chatArea">
          <template v-if="chats?.messages?.length">
            <div v-for="(msg, index) in chats.messages" :key="index"
              :class="['message-row', msg.sender.identityID === 'You' ? 'row-self' : 'row-other']">
              <ChatMessage :message="msg.text" :date="msg.date" :identity="msg.sender" :showName="showName" />
            </div>
          </template>
          <div v-else-if="chats" class="empty-state">No messages</div>
          <div v-else class="empty-state">Select a contact or group to view messages</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DropDown from './components/chat/DropDown.vue'
import ChatMessage from './components/chat/ChatMessage.vue'
import ContactStatsPanel from './components/ContactStatsPanel.vue'
import { dataCache } from '@/service/DataLoadService'
import { ModelsContact } from '@/models/ModelsContact'
import { ModelsGroup } from '@/models/ModelsGroup'
import { toast } from 'vue3-toastify'
import { ModelsChat } from './models/ModelsChat'
import { useAppLoading } from './composables/useAppLoading'
import RoundButton from './components/button/RoundButton.vue'

const contacts = ref<ModelsContact[]>([])
const groups = ref<ModelsGroup[]>([])
const chats = ref<ModelsChat>()
const selectedItem = ref<string>('')
const isLoading = ref(false)
const showName = ref(false)
const isContactSelected = ref(false)
const statsContactId = ref<string | null>(null)
const loadingDiv = ref(null)
const chatArea = ref<HTMLElement | null>(null)
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

  const isContact = 'identity' in value
  isContactSelected.value = isContact
  showName.value = !isContact

  const id = isContact ? value.identity.identityID : value.groupUid
  selectedItem.value = id
  statsContactId.value = isContact ? id : null

  const result = await dataCache.loadChats(id);
  chats.value = { id, messages: [] } as ModelsChat;
  const BATCH_SIZE = 500;

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

function downloadHtmlContent() {
  if (!chatArea.value) return
  const content = chatArea.value.innerHTML
  const head = document.head.innerHTML
  const full = `<!doctype html><html><head>${head}</head><body>${content}</body></html>`
  const blob = new Blob([full], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${selectedItem.value || 'chat'}.html`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}


</script>

<style scoped>
.chat-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.top-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chat-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.stats-sidebar {
  width: 340px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid var(--color-border);
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-display-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
  margin: 20px auto;
  max-width: 800px;
  width: 90%;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-chat-area-bg);
  box-shadow: var(--shadow-md);
}

.empty-state {
  color: var(--color-text-muted);
  text-align: center;
  padding: 3rem 1rem;
  font-size: 0.9rem;
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
