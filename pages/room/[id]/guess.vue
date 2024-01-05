<script setup lang="ts">
const connectionHandler = useConnectionHandler();
</script>

<template>
    <div class="h-full w-full flex flex-col">
        <div class="flex h-12 mb-8 justify-between items-center shrink-0">
            <h1>Guessing
                <span class="text-[var(--app-c-primary)]">
                    {{ connectionHandler.room?.id }}
                </span>
            </h1>
        </div>
        <div v-auto-animate class="flex-grow">
            <section class="h-full w-full flex items-center flex-col"
                v-if="!connectionHandler.room?.showLeaderboard">
                <div
                    class="p-3 inline-flex text-8xl border border-[var(--app-c-primary)] rounded-md grow-[1] md:grow-0 md:h-48  xl:h-72 xl:w-72 w-full justify-center items-center bg-opacity-75 bg-zinc-700 mb-8 shadow-lg shadow-[var(--app-c-primary)]">
                    🔊
                </div>
                <section class="inline-flex flex-wrap justify-between flex-grow-[2] xl:flex-grow-0" v-if="connectionHandler.guessOptions.length">
                    <button v-for="option, i in connectionHandler.guessOptions" @click="connectionHandler.sendGuess(i)"
                        class="w-full md:w-[calc(50%-0.25rem)] mb-2 md:min-h-20">
                        {{ option[0] }}
                        <br>
                        <span class="text-xs bg-black bg-opacity-10 p-1 px-2 rounded-md">
                            {{ option[1] }}
                        </span>
                    </button>
                </section>
                <section class="h-72 flex flex-col justify-center items-center grow-[2]" v-else>
                    <Spinner />
                    <h2 class="text-[var(--app-c-secondary)]">
                        waiting for other players...
                    </h2>
                </section>
            </section>
    
            <!-- leaderboard -->
            <section v-else>
                <h1 class="text-[var(--app-c-primary)] mb-2">Leaderboard</h1>
                <div class="div" />
                <ul v-auto-animate>
                    <li v-for="[player, score], i in connectionHandler.room?.leaderboard" :id="player"
                        class="flex justify-between items-center bg-zinc-700 rounded-md p-2 mb-2">
                        <span>{{ i + 1 }}. {{ player }}</span>
                        <span class="text-[var(--app-c-primary)] p-1 bg-zinc-600 rounded-md">{{ score }}</span>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>