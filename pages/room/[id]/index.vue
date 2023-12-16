<script setup lang="ts">
definePageMeta({
    alias: '/room/:id',
})

const connectionHandler = useConnectionHandler();

onMounted(() => {
    if (!!!connectionHandler.room && typeof useRoute().params.id === 'string') {
        setTimeout(() => {
            connectionHandler.joinRoom(useRoute().params.id as string)
        }, 1000)
    }
})
</script>

<template>
    <h1>Lobby
        <span class="text-[var(--app-c-primary)]">
            {{ connectionHandler.room?.id }}
        </span>
    </h1>
    <section class="h-full w-full">
        <div class="div" />
        <div
            class="bg-stone-800 p-2 mx-auto sm:mt-12 w-[calc(100%-1rem)] sm:w-1/3 shadow-lg shadow-[var(--app-c-primary)] border border-[var(--app-c-primary)] rounded-md">
            <h3>Players</h3>
            <div class="div"></div>
            <ul class="relative" v-auto-animate>
                <li class="ml-5 w-fit px-2 rounded-md" v-for="player in connectionHandler.room?.players"
                    :id="player.username">
                    {{ player.username }}
                    <span class="absolute left-2" v-auto-animate>
                        <span v-if="player.isReady === undefined" class="text-[var(--app-c-secondary)]">?</span>
                        <span v-else-if="player.isReady" class="text-[var(--app-c-primary)]">✓</span>
                        <span v-else class="text-[var(--app-c-secondary)]">✗</span>
                    </span>
                    <div class="div"></div>
                </li>
            </ul>
        </div>
        <button v-if="!connectionHandler.isReady" @click="connectionHandler.readyUp"
            class="p-4 absolute w-[calc(100%-1rem)] sm:w-1/3 mx-auto left-0 right-0 bottom-2">Ready Up</button>
        <button v-else @click="connectionHandler.unready"
            class="p-4 absolute w-[calc(100%-1rem)] sm:w-1/3 mx-auto left-0 right-0 bottom-2 secondary">Unready</button>
    </section>
</template>