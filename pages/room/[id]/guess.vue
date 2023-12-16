<script setup lang="ts">
const connectionHandler = useConnectionHandler();
</script>

<template>
    <div class="flex h-12 mb-8 justify-between items-center">
        <h1>Guessing
            <span class="text-[var(--app-c-primary)]">
                {{ connectionHandler.room?.id }}
            </span>
        </h1>
    </div>
    <section class="h-full w-full flex justify-center items-center flex-col">
        <div class="text-8xl border border-[var(--app-c-primary)] rounded-md w-80 h-80 flex justify-center items-center bg-opacity-75 bg-zinc-700 mb-4 shadow-lg shadow-[var(--app-c-primary)]">
            🔊
        </div>
        <section class="flex flex-wrap w-full justify-between" v-if="connectionHandler.guessOptions.length">
            <button v-for="option, i in connectionHandler.guessOptions" @click="connectionHandler.sendGuess(i)"
                class="w-full md:w-[calc(50%-0.25rem)] mb-2">
                {{ option[0] }}
                <br>
                <span class="text-xs bg-black bg-opacity-10 p-1 px-2 rounded-md">
                    {{ option[1] }}
                </span>
            </button>
        </section>
        <section class="h-72 flex flex-col justify-center items-center" v-else>
            <div
                class="border-[var(--app-c-secondary)] border-4 rounded-full w-12 h-12 border-r-[var(--app-c-primary)] animate-spin m-12 mt-0" />
            <h2 class="text-[var(--app-c-secondary)]">
                waiting for other players...
            </h2>
        </section>
    </section>
</template>