<script setup lang="ts">
import Header from './components/Header.vue';
import WordCloud from './components/WordCloud.vue';
import GroupRow from './components/GroupRow.vue';
import ViewPanelTemplate from './components/ViewPanelTemplate.vue';
</script>

<template>
    <div class="app">
        <Header></Header>
        <main class="app-main">
            <div class="content">
                <GroupRow title="TOP Groups"></GroupRow>
                <ViewPanelTemplate title="Wordcloud">
                    <WordCloud></WordCloud>
                </ViewPanelTemplate>

            </div>
        </main>
    </div>
</template>