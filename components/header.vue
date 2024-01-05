<script setup lang="ts">
const serverBase = useState('serverBase')
const volume = useState<string>('volume')
</script>

<template>
    <div class="flex justify-between p-3 h-20">
        <!-- desktop -->
        <div class="hidden sm:inline-block">
            <h1>Guess The Song 🎶</h1>
            server <input type="text" v-model="serverBase">
        </div>
        <!-- mobile -->
        <div class="inline-block sm:hidden">
            <h1>GTS 🎶</h1>
            <input type="text" v-model="serverBase">
        </div>
        <span class="flex items-center h-full">
            <ClientOnly>
                <span class="mr-14 relative h-14 flex items-center group cursor-pointer z-50">
                    volume
                    <span
                        @wheel.up="(event: WheelEvent) => volume = String(event.deltaY < 0 ? Math.min(Number(volume) + 2, 100) : Math.max(Number(volume) - 2, 0))"
                        class="z-50 absolute left-0 right-0 -translate-x-1/4 !w-28 -bottom-16 -rotate-90 bg-zinc-800 py-2 px-2 rounded-md shadow-md justify-center items-center hidden group group-hover:inline-flex">
                        <input type="range" inputmode="decimal" name="volume" id="volume" class="!w-24 !h-3"
                            v-model="volume">
                    </span>
                </span>
            </ClientOnly>
            <nav>
                <RouterLink to="/">Home</RouterLink>
                <!-- <router-link to="/about">About</router-link> -->
            </nav>
        </span>
    </div>
</template>

<style scoped>
a {
    color: #fff;
    text-decoration: none;
    margin-left: 1rem;
}

input {
    background-color: rgba(255, 255, 255, 0.087);
    border-bottom: 1px solid #fff;
    border-radius: 0.25rem;
    padding: 0.1rem;
    outline: none;
    border: none;
    font-size: small;
    width: fit-content;
    outline: none;
}

input:active,
input:focus {
    outline: 1px solid #ffffff35;
    box-shadow: none;
}
</style>