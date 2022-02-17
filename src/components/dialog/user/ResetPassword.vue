<template>
    <div>确定要重置{{ data.username }}的密码吗？</div>
</template>

<script setup lang="ts">
import axios from "@/axios";
import {ElMessage} from "element-plus";
import Result from "@/interface/result";

const props = defineProps<{
    data?: any
}>()

const emit = defineEmits(['update-status'])

const resetPassword = (userId: number) => {
    setTimeout(() => {
        console.log(userId)
        emit('update-status', true)
    }, 2000)
    // axios.post('/web/user/password/reset', userId)
    //     .then(response => {
    //         let result = <Result>response.data;
    //         let code = result.code;
    //         if (code === 0) {
    //             ElMessage({
    //                 showClose: true,
    //                 message: result.msg,
    //                 type: 'success'
    //             })
    //         } else {
    //             ElMessage({
    //                 showClose: true,
    //                 message: result.msg,
    //                 type: 'warning'
    //             })
    //         }
    //         emit('update-status')
    //     })
    //     .catch(error => {
    //         emit('update-status')
    //     })
}
const handleConfirm = () => {
    emit('update-status')
    resetPassword(props.data.id)
}

defineExpose({
    handleConfirm
})
</script>

<style>

</style>