<template>
    <el-dialog
        v-model="modelValue"
        :title="title"
        width="20%"
        @open="handleOpen"
        @opened="handleOpened"
        @close="handleClose"
        @closed="handleClosed"
        destroy-on-close
    >
        <el-scrollbar id="dialog-scrollbar">
            <div
                id="dialog-component-container"
            >
                <component
                    ref="componentRef"
                    :is="component"
                    :data="data"
                    @update-status="updateStatus"
                />
            </div>
        </el-scrollbar>
        <template #footer>
            <div class="dialog-footer" style="display: flex;justify-content: end">
                <el-button
                    @click="handleCancel"
                >
                    取消
                </el-button>
                <el-button
                    type="primary"
                    @click="handleConfirm"
                    :loading="loading"
                >
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {
    ComponentInternalInstance,
    getCurrentInstance,
    onBeforeMount,
    onBeforeUpdate,
    onMounted,
    onUpdated,
    ref
} from "vue";
import {ElMessage} from "element-plus";

const props = defineProps<{
    modelValue: boolean
    title?: string
    component?: string
    data?: any
}>()

const emit = defineEmits(['update:modelValue', 'update-status', 'open', 'opened', 'close', 'closed'])

const loading = ref(false)

const componentRef = ref()

// 子组件emit调用这个方法
const updateStatus = (flag?: boolean) => {
    console.log('Dialog', 'updateStatus', flag)
    loading.value = !loading.value
    if (flag) {
        console.log('Dialog', 'updateStatus', '进来了')
        emit('update-status')
    }
}

// 点击dialog的取消按钮
const handleCancel = () => {
    emit('update:modelValue', false)
}

// 点击dialog的确定按钮
const handleConfirm = () => {
    // 调用子组件的handleConfirm方法
    componentRef.value.handleConfirm()
}

const handleOpen = () => {

}

const handleOpened = () => {

}

const handleClose = () => {

}

const handleClosed = () => {
    emit('update:modelValue', false)
}

onBeforeMount(() => {
    console.log('Dialog', 'onBeforeMount')
})

onMounted(() => {
    console.log('Dialog', 'onMounted')
})

onBeforeUpdate(() => {
    console.log('Dialog', 'onBeforeUpdate')

})
</script>

<style>
#dialog-component-container {
    padding: 0 20px;
}
</style>
