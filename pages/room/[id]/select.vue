<script setup lang="ts">
type SearchItem = {
    name: string;
    type: string;
    id: string;
}

const connectionHandler = useConnectionHandler();
const query = ref('');
const searchBox = ref<HTMLInputElement>();

const handleSuggestions = (e: MessageEvent) => {
    const msg = String(e.data);
    if (!msg.startsWith('suggestions ')) return;
    const idx = msg.indexOf(' ');
    results.value = JSON.parse(msg.substring(idx + 1)) as SearchItem[]
}
onMounted(async () => {
    const ws = await connectionHandler.getWs()
    ws.addEventListener('message', handleSuggestions)
})

onUnmounted(async () => {
    const ws = await connectionHandler.getWs()
    ws.removeEventListener('message', handleSuggestions)
})
const results = ref([] as SearchItem[]);

let lastInput = Date.now();
let queryCount = 0;
let loading = false;
const stoppedTyping = (q: string) => {
    lastInput = Date.now();
    loading = true;
    setTimeout(async () => {
        if (Date.now() - lastInput >= 500) {
            const ws = await connectionHandler.getWs()
            console.log("nth query: " + (++queryCount));
            ws.send(`suggest ${q}`)
            loading = false;
        }
    }, 500);
}

watch(query, async (q) => {
    if (q.length === 0) {
        results.value = [];
        return;
    }
    if (q.length <= 2) return;
    stoppedTyping(q)
})

const addSong = (id: string) => {
    query.value = '';
    results.value = [];
    connectionHandler.addSongs(id)
    searchBox.value?.focus();
}
</script>

<template>
    <div class="flex h-12 mb-8 justify-between items-center">
        <h1>Select Songs
            <span class="text-[var(--app-c-primary)]">
                {{ connectionHandler.room?.id }}
            </span>
        </h1>
        <button v-if="connectionHandler.isHost" @click="connectionHandler.startGuessing()">
            Start Guessing
        </button>
    </div>
    <section class="h-full w-full">
        <input type="text" class="inline-block w-full" placeholder="Search for songs" v-model="query" ref="searchBox">
        <div class="div" />
        
        <ul v-auto-animate>
            <li v-if="loading" class="bg-zinc-800 duration-150 shadow-zinc-100 my-2 p-1 pl-4 h-13 rounded-md flex items-center justify-between hover:-translate-y-1 overflow-clip">
                <div>
                    <h4>
                        Loading...
                    </h4>
                </div>
            </li>
            <li v-for="result in results" :key="result.id"
                class="bg-zinc-800 duration-150 hover:shadow-lg shadow-zinc-100 my-2 p-1 pl-4 h-13 rounded-md flex items-center justify-between hover:-translate-y-1 overflow-clip">
                <div>
                    <h4>
                        {{ result.name }}
                    </h4>
                    <p class="bg-zinc-900 -ml-1 mt-1 text-sm px-2 text-gray-400 w-fit rounded-md">
                        {{ result.type }}
                    </p>
                </div>
                <button class="w-7 h-10 mr-1 flex justify-center items-center" @click="addSong(result.id)"> + </button>
            </li>
        </ul>

        <div v-if="!query" class="h-full w-full flex justify-center items-center">
            <h3 class="text-center text-gray-400">
                Search for songs to add them to the playlist
            </h3>
        </div>
    </section>
</template>