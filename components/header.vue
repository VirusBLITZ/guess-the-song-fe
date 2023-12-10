<script setup lang="ts">
const serverBase = useState('serverBase')
</script>

<template>
    <div class="flex justify-between p-3 h-20">
        <div>
            <h1>Guess The Song 🎶</h1>
            server <input type="text" v-model="serverBase">
        </div>
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
        </nav>
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