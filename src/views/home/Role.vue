<template>
    <div class="operation-row">
        <el-input
            placeholder="搜索角色"
            prefix-icon="Search"
            clearable
            v-model="searchInput"
        >
        </el-input>
        <el-button
            type="primary"
            icon="Plus"
            @click="handleAddRole"
        >
            新增角色
        </el-button>
    </div>
    <el-table
        v-loading="loading"
        :data="tableData"
    >
        <el-table-column
            prop="name"
            label="角色名称"
            min-width="104"
            fixed
        ></el-table-column>
        <el-table-column
            prop="id"
            label="角色ID"
            min-width="80"
        ></el-table-column>
        <el-table-column
            prop="code"
            label="角色代码"
            min-width="120"
        ></el-table-column>
        <el-table-column
            prop="description"
            label="描述"
            min-width="320"
        ></el-table-column>
        <el-table-column
            prop="creationDate"
            label="创建日期"
            min-width="166"
            :formatter="formatter"
        ></el-table-column>
        <el-table-column
            label="操作"
            width="198"
            fixed="right">
            <template #default="scope">
                <el-button
                    size="small"
                    type="text"
                    @click="handleUpdate(scope.$index, scope.row)"
                >
                    修改角色
                </el-button>
                <el-button
                    size="small"
                    type="text"
                    @click="handleMenu(scope.$index, scope.row)"
                >
                    分配菜单
                </el-button>
                <el-button
                    size="small"
                    type="text"
                    @click="handleDelete(scope.$index, scope.row)"
                >
                    删除角色
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog
        v-model="addRoleDialogVisible"
        title="新增角色"
        destroy-on-close
        @closed="handleClosed"
    >
        <el-scrollbar>
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
                    @click="handleConfirm('新增用户', addFormRef)"
                    :loading="loading"
                >
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus/es";
import axios from "@/http/axios";
import Result from "@/interface/result";
import Role from "@/interface/role";
import {millisecond2StringDate} from "@/utils/date-utils";
import User from "@/interface/user";
import {TableColumnCtx} from "element-plus/es/components/table/src/table-column/defaults";
import {ElForm} from "element-plus";

// =====================================================================================================================

// 加载中遮罩显示与否
const loading = ref(false)

// =====================================================================================================================

// 搜索输入框的内容
const searchInput = ref('')

// =====================================================================================================================

// 所有table数据
const tableData: Role[] = reactive([]);

// =====================================================================================================================

const addRoleDialogVisible = ref(false)

// =====================================================================================================================

const addFormRef = ref<InstanceType<typeof ElForm>>()
const updateFormRef = ref<InstanceType<typeof ElForm>>()

// =====================================================================================================================

const formatter = (row: User, column: TableColumnCtx<User>) => {
    return millisecond2StringDate(row.creationDate)
}

// =====================================================================================================================

const getRoleList = () => {
    loading.value = true;
    axios.get('/web/role/list').then(response => {
        let result = <Result>response.data;
        if (result.code === 0) {
            let roleList: Role[] = result.data['roleList'];
            console.log(roleList)
            for (let i = 0; i < roleList.length; i++) {
                tableData.push(roleList[i])
            }
        } else {
            ElMessage({
                showClose: true,
                message: result.msg,
                type: 'warning'
            })
        }
        loading.value = false;
    }).catch(error => {
        loading.value = false;
    })
}

// =====================================================================================================================

const handleAddRole = () => {
    addRoleDialogVisible.value = true
}

// =====================================================================================================================

const handleClosed = () => {
}

// =====================================================================================================================

onMounted(() => {
    getRoleList()
})
</script>

<style>

</style>
