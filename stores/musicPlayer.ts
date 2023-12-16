export const useMusicPlayer = defineStore('musicPlayer', () => {
    const audioPlayer = ref(null as HTMLAudioElement | null);
    const volume = ref(0.5);

    const initPlayer = () => {
        if (audioPlayer.value) return;

        audioPlayer.value = new Audio();
        audioPlayer.value.volume = volume.value;
        watch(volume, () => {
            audioPlayer.value!.volume = volume.value;
        })
    }

    const play = (url: string) => {
        initPlayer();
        audioPlayer.value!.pause();
        audioPlayer.value!.src = url;
        audioPlayer.value!.play();
    }

    const pause = () => {
        audioPlayer.value!.pause();
    }

    return {
        volume,
        play,
        pause
    }
})