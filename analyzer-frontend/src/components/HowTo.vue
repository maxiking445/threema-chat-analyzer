<template>
    <div class="page">
        <section class="howto">
            <h2 class="howto-title">How to</h2>

            <article v-for="step in steps" :key="step.id" class="howto-step">
                <div class="howto-text">
                    <h3 class="howto-step-title">{{ step.title }}</h3>
                    <p class="howto-step-body">{{ step.text }}</p>
                </div>
            </article>
        </section>
    </div>
</template>

<script setup>
const steps = [
    {
        id: 1,
        title: '1. Threema-Backup export',
        text: 'Create a Threema Data Backup (Settings > Backups > Data-Backup) and export it.',
        image: '/assets/step1.png',
    },
    {
        id: 2,
        title: '2. Upload your Threema-Backup',
        text: 'Drop you ZIP here and enter the password you used during export.',
        image: '/assets/step2.png',
    },
    {
        id: 3,
        title: '3. Analyze',
        text: 'Press analyze and wait until the analysis is done. This may take a while depending on the chat history size.',
        image: '/assets/step3.png',
    },
]
</script>

<style scoped>

.page {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #f9fafb;
}

.howto {
    max-width: 720px;
    margin: 2rem auto 0;
    padding: 1.5rem 1.25rem 2rem;
    border-radius: 16px;
    background: #181b20;
    border: 1px solid #242731;
    color: #f9fafb;
}

.howto-title {
    margin: 0 0 1.25rem;
    font-size: 1.3rem;
    font-weight: 600;
}

.howto-step {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border-top: 1px solid #242731;
}

.howto-step:first-of-type {
    border-top: none;
    padding-top: 0;
}

.howto-image {
    width: 100%;
    max-height: 220px;
    object-fit: cover;
    border-radius: 10px;
}

.howto-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.howto-step-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
}

.howto-step-body {
    margin: 0;
    font-size: 0.9rem;
    color: #9ca3af;
}

@media (min-width: 768px) {
    .howto-step {
        flex-direction: row;
        align-items: flex-start;
    }

    .howto-image {
        max-width: 220px;
    }
}
</style>
