<template>
    <ul style="background: #8cc5ff">
        <li v-for="(v, k) in 100" :key="k">{{ v }}</li>
    </ul>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

const props = defineProps<{
    data?: any
}>()

const emit = defineEmits(['update-status'])

const handleConfirm = () => {
    console.log('开始')
    emit('update-status')
    setTimeout(() => {
        emit('update-status')
    }, 2000)
}

onMounted(()=>{
    console.log(props.data)
})

defineExpose({
    handleConfirm
})
</script>

<style scoped>

</style>
