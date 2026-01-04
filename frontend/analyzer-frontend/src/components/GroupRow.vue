<template>
    <div class="group-container">
        <ViewPanelTemplate class="flexItem" title="Groups" direction="horizontal">
            <GroupPanel :groups="groups" @groupSelected="handleGroupSelected"></GroupPanel>
            <GroupSelect :selectedGroup="selectedGroup" @update:selectedMembers="onSelectedMembersChanged">
            </GroupSelect>
            <GroupTimeline class="flexItem" :groupName="selectedGroup?.groupName" :groupID="selectedGroup?.groupUid"
                :userIDs="Array.from(selectedUserIds)"></GroupTimeline>

        </ViewPanelTemplate>

    </div>

</template>

<script setup lang="ts">
import { Configuration, DefaultApi, ModelsGroup } from '@/generated/api';
import GroupPanel from './GroupPanel.vue';
import GroupSelect from './GroupSelect.vue';
import { ref } from 'vue'
import GroupTimeline from './GroupTimeline.vue';
import ViewPanelTemplate from './ViewPanelTemplate.vue';


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

function onSelectedMembersChanged(newSelection: Array<string>) {
    console.log("Selected members changed:", newSelection);
    selectedUserIds.value = new Set(newSelection);
}


defaultApi.groupsGet().then((response) => {
    console.log("Groups:", response);
    groups.value = response;
});

</script>

<style scoped>
.group-container {
    display: flex;
    gap: 3rem;
}

.flexItem {
    flex: 1;
}
</style>
