export type Room = {
    id: string;
    players: string[];
}

export const useConnectionHandler = defineStore('connectionHandler', () => {
    const ws = ref(null as WebSocket & { usernameSet?: boolean } | null);
    const room = ref(null as Room | null);
    const songsRoute = ref('/songs');
    const isHost = ref(false);
    const isLocal = ref(false);
    const isReady = ref(false);

    const handleGeneralMsg = (e: MessageEvent) => {
        const msg = String(e.data)
        const firstSpace = msg.indexOf(' ');
        let split = [msg, ''];
        if (firstSpace !== -1) {
            split = [msg.substring(0, firstSpace), msg.substring(firstSpace + 1)]
        }
        // crop \"
        const croppedOnce = split[1].substring(1, split[1].length - 1)
        switch (split[0]) {
            case 'song_route':
                songsRoute.value = split[1];
                break;
            case 'user_join':
                if (room.value && isHost && isLocal && !isReady) readyUp();
                room.value!.players.push(croppedOnce);
                break;
            case 'user_leave':
                const idx = room.value!.players.indexOf(croppedOnce);
                room.value!.players.splice(idx, 1);
                break;
        }
    }

    const getWs = async () => {
        if (!ws.value) {
            const base = useState<string>('serverBase').value;
            ws.value = new WebSocket(`wss://${base}/ws`);
            ws.value.onmessage = handleGeneralMsg;
            ws.value.onopen = () => {
                console.log('ws opened');
            }
            // await connction open
            await new Promise((resolve, reject) => {
                ws.value!.onopen = resolve;
                ws.value!.onerror = reject;
            });
        }
        return ws.value;
    }

    const setUsername = async (username = useState<string>('username').value) => {
        const ws = await getWs();
        if (ws.usernameSet || !!!username) return;

        ws.send(`set_username ${username}`);
        ws.usernameSet = true;
    }

    const hostLocal = async () => {
        isLocal.value = true;
        isHost.value = true;
        createRoom();
    }

    const hostOnline = async () => {
        isLocal.value = false;
        isHost.value = true;
        createRoom();
    }

    const joinOnline = async (id: string) => {
        isLocal.value = false;
        isHost.value = false;
        if (!await joinRoom(id)) return;
        useRouter().push(`/room/${id}`)
    }

    const joinLocal = async (id: string) => {
        isLocal.value = true;
        isHost.value = false;
        if (!await joinRoom(id)) return;
        useRouter().push(`/room/${id}`)
    }

    const createRoom = async () => {
        isReady.value = false;
        const ws = await getWs();
        setUsername()

        async function handleRoomMsg(e: MessageEvent) {
            console.log("received from createroom hook : ", e.data);

            if (String(e.data).startsWith('game_created')) {
                const id = String(e.data).split(' ')[1];
                room.value = {
                    id,
                    players: [useState<string>('username').value],
                };
                console.log('room created', room.value);
                ws.removeEventListener('message', handleRoomMsg);
                useRouter().push(`/room/${id}`);
            }
        }

        ws.addEventListener('message', handleRoomMsg);
        ws.send(`new .`)
    }

    const joinRoom = async (id: string): Promise<boolean> => {
        if (!!!id) return false;

        isReady.value = false;
        const ws = await getWs();
        await setUsername();

        async function handleRoomMsg(e: MessageEvent) {
            const msg = String(e.data)
            console.log("received from joinroom hook : ", msg);

            if (msg.startsWith('game_not_found')) {
                alert('game not found');
                useRouter().replace(`/`);
            } else if (msg == ('ERR \"\"cannot join game: game is not in lobby state\"\"')) {
                alert('game is not in lobby state');
                useRouter().replace(`/`);
            }
        }
        ws.addEventListener('message', handleRoomMsg);

        ws.send(`join ${id}`)
        room.value = {
            id,
            players: [],
        }
        setTimeout(() => {
            ws.removeEventListener('message', handleRoomMsg);
            room.value?.players.push(useState<string>('username').value);
        }, 500);
        return true;
    }

    const readyUp = async () => {
        if (!room.value || isReady.value) return;
        const ws = await getWs();
        ws.send(`ready_up .`);
        isReady.value = true;
    }
    
    const unready = async () => {
        if (!room.value || !isReady.value) return;
        const ws = await getWs();
        ws.send(`unready .`);
        isReady.value = false;
    }

    return {
        getWs,
        hostLocal,
        hostOnline,
        createRoom,
        joinRoom,
        joinLocal,
        joinOnline,
        readyUp,
        unready,
        room,
        songsRoute,
        isHost,
        isLocal,
        isReady
    }
})
