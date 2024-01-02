<script setup lang="ts">
const props = defineProps<{
    number: Ref<number>;
}>();

const displayNumber = ref(0)
const interval = ref(null as null | number)

const ready = () => {
    displayNumber.value = props.number.value ? props.number.value : 0;
}

watch(props.number, () => {
    clearInterval(interval.value || -1);

    if (props.number.value == displayNumber.value) {
        return;
    }

    interval.value = window.setInterval(function () {

        if (displayNumber.value != props.number.value) {

            var change = (props.number.value - displayNumber.value) / 10;

            change = change >= 0 ? Math.ceil(change) : Math.floor(change);

            displayNumber.value = displayNumber.value + change;

        }

    }.bind(this), 20);

})
</script>

<template>
    {{ displayNumber }}
</template>