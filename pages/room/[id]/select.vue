<script setup lang="ts">
preloadRouteComponents('guess')
export type SearchItem = {
    name: string;
    type: string;
    id: string;
}

const showSongListOnMobile = ref(false);

const connectionHandler = useConnectionHandler();
const query = ref('');
const searchBox = ref<HTMLInputElement>();
const songsList = ref<HTMLUListElement>();

const songsLen = toRef(() => connectionHandler.room?.ownsongs.length);
const scrollDown = () => {
    const el = songsList.value;
    if (!el) return;
    // wait for animation from auto-animate
    setTimeout(() => {
        el.scrollTo(0, el.scrollHeight);
    }, 10);
}
watch(songsLen, (newVal, oldVal) => {
    if (!newVal || !oldVal) return;
    // dont scroll when deleting songs
    if (newVal < oldVal) return;
    scrollDown();
})
if (connectionHandler.room) {
    watch(connectionHandler.room.downloadQueue, () => {
        scrollDown();
    })
}

const handleSuggestions = (e: MessageEvent) => {
    const msg = String(e.data);
    if (!msg.startsWith('suggestions ')) return;
    const idx = msg.indexOf(' ');
    results.value = JSON.parse(msg.substring(idx + 1)) as SearchItem[]
}

onMounted(async () => {
    const ws = await connectionHandler.getWs()
    if (!ws) return;
    ws.addEventListener('message', handleSuggestions)
})

onUnmounted(async () => {
    const ws = await connectionHandler.getWs()
    if (!ws) return;
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
            const ws = await connectionHandler.getWs();
            if (!ws) return;
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

const addSong = (song: SearchItem) => {
    query.value = '';
    results.value = [];
    connectionHandler.addSong(song)
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
            start guessing ▶
        </button>
    </div>
    <section class="h-[calc(100%-5rem)] w-full">
        <input type="text" class="inline-block w-full" placeholder="Search for songs" v-model="query" ref="searchBox">
        <div class="div" />

        <ul v-auto-animate>
            <li v-if="loading"
                class="bg-zinc-800 duration-150 shadow-zinc-100 my-2 p-1 pl-4 h-13 rounded-md flex items-center justify-between hover:-translate-y-1 overflow-clip">
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
                <button class="w-7 h-10 mr-1 flex justify-center items-center" @click="addSong(result)"> + </button>
            </li>
        </ul>

        <div v-if="!query" class="h-[calc(100%-5rem)] w-full flex justify-center items-center">
            <h3 class="text-center text-gray-400">
                Search for songs to add them to the playlist
            </h3>
        </div>
    </section>

    <!-- mobile FAB -->
    <template class="inline-block lg:hidden z-[61] !fixed bottom-4 right-4" v-auto-animate>
        <div class="relative">
            <button @click="showSongListOnMobile = !showSongListOnMobile"
                class="w-14 h-14 rounded-full secondary shadow-md shadow-[var(--app-c-primary)] flex justify-center items-center text-2xl">
                <span v-if="showSongListOnMobile">🔍</span>
                <span v-else>📑</span>
            </button>
            <span class="absolute bg-[var(--app-c-primary)] w-5 h-6 flex justify-center items-center rounded-full -bottom-1 -right-1 pointer-events-none opacity-90">
                {{ connectionHandler.room?.ownsongs.length  }}
            </span>
            <span class="absolute bg-[#4e8ff0] w-5 h-6 flex justify-center items-center rounded-full -bottom-1 -left-1 pointer-events-none opacity-90">
                {{ connectionHandler.room?.downloadQueue.length  }}
            </span>
        </div>
    </template>

    <section
        class="bg-[#131313] slide-in hidden 2xl:-translate-x-0 2xl:inline-flex flex-col border border-[var(--app-c-secondary)] absolute mx-auto 2xl:left-[calc(960px+18rem)] left-0 top-0 2xl:right-0 xl:top-44 h-full 2xl:max-h-[calc(100%-11.5rem)] 2xl:h-fit w-full 2xl:w-64 rounded-md shadow-lg shadow-[var(--app-c-primary)] z-10 2xl:-z-10"
        :class="{ 'open': showSongListOnMobile, 'closed': !showSongListOnMobile }">
        <h1 class="text-xl text-center my-2">
            <span
                class="font-semibold w-7 h-7 bg-[var(--app-c-secondary)] rounded-md inline-block text-center shadow-md shadow-[var(--app-c-primary)]">
                {{ connectionHandler.room?.ownsongs.length }}
            </span>
            added songs 📑
        </h1>
        <div class="div" />
        <ul v-auto-animate class="relative h-full inline-block px-2 overflow-y-scroll scroll-smooth" ref="songsList">
            <li v-for="song, i in connectionHandler.room?.ownsongs" :key="song[0]"
                class="bg-zinc-800 duration-150 shadow-zinc-100 my-1 p-1 pl-4 h-13 rounded-md flex items-center justify-between hover:-translate-y-1 overflow-clip last:mb-[4.25rem] 2xl:last:mb-3">
                <div>
                    <h4>
                        {{ song[0] }}
                    </h4>
                    <p class="bg-zinc-900 -ml-1 mt-1 text-sm px-2 text-gray-400 w-fit rounded-md">
                        {{ song[1] }}
                    </p>
                </div>
                <button class="w-7 h-10 mr-1 flex justify-center items-center !bg-red-900 font-bold"
                    @click="connectionHandler.removeSong(i)"> 🗑️ </button>
            </li>
            <div v-if="connectionHandler.room?.downloadQueue.length" class="text-center text-gray-400 m-4 mb-5">
                👾 Downloading...
            </div>
            <li v-for="songName in connectionHandler.room?.downloadQueue" :key="songName"
                class="relative w-full animate-pulse bg-zinc-700 duration-150 shadow-zinc-100 my-1 p-2 pl-4 text-sm max-h-16 text-ellipsis break-words whitespace-break-spaces rounded-md hover:-translate-y-1 last:mb-[4.25rem] 2xl:last:mb-3">
                <span class="h-full w-full overflow-clip inline-block">
                    {{ songName }}
                </span>
                <!-- loading ping -->
                <span
                    class="absolute -top-1 -left-1 pointer-events-none border-2 bg-[var(--app-c-primary)] border-[var(--app-c-primary)] rounded-md w-3 h-3" />
                <span
                    class="absolute -top-1 -left-1 pointer-events-none border-2 border-[var(--app-c-primary)] rounded-md w-3 h-3 animate-ping" />
            </li>
            <li v-if="!connectionHandler.room?.ownsongs.length && !connectionHandler.room?.downloadQueue.length"
                class="text-center text-gray-400 m-4 mb-5">
                No songs added yet 👀
                <br>
                <span class="text-gray-500">
                    Search for songs to add them to the playlist
                </span>
            </li>
        </ul>
    </section>
</template>

<style scoped>
.slide-in {
    animation: slide-in 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}


@media screen and (max-width: 1536px) {
    .slide-in {
        animation: none;
    }

    .hidden {
        transform: translateY(100%);
        display: flex;
        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 60;
    }

    .open {
        transform: translateY(0%);
    }

    .closed {
        transform: translateY(100%);
    }
}


@keyframes slide-in {
    0% {
        transform: translateX(-100%);
        opacity: 0
    }

    65% {
        opacity: 1;
        scale: 1;
    }

    85% {
        scale: 1.05;
    }

    100% {
        transform: translateX(0%);
        scale: 1;
    }
}
</style>