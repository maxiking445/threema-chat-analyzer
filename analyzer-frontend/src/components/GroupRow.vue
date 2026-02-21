<template>
    <div class="group-container">
        <ViewPanelTemplate class="flexItem" title="Groups" direction="horizontal">
            <div ref="loadingDiv" style="position: relative">
                <GroupPanel :groups="groups" @groupSelected="handleGroupSelected"></GroupPanel>
            </div>
            <GroupSelect :selectedGroup="selectedGroup" @update:selectedMembers="onSelectedMembersChanged">
            </GroupSelect>
            <GroupTimeline class="flexItem" :groupName="selectedGroup?.groupName" :groupID="selectedGroup?.groupUid"
                :userIDs="Array.from(selectedUserIds)"></GroupTimeline>

        </ViewPanelTemplate>

    </div>

</template>

<script setup lang="ts">
import { ModelsGroup } from '@/generated/api';
import GroupPanel from './GroupPanel.vue';
import GroupSelect from './GroupSelect.vue';
import { onMounted, ref } from 'vue'
import GroupTimeline from './GroupTimeline.vue';
import ViewPanelTemplate from './ViewPanelTemplate.vue';
import { loadGroups } from "@/service/ApiService";
import { useAppLoading } from '@/composables/useAppLoading';


const selectedGroup = ref<ModelsGroup>();
const groups = ref<ModelsGroup[]>([]);
const selectedUserIds = ref<Set<string>>(new Set());

const loadingDiv = ref(null)
const $loading = useAppLoading();

const handleGroupSelected = (groupKey) => {
    selectedGroup.value = undefined;
    var selected: ModelsGroup = groups.value.find(group => group.groupUid === groupKey);
    selected.groupMember.sort((a, b) => b.messageCount - a.messageCount);
    selectedGroup.value = selected
}

function onSelectedMembersChanged(newSelection: Array<string>) {
    selectedUserIds.value = new Set(newSelection);
}

onMounted(async () => {
    const loader = $loading.show({
        container: loadingDiv.value ? loadingDiv.value : undefined,
    })
    loadGroups().then((response) => {
        groups.value = response;
        loader.hide()
    });
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
