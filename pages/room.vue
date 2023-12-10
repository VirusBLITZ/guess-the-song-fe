<script setup lang="ts">
const connection = useConnectionHandler();

const mode = computed(() => {
    if (connection.isLocal && connection.isHost) {
        return 'HOSTING LOCAL'
    } else if (connection.isLocal && !connection.isHost) {
        return 'PLAYING LOCAL'
    } else if (!connection.isLocal && connection.isHost) {
        return 'HOSTING ONLINE'
    } else {
        return 'PLAYING ONLINE'
    }
})
</script>

<template>
    <div class="rounded-full h-10 absolute right-2 p-2 bottom-2 bg-[var(--app-c-primary)] hidden md:inline-block">
        <b>{{ mode }}</b>
    </div>
    <NuxtPage />
</template>