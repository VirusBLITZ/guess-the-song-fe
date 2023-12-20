<script setup lang="ts">
definePageMeta({
    alias: '/room/:id',
})

const connectionHandler = useConnectionHandler();
const animateBar = computed(() => connectionHandler.startingIn > 0);

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

        <span v-else class="absolute w-[calc(100%-1rem)] sm:w-1/3 mx-auto left-0 right-0 bottom-2">
            <button @click="connectionHandler.unready" class="relative left-0 top-0 p-4 w-full bg-transparent z-[15]">
                Unready
            </button>
            <span class="absolute h-full bg-[var(--app-c-secondary)] w-full left-0 top-0 -z-0" />
            <span class="absolute h-full bg-[var(--app-c-primary)] w-full left-0 top-0 -z-0"
            :style="`transition-duration: ${connectionHandler.startingIn + 250}ms; width: ${animateBar ? 100 : 0}%`"></span>
        </span>
    </section>
</template>
