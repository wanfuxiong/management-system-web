<template>
    <div style="display: flex;flex-wrap: wrap;margin: -10px">
        <div style="height: 300px;flex: 1;padding: 10px;min-width: 300px;">
            <el-card style="height: 300px;">
                <el-result
                    style="padding: 0;height: 260px"
                    icon="warning"
                    title="有待处理的事项"
                >
                    <template #extra>
                        <el-badge :value="12">
                            <el-button type="primary">去处理</el-button>
                        </el-badge>
                    </template>
                </el-result>
            </el-card>
        </div>
        <div style="height: 300px;flex: 2;padding: 10px;min-width: 300px;">
            <el-card style="height: 300px;">
                <template #header>
                    <div style="display: flex;justify-content: space-between;align-items: center;">
                        <span>正在进行</span>
                        <el-button class="button" type="text" @click="dialogVisible=true">查看详情</el-button>
                    </div>
                </template>
                <div style="height: 183px;">
                    <el-steps :active="2" align-center finish-status="success"
                              style=" position: relative;top: 50%;left: 50%;transform: translate(-50%, -50%);">
                        <el-step title="Step 1" description="已完成"></el-step>
                        <el-step title="Step 2" description="已完成"></el-step>
                        <el-step title="Step 3" description="正在进行"></el-step>
                        <el-step title="Step 4" description="未完成"></el-step>
                    </el-steps>
                </div>
            </el-card>
        </div>
    </div>
    <el-row style="margin-top: 20px">
        <el-col :span="24">
            <el-card shadow="hover">
                <el-calendar>
                    <template #dateCell="{ data }">
                        <p :class="data.isSelected ? 'is-selected' : ''">
                            {{ data.day.split('-').slice(1).join('-') }}
                            {{ data.isSelected ? '✔️' : '' }}
                        </p>
                    </template>
                </el-calendar>
            </el-card>
        </el-col>
    </el-row>
    <el-dialog
        v-model="dialogVisible"
        fullscreen
        :show-close="false"
    >
        <el-page-header content="detail" @back="dialogVisible=false"/>
    </el-dialog>
</template>

<script setup lang="ts">
import {ref} from "vue";

const dialogVisible = ref(false);

</script>

<style scoped>

</style>
