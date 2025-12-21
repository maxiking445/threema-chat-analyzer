<template>
    <div class="panel">
        <h1 class="title">{{ title }}</h1>
        <div class="accent-line"></div>
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String
})
</script>

<style scoped>
.panel {
    margin: 20px;
    width: fit-content;
    min-width: 300px;
    min-height: 500px;
    padding: 1.75rem 1.75rem 2rem;
    border-radius: 16px;
    background: #181b20;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
    border: 1px solid #20242b;
    color: #f9fafb;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}


.title {
    margin: 0 0 0.25rem;
    font-size: 1.4rem;
    font-weight: 600;
}


.accent-line {
    height: 2px;
    width: 100%;
    background: #ffffff;
    opacity: 0.18;
    margin-bottom: 1rem;
}

.content {
    display: left;
}
</style>
