<script setup>
import './base.css';
onMounted(() => {
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
    return localStorage.getItem('volume') ?? '0.5'
  })
  watch(username, (value) => {
    localStorage.setItem('username', value)
  })
  watch(serverBase, (value) => {
    localStorage.setItem('serverBase', value)
  })
  watch(volume, (value) => {
    useConnectionHandler().volume = Number(value) / 100
    localStorage.setItem('volume', value)
  })
})
</script>

<template>
  <Header />
  <div class="p-4 w-full h-[calc(100vh-)]">
    <NuxtPage />
  </div>
</template>