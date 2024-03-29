import type { SearchItem } from "~/pages/room/[id]/select.vue";
import { swapRemove } from "./util";

export type Room = {
    id: string;
    players: Player[];
    leaderboard?: [string, string][];
    showLeaderboard?: boolean;
    ownsongs: string[][];
    downloadQueue: string[];
}
const defaultRoom: () => Room = () => ({
    id: '',
    players: [],
    ownsongs: [],
    downloadQueue: [],
})

export type Player = {
    username: string;
    score: number;
    isReady?: boolean;
}

const newPlayer = (username: string, isReady = undefined as boolean | undefined): Player => ({
    username,
    score: 0,
    isReady: isReady,
});

export const restoreRoom = () => {
    if (!!!useConnectionHandler().room && typeof useRoute().params.id === 'string') {
        setTimeout(() => {
            useConnectionHandler().joinRoom(useRoute().params.id as string)
        }, 1000)
    }
}

export const useConnectionHandler = defineStore('connectionHandler', () => {
    const ws = ref(null as WebSocket & { usernameSet?: boolean } | null);
    const room = ref(null as Room | null);
    const songsRoute = ref('/songs');
    const isHost = ref(false);
    const isLocal = ref(false);
    const isReady = ref(false);
    const startingIn = ref(-1);
    const guessOptions = ref([] as string[][]);
    // const guessOptions = ref([['Armed and Dangerous', 'Juice WRLD'], ['Scandinavian Boy', 'JOOST'], ['Drop', 'Connor Price']]);

    useRouter().beforeEach(() => {
        startingIn.value = -1;
    })

    const handleGeneralMsg = (e: MessageEvent) => {
        console.log('[SERVER >] ', e.data);

        const msg = String(e.data)
        const firstSpace = msg.indexOf(' ');
        let split = [msg, ''];
        if (firstSpace !== -1) {
            split = [msg.substring(0, firstSpace), msg.substring(firstSpace + 1)]
        }
        const croppedQuotationMarks = split[1].substring(1, split[1].length - 1)
        switch (split[0]) {
            case 'song_route':
                songsRoute.value = split[1];
                break;
            case 'user_join':
                if (room.value && isHost && isLocal && !isReady) readyUp();
                room.value!.players.push(newPlayer(croppedQuotationMarks,));
                break;
            case 'user_leave':
                if (!room.value) return;
                const idx = room.value.players.findIndex(p => p.username === croppedQuotationMarks);
                room.value!.players.splice(idx, 1);
                if (room.value && room.value.players[0] && room.value.players[0].username === useState<string>('username').value) {
                    isHost.value = true;
                }
                break;
            case 'user_ready':
                room.value!.players.find(p => p.username === croppedQuotationMarks)!.isReady = true;
                break;
            case 'user_unready':
                room.value!.players.find(p => p.username === croppedQuotationMarks)!.isReady = false;
                startingIn.value = -1
                break;
            case 'game_start_at':
                const startingAt = parseInt(split[1]);
                startingIn.value = startingAt - Date.now();
                break;
            case 'game_start_select':
                useRouter().push(`/room/${room.value!.id}/select`);
                break;
            case 'added_song':
                if (!room.value) return;
                const song = JSON.parse(split[1]) as string[];
                song.push(Math.floor(Math.random() * 1000).toString())
                room.value.downloadQueue.splice(room.value.downloadQueue.indexOf(song[0]), 1);
                room.value.ownsongs.push(song);
                break;
            case 'removed_song':
                const idx2 = parseInt(split[1]);
                swapRemove(room.value!.ownsongs, idx2);
                break;
            case 'game_start_guessing':
                useRouter().push(`/room/${room.value!.id}/guess`);
                break;
            case 'game_guess_options':
                room.value!.showLeaderboard = false;
                guessOptions.value = JSON.parse(split[1]) as string[][];
                break;
            case 'game_play_audio':
                const serverBase = useState<string>('serverBase').value;
                if (process.dev && (serverBase.startsWith("localhost:" || serverBase.startsWith("127.0.0.1")))) {
                    useMusicPlayer().play(`http://${serverBase}${songsRoute.value}/${split[1]}`);
                } else {
                    useMusicPlayer().play(`https://${serverBase}${songsRoute.value}/${split[1]}`);
                }
                break;
            case 'leaderboard':
                room.value!.showLeaderboard = true;
                room.value!.leaderboard = JSON.parse(split[1]) as [string, string][];
                setTimeout(() => {
                    if (!room.value) return;
                    room.value!.leaderboard!.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
                }, 500);
                break;
            case 'game_ended':
                room.value!.showLeaderboard = true;
                setTimeout(() => {
                    isReady.value = false;
                    room.value?.players.forEach(p => p.isReady = false)
                    useMusicPlayer().pause();
                    useRouter().push(`/room/${room.value!.id}`);

                    if (!room.value) return;
                    room.value.ownsongs = [];
                    room.value.downloadQueue = [];
                }, 2000);

        }
    }

    const getWs = async () => {
        if (!process.client) return;
        if (!ws.value) {
            const serverBase = useState<string>('serverBase').value;
            if (!serverBase) return;

            if (process.dev && (serverBase.startsWith("localhost:" || serverBase.startsWith("127.0.0.1")))) {
                ws.value = new WebSocket(`ws://${serverBase}/ws`);
            } else {
                ws.value = new WebSocket(`wss://${serverBase}/ws`);
            }
            ws.value.onmessage = handleGeneralMsg;

            // await connction open
            await new Promise<void>((resolve, reject) => {
                ws.value!.onopen = () => {
                    console.log('CONNECTION WITH API ESTABLISHED');
                    resolve()
                };
                ws.value!.onerror = reject;
            });
        }
        return ws.value;
    }

    const setUsername = async (username = useState<string>('username').value) => {
        const ws = await getWs();
        if (!ws) return;
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
        unready()
        const ws = await getWs();
        if (!ws) return;
        setUsername()

        async function handleRoomMsg(e: MessageEvent) {
            if (String(e.data).startsWith('game_created')) {
                const id = String(e.data).split(' ')[1];
                room.value = {
                    ...defaultRoom(),
                    id,
                    players: [newPlayer(useState<string>('username').value, false)],
                };
                ws!.removeEventListener('message', handleRoomMsg);
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
        if (!ws) return false;
        await setUsername();

        async function handleRoomMsg(e: MessageEvent) {
            const msg = String(e.data)
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
            ...defaultRoom(),
            id,
        }
        setTimeout(() => {
            ws.removeEventListener('message', handleRoomMsg);
            room.value?.players.push(newPlayer(useState<string>('username').value));
        }, 500);
        return true;
    }

    const leaveRoom = async () => {
        if (!room.value) return;
        const ws = await getWs();
        if (!ws) return;
        ws.send(`leave .`);
        room.value = null;
        isHost.value = false;
        isReady.value = false;
        startingIn.value = -1;
        useMusicPlayer().pause();
        useRouter().replace(`/`);
    }

    const readyUp = async () => {
        if (!room.value || isReady.value) return;
        const ws = await getWs();
        if (!ws) return;
        ws.send(`ready_up .`);
        isReady.value = true;
    }

    const unready = async () => {
        if (!room.value || !isReady.value) return;
        const ws = await getWs();
        if (!ws) return;
        ws.send(`unready .`);
        isReady.value = false;
    }

    const addSong = async (song: SearchItem) => {
        if (!room.value) return;
        const ws = await getWs();
        if (!ws) return;
        ws.send(`add ${song.id}`);
        room.value.downloadQueue.push(song.name);
        setTimeout(() => {
            room.value?.downloadQueue.splice(room.value!.downloadQueue.indexOf(song.name), 1);
        }, 20000);
    }

    const removeSong = async (currendSongIdx: number) => {
        if (!room.value) return;
        const ws = await getWs();
        if (!ws) return;
        ws.send(`remove ${currendSongIdx}`);
    }

    const startGuessing = async () => {
        if (!room.value) return;
        const ws = await getWs()
        if (!ws) return;
        ws.send('start_guessing .')
    }

    const sendGuess = async (guess: number) => {
        if (!room.value) return;
        const ws = await getWs()
        if (!ws) return;
        ws.send(`guess ${guess}`)
        guessOptions.value = [];
    }

    return {
        getWs,
        hostLocal,
        hostOnline,
        createRoom,
        joinRoom,
        leaveRoom,
        joinLocal,
        joinOnline,
        readyUp,
        unready,
        room,
        songsRoute,
        isHost,
        startingIn,
        isLocal,
        isReady,
        addSong,
        removeSong,
        startGuessing,
        guessOptions,
        sendGuess
    }
})

