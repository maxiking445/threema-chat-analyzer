<template>
    <div class="app">
        <header class="app-header">
            <div class="header-left">
                <img alt="Vue logo" class="logo" src="../assets/logo.svg" width="32" height="32" />
                <h1 class="title">Threema Chat Analyzer</h1>
            </div>

            <a class="github-link" href="https://github.com/maxiking445/threema-chat-analyzer" target="_blank"
                rel="noopener noreferrer">
                <img src="../assets/github.svg" alt="GitHub" class="github-icon" />
            </a>
        </header>
    </div>
</template>

<style scoped>
.github-link {
    filter: invert(1);
}

.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #242731;
    background: #181b20;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.logo {
    display: block;
}

.title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #f9fafb;
}

.github-link {
    display: inline-flex;
    align-items: center;
}

.github-icon {
    width: 20px;
    height: 20px;
}
</style>