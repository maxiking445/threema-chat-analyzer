<script setup lang="ts">
import Header from './components/Header.vue';
import WordCloud from './components/WordCloud.vue';
import GroupRow from './components/GroupRow.vue';
import ViewPanelTemplate from './components/ViewPanelTemplate.vue';
import ContactRow from './components/ContactRow.vue';
</script>

<template>
    <div class="app">
        <Header></Header>
        <main class="app-main">
            <div class="content">
                <GroupRow></GroupRow>
                <ContactRow></ContactRow>
                <ViewPanelTemplate class="wordCloudWrapper" title="Wordcloud">
                    <div class="wordCloudContainer">
                        <WordCloud />
                    </div>

                </ViewPanelTemplate>
            </div>
        </main>
    </div>
</template>

<style>
.content {
    padding: 2em;
    width: 100%;
    box-sizing: border-box;
}

.wordCloudWrapper {
    width: auto !important;
    padding-right: 2em;
}

.wordCloudContainer {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>