<script setup lang="ts">
defineProps<{
    title: string
    secondary?: boolean
}>();
</script>

<template>
    <div class="card relative" :class="secondary ? 'secondary' : ''">
        <h3>{{ title }}</h3>
        <div class="card-body">
            <slot></slot>
        </div>
        <div class="absolute w-full bottom-2 right-2 card-footer flex justify-end">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<style scoped>
.card {
    min-width: 200px;
    min-height: 175px;
    border: 2px solid var(--app-c-primary);
    border-radius: .3rem;
    margin: 0.5rem;
    padding: 0.5rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
    transition: box-shadow 0.3s ease-in-out;
}

.card:hover {
    box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
}

.card.secondary {
    border: 2px solid var(--app-c-secondary);
}
</style>