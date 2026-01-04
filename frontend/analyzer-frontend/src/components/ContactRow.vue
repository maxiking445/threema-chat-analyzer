<template>
    <div class="contact-container">
        <ViewPanelTemplate class="flexItem" title="Contacts" direction="horizontal">
            <ContactPanel :contacts="contacts" @contactSelected="handleContactSelected"></ContactPanel>
            <ContactTimeline class="flexItem" :users="calcUsersIds()"></ContactTimeline>
        </ViewPanelTemplate>
    </div>

</template>

<script setup lang="ts">
import { ModelsContact } from '@/generated/api';
import { onMounted, ref } from 'vue'
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import ContactPanel from './ContactPanel.vue';
import ContactTimeline from './ContactTimeline.vue';
import { loadContacts } from "@/service/ApiService";

const selectedContacts = ref<ModelsContact[]>();
const contacts = ref<ModelsContact[]>([]);

const handleContactSelected = (userIds) => {
    selectedContacts.value = undefined;
    var selected: ModelsContact[] = contacts.value.filter(contact => userIds.includes(contact.identity.identity));
    selectedContacts.value = selected
}

onMounted(async () => {
    loadContacts().then((response) => {
        contacts.value = response;
        contacts.value = contacts.value.sort((a, b) => (b.totalMessageCount || 0) - (a.totalMessageCount || 0));
    });
});
function calcUsersIds() {
    if (selectedContacts.value) {
        var userIds = selectedContacts.value.map(contact => contact.identity.identity)
        userIds.push("You")
        return userIds
    }
    return []
}

</script>

<style scoped>
.contact-container {
    display: flex;
    gap: 3rem;
}

.flexItem {
    flex: 1;
}
</style>
