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
        <div class="flex">
            <div>
                <ul class="bg-stone-800 p-2 rounded-md w-44">
                    <h3>Players</h3>
                    <div class="div"></div>
                    <li class="ml-5" v-for="name in connectionHandler.room?.players">
                        {{ name }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="div">

        </div>
        <button v-if="!connectionHandler.isReady" @click="connectionHandler.readyUp"
            class="p-4 absolute w-[calc(100%-1rem)] sm:w-1/3 mx-auto left-0 right-0 bottom-2">Ready Up</button>
        <button v-else @click="connectionHandler.unready"
            class="p-4 absolute w-[calc(100%-1rem)] sm:w-1/3 mx-auto left-0 right-0 bottom-2 secondary">Unready</button>
    </section>
</template>