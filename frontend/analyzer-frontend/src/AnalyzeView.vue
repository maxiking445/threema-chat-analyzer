<script setup lang="ts">
import Header from './components/Header.vue';
import WordCloud from './components/WordCloud.vue';
</script>

<template>
    <div class="app">
        <Header></Header>
        <main class="app-main">
            <div class="content">
                <WordCloud></WordCloud>
            </div>
        </main>
    </div>
</template>