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
  watch(username, (value) => {
    localStorage.setItem('username', value)
  })
  watch(serverBase, (value) => {
    localStorage.setItem('serverBase', value)
  })
})
</script>

<template>
  <Header />
  <div class="p-4 w-full h-[calc(100vh-)]">
    <NuxtPage />
  </div>
</template>