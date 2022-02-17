<template>
    <div>确定要删除吗？</div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

const props = defineProps<{
    data?: any
}>()

const emit = defineEmits(['update-status'])

const deleteUsers = (userIds: number[]) => {

}

const handleConfirm = () => {
    emit('update-status', true)
}

onMounted(()=>{
    console.log(props.data)
})

defineExpose({
    handleConfirm
})
</script>

<style>

</style>