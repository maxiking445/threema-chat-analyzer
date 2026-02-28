<script setup lang="ts">
import { useRouter } from 'vue-router';
import Header from './components/Header.vue';
import WordCloud from './components/WordCloud.vue';
import GroupRow from './components/GroupRow.vue';
import ViewPanelTemplate from './components/ViewPanelTemplate.vue';
import ContactRow from './components/ContactRow.vue';
import BackButton from './components/BackButton.vue';

const router = useRouter();
function goToChat() {
  router.push('/chat');
}
</script>

<template>
    <div class="app">
        <Header></Header>
        <main class="app-main">
            <div class="contentWrapper">
                <div class="header-row">
                    <BackButton to="/view"></BackButton>
                    <button class="chat-nav" @click="goToChat">Chat</button>
                </div>
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
.contentWrapper {
    padding: 2em;
    width: 100%;
    box-sizing: border-box;
}

.header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1em;
}

.chat-nav {
    padding: 8px 16px;
    background-color: #3bb54a;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.chat-nav:hover {
    background-color: #2fb85e;
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