<template>
    <div class="contact-container">
        <ViewPanelTemplate class="flexItem" title="Contacts" direction="horizontal">
            <div ref="loadingDiv" style="position: relative">
                <ContactPanel :contacts="contacts" @contactSelected="handleContactSelected"></ContactPanel>
            </div>
            <ContactTimeline class="flexItem" :users="calcUsersIds()"></ContactTimeline>
        </ViewPanelTemplate>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import ContactPanel from './ContactPanel.vue';
import ContactTimeline from './ContactTimeline.vue';
import { dataCache } from "@/service/DataLoadService";
import { useAppLoading } from '@/composables/useAppLoading'
import { ModelsContact } from '@/models';

const selectedContacts = ref<ModelsContact[]>();
const contacts = ref<ModelsContact[]>([]);
const loadingDiv = ref(null)
const $loading = useAppLoading();


const handleContactSelected = (userIds: string[]) => {
    selectedContacts.value = undefined;
    var selected: ModelsContact[] = contacts.value.filter(contact => userIds.includes(contact.identity.identity));
    selectedContacts.value = selected
}

onMounted(async () => {
    const loader = $loading.show({
        container: loadingDiv.value ? loadingDiv.value : undefined,
    })
    dataCache.loadContacts().then((response) => {
        loader.hide()
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
