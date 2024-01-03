<script setup>
import './base.css';

const initState = () => {
  if (!process.client) {
    return
  }

  const serverBase = useState('serverBase', () => {
    return localStorage.getItem('serverBase') ?? 'gts.bltz.cloud'
  })
  const username = useState('username', () => {
    return localStorage.getItem('username') ?? ''
  })
  const volume = useState('volume', () => {
    const vol = localStorage.getItem('volume') ?? '0.5'
    useMusicPlayer().volume = Number(vol) / 100
    return vol
  })
  watch(username, (value) => {
    localStorage.setItem('username', value)
  })
  watch(serverBase, (value) => {
    localStorage.setItem('serverBase', value)
  })
  watch(volume, (value) => {
    useMusicPlayer().volume = Number(value) / 100
    localStorage.setItem('volume', value)
  })
}

initState()
</script>

<template>
  <Header />
  <div class="p-4 w-full h-[calc(100vh-5rem)] overflow-y-scroll">
    <NuxtPage />
  </div>
</template>