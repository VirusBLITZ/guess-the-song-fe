<script setup lang="ts">
type SearchItem = {
    name: string;
    type: string;
    id: string;
}

const connectionHandler = useConnectionHandler();
const query = ref('')

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

watch(query, async (q) => {
    const ws = await connectionHandler.getWs()
    console.log("query", q);

    ws.send(`suggest ${q}`)
})
</script>

<template>
    <h1 class="mb-8">Select Songs
        <span class="text-[var(--app-c-primary)]">
            {{ connectionHandler.room?.id }}
        </span>
    </h1>
    <section class="h-full w-full">
        <input type="text" class="inline-block w-full" placeholder="Search for songs" v-model="query" @input="">
        <div class="div" />

        <ul>
            <li v-for="result in results"
                class="bg-zinc-800 duration-150 hover:shadow-lg shadow-zinc-100 my-2 p-1 pl-4 rounded-md flex items-center justify-between hover:-translate-y-1">
                <div>
                    <h4>
                        {{ result.name }}
                    </h4>
                    <p class="bg-zinc-900 -ml-1 mt-1 text-sm px-2 text-gray-400 w-fit rounded-md">
                        {{ result.type }}
                    </p>
                </div>
                <button class="w-7 h-7 mr-2 flex justify-center items-center"> + </button>
            </li>
        </ul>
    </section>
</template>