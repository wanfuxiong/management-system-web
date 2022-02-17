<template>
    <el-container>
        <el-main>
            <el-row style="height: 600px;flex-direction: column;justify-content: center;align-items: center">
                <Logo style="height: 200px"/>
                <p class="base-text" style="line-height: 24px;margin-top: 32px;">
                    Management System是一个用于管理数据的模板程序
                </p>
                <div style="margin: 32px 0;display: flex">
                    <el-button @click="handleLearnMore">了解更多</el-button>
                    <el-button @click="handleIn" type="primary" :loading="loading">进入系统</el-button>
                </div>
            </el-row>
            <el-row style="height: 600px;background-color: #F6F6F6;justify-content: center;align-items: center">
                <Index1 style="width: 80%;min-width: 300px;max-height: 300px"/>
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {ComponentInternalInstance, getCurrentInstance, reactive, ref} from "vue";
import Logo from '@/components/Logo.vue';
import Index1 from '@/components/Index1.vue';

const {proxy} = <ComponentInternalInstance>getCurrentInstance()

const loading = ref(false);

const handleLearnMore = () => {
    proxy?.$router.push({path: '/about'});
}

const handleIn = () => {
    loading.value = true;
    proxy?.$router.push({path: '/login'});
}

</script>

<style scoped>

</style>
