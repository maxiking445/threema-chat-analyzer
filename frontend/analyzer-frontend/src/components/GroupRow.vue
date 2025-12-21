<template>
    <div class="group-container">
        <GroupPanel :groups="groups" @groupSelected="handleGroupSelected"></GroupPanel>
        <GroupSelect :selectedGroup="selectedGroup"></GroupSelect>
    </div>
</template>

<script setup lang="ts">
import { Configuration, DefaultApi, ModelsGroup } from '@/generated/api';
import GroupPanel from './GroupPanel.vue';
import GroupSelect from './GroupSelect.vue';
import { ref } from 'vue'


const defaultApi = new DefaultApi({
    basePath: '/api',
    middleware: [],
    username: undefined,
    password: undefined,
    apiKey: undefined,
    accessToken: undefined,
} as Configuration);

const selectedGroup = ref<ModelsGroup>();
const groups = ref<ModelsGroup[]>([]);


const handleGroupSelected = (groupKey) => {
    selectedGroup.value = groups.value.find(group => group.groupUid === groupKey);
    console.log("Group clicked", groupKey);
}


defaultApi.groupsGet().then((response) => {
    console.log("Groups:", response);
    groups.value = response;
    handleGroupSelected(response[0].groupUid);
});

</script>

<style scoped>
.group-container {
    display: flex;
    gap: 3rem;
}
</style>
