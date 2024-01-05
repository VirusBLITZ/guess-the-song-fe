<script setup lang="ts">
preloadRouteComponents('room/0')
const username = useState<string>('username')
const serverBase = useState<string>('serverBase')

const connection = useConnectionHandler();

const roomId = ref('')

onMounted(() => connection.leaveRoom())
</script>

<template>
    <h2 class="p-2">
        Lobby
    </h2>

    <input type="text" class="block w-42 mx-auto text-center" placeholder="Username" v-model="username">
    <main class="w-full md:flex items-center">
        <div>
            <Card title="Host Local 🎉" class="hidden md:inline-block">
                Create a game on a bigger screen with only one audio source. <br>
                Useful for playing with friends in the same room.
                <template #footer>
                    <button @click="connection.hostLocal()">Create</button>
                </template>
            </Card>
            <Card class="secondary" title="Host Online 🌐">
                Create a game on your own device and share it with your friends. <br>
                Enables playing over great distances.
                <template #footer>
                    <button @click="connection.hostOnline()" class="secondary">Create</button>
                </template>
            </Card>
        </div>
        <div>
            <Card title="Join Local 🚪">
                Join the party without playing the songs on your own device.
                <template #footer>
                    <input @keydown.enter="connection.joinLocal(roomId)" inputmode="numeric" type="text" pattern="^[0-9]+"
                        placeholder="ROOM ID" class="w-32 mr-2" v-model="roomId">
                    <button @click="connection.joinLocal(roomId)">Join</button>
                </template>
            </Card>
            <Card secondary title="Join Online 🌐">
                Join an online game and play the songs on your own device.
                <template #footer>
                    <input @keydown.enter="connection.joinOnline(roomId)" inputmode="numeric" type="text" pattern="^[0-9]+"
                        placeholder="ROOM ID" class="w-32 mr-2" v-model="roomId">
                    <button class="secondary" @click="connection.joinOnline(roomId)">Join</button>
                </template>
            </Card>
        </div>
    </main>
</template>