<template>
    <div class="operation-row">
        <el-button
            type="primary"
            icon="Plus"
            @click="handleAddMenu"
        >
            新增菜单
        </el-button>
    </div>
    <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
    >
        <el-table-column prop="title" label="菜单标题" min-width="180" fixed/>
        <el-table-column prop="id" label="菜单ID" min-width="70"/>
        <el-table-column prop="code" label="操作码" min-width="180"/>
        <el-table-column prop="path" label="路径" min-width="180"/>
        <el-table-column prop="icon" label="图标" min-width="60">
            <template #default="scope">
                <el-icon>
                    <component :is="scope.row.icon"/>
                </el-icon>
            </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" min-width="60"/>
        <el-table-column prop="type" label="种类" min-width="92">
            <template
                #default="scope"
            >
                <el-tag
                    :type="tagType(scope.row.type)"
                >
                    {{ tagContent(scope.row.type) }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column
            prop="creationDate"
            label="创建日期"
            min-width="166"
            :formatter="formatter"
        ></el-table-column>
        <el-table-column
            label="操作"
            width="136"
            fixed="right"
        >
            <template #default="scope">
                <el-button
                    size="small"
                    type="text"
                    @click="handleUpdate(scope.$index, scope.row)"
                >
                    修改菜单
                </el-button>
                <el-button
                    size="small"
                    type="text"
                    @click="handleDelete(scope.$index, scope.row)"
                >
                    删除菜单
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog
        v-model="addMenuDialogVisible"
        title="新增菜单"
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
import {computed, onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus/es";
import axios from "@/http/axios";
import Result from "@/interface/result";
import Menu from "@/interface/menu";
import {millisecond2StringDate} from "@/utils/date-utils";
import User from "@/interface/user";
import {TableColumnCtx} from "element-plus/es/components/table/src/table-column/defaults";
import {ElForm} from "element-plus";

// =====================================================================================================================

const labelWidth = '80px'
const rules = {
    id: [
        {
            message: '请输入用户ID',
            required: true,
            trigger: 'blur'
        },
        {
            message: '用户ID只能是非0开头的数字',
            pattern: '^[1-9]\\d*$',
            trigger: 'blur'
        }
    ],
    username: [
        {
            message: '请输入用户名',
            required: true,
            trigger: 'blur'
        },
        {
            message: '用户名只能以英文字母开头',
            pattern: '^[a-zA-Z].*',
            trigger: 'blur'
        }
    ],
    phoneNumber: [
        {
            message: '手机号只允许是11位数字',
            pattern: '(^$)|(^[0-9]{11}$)',// 空或11位数字
            trigger: 'blur'
        }
    ]
}

// =====================================================================================================================

// 加载中遮罩显示与否
const loading = ref(false)

// =====================================================================================================================

// 所有table数据
const tableData: Menu[] = reactive([]);

// =====================================================================================================================

const addMenuDialogVisible = ref(false)
const updateMenuDialogVisible = ref(false)
const deleteMenuDialogVisible = ref(false)

// =====================================================================================================================

const addFormRef = ref<InstanceType<typeof ElForm>>()
const updateFormRef = ref<InstanceType<typeof ElForm>>()

// =====================================================================================================================

// 当前正在被操作的菜单
const tempMenu = reactive<Menu>({
    id: null,
    parentId: null,
    name: null,
    title: null,
    path: null,
    icon: null,
    order: null,
    type: null,
    code: null,
    creationDate: null,
    children: null,
})

// =====================================================================================================================

const tagType = (type: number) => {
    switch (type) {
        case 0:
        case 1:
            return ''
        case 2:
            return 'success'
        default:
            return 'danger'
    }
}
const tagContent = (type: number) => {
    switch (type) {
        case 0:
            return '一级菜单'
        case 1:
            return '二级菜单'
        case 2:
            return '基本操作'
        default:
            return '未知'
    }
}

const formatter = (row: User, column: TableColumnCtx<User>) => {
    return millisecond2StringDate(row.creationDate)
}

const resetTempMenu = () => {
    for (let key in tempMenu) {
        tempMenu[key] = null
    }
}

const cancel = () => {
    addMenuDialogVisible.value = false
    updateMenuDialogVisible.value = false
    deleteMenuDialogVisible.value = false

    loading.value = false
}

// =====================================================================================================================

const getMenuList = () => {
    loading.value = true;
    axios.get('/web/menu/list')
        .then(response => {
            let result = <Result>response.data;
            if (result.code === 0) {
                let menuList: Menu[] = result.data['menuList'];
                tableData.length = 0;
                menuList.forEach(menu => {
                    menuList.forEach(m => {
                        // 如果不是一级菜单
                        if (m.parentId != null && menu.id == m.parentId) {
                            menu.children.push(m)
                        }
                    })
                    if (menu.parentId == null) {
                        tableData.push(menu);
                    }
                })
                console.log(tableData)
            } else {
                ElMessage({
                    showClose: true,
                    message: result.msg,
                    type: 'warning'
                })
            }
            loading.value = false;
        })
        .catch(error => {
            ElMessage({
                showClose: true,
                message: error,
                type: 'error'
            })
            loading.value = false;
        })
}

// =====================================================================================================================

const handleAddMenu = () => {
    addMenuDialogVisible.value = true
}

// =====================================================================================================================

// 对话框的closed
const handleClosed = () => {
    resetTempMenu()
}

// =====================================================================================================================

onMounted(() => {
    getMenuList()
})
</script>

<style>

</style>
