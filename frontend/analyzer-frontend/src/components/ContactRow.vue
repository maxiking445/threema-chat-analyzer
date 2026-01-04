<template>
    <div class="contact-container">
        <ViewPanelTemplate class="flexItem" title="Contacts Panel" direction="horizontal">
            <ContactPanel :contacts="contacts" @groupSelected="handleGroupSelected"></ContactPanel>
        </ViewPanelTemplate>

    </div>

</template>

<script setup lang="ts">
import { ModelsContact, ModelsGroup } from '@/generated/api';
import { onMounted, ref } from 'vue'
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import ContactPanel from './ContactPanel.vue';
import { loadContacts } from "@/service/ApiService";

const selectedContact = ref<ModelsContact>();
const contacts = ref<ModelsContact[]>([]);

const handleGroupSelected = (identityID) => {
    selectedContact.value = undefined;
    var selected: ModelsGroup = contacts.value.find(contact => contact.identity.identity === identityID);
    selected.groupMember.sort((a, b) => b.messageCount - a.messageCount);
    selectedContact.value = selected
}

onMounted(async () => {
    loadContacts().then((response) => {
        contacts.value = response;
        contacts.value = contacts.value.sort((a, b) => (b.messageCount || 0) - (a.messageCount || 0));
    });
});
</script>

<style scoped>
.contact-container {
    padding: 2em;
    display: flex;
    gap: 3rem;
}

.flexItem {
    flex: 1;
}
</style>
