<template>
    <div class="group-container">
        <GroupPanel :groups="groups" @groupSelected="handleGroupSelected"></GroupPanel>
        <GroupSelect :selectedGroup="selectedGroup" @update:selectedMembers="onSelectedMembersChanged"></GroupSelect>
        <GroupTimeline :groupName="selectedGroup?.groupUid" :userIDs="selectedUserIds"></GroupTimeline>
    </div>

</template>

<script setup lang="ts">
import { Configuration, DefaultApi, ModelsGroup } from '@/generated/api';
import GroupPanel from './GroupPanel.vue';
import GroupSelect from './GroupSelect.vue';
import { ref } from 'vue'
import GroupTimeline from './GroupTimeline.vue';


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
const selectedUserIds = ref<Set<string>>(new Set());

const handleGroupSelected = (groupKey) => {
    selectedGroup.value = undefined;
    var selected: ModelsGroup = groups.value.find(group => group.groupUid === groupKey);
    selected.groupMember.sort((a, b) => b.messageCount - a.messageCount);
    selectedGroup.value = selected
}

function onSelectedMembersChanged(newSelection: Set<string>) {
    console.log("Selected members changed:", newSelection);
    selectedUserIds.value = newSelection;
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
