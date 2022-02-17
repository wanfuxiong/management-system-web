<template>
    <el-container style="height: 100vh">
        <el-header class="base-header">
            <el-row justify="space-between">
                <el-col :span="12">
                    <IndexLink/>
                </el-col>
                <el-col :span="12">
                    <el-menu
                        :default-active="defaultActiveIndex"
                        :router="true"
                        mode="horizontal"
                        style="justify-content: flex-end"
                    >
                        <el-sub-menu index="">
                            <template #title>开始使用</template>
                            <el-menu-item index="/login">网页端</el-menu-item>
                            <el-menu-item index="/app">移动端（Android）</el-menu-item>
                        </el-sub-menu>
                        <!--<el-menu-item index="/doc">文档</el-menu-item>-->
                        <el-menu-item index="/about">关于</el-menu-item>
                        <el-menu-item index="/donate">捐助</el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-scrollbar>
                <router-view/>
                <Footer/>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {ComponentInternalInstance, getCurrentInstance, onUpdated, ref} from 'vue';
import IndexLink from "@/components/IndexLink.vue";
import Footer from '@/components/Footer.vue';

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const defaultActiveIndex = ref(proxy?.$route.path);

onUpdated(() => {
    defaultActiveIndex.value = proxy?.$route.path;
})
</script>

<style scoped>

</style>
