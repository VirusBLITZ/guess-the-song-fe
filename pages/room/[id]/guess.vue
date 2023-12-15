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
        <div class="text-8xl border rounded-md w-80 h-80 flex justify-center items-center bg-opacity-75 bg-slate-50 mb-4">
            🔊
        </div>
        <section class="flex flex-wrap w-full justify-between">
            <button v-for="option, i in connectionHandler.guessOptions" @click="connectionHandler.sendGuess(i)"
                class="w-full md:w-[calc(50%-0.25rem)] mb-2">
                {{ option }}
            </button>
        </section>
    </section>
</template>