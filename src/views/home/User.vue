<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>用户管理</span>
            </div>
        </template>
        <div class="operation-row">
            <el-input
                placeholder="搜索用户"
                prefix-icon="Search"
                clearable
                v-model="searchInput"
                @input="getUserList"
            >
            </el-input>
            <el-button
                type="primary"
                icon="Plus"
                @click="handleAddUser"
            >
                新增用户
            </el-button>
            <el-button-group>
                <el-button type="primary" icon="Upload" @click="handleUploadUser">导入</el-button>
                <el-button type="primary" icon="Download" @click="handleDownloadUser">导出</el-button>
            </el-button-group>
        </div>
        <el-table
            v-loading="loading"
            :data="tableData"
            stripe
        >
            <el-table-column
                prop="username"
                label="用户名"
                min-width="90"
                fixed
            ></el-table-column>
            <el-table-column
                prop="id"
                label="用户ID"
                min-width="90"
                fixed
            ></el-table-column>
            <el-table-column
                prop="roles"
                label="角色"
                min-width="110"
            >
                <template
                    #default="scope"
                >
                    <template
                        v-if="scope.row.roles.length===0"
                    >
                        <el-tag
                            type="info"
                            disable-transitions
                        >
                            无
                        </el-tag>
                    </template>
                    <template
                        v-else
                    >
                        <el-tag
                            v-for="(role,index) in scope.row.roles"
                            type=""
                            disable-transitions
                        >
                            {{ role.name }}
                        </el-tag>
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                prop="nickname"
                label="昵称"
                min-width="90"
            >
                <template
                    #default="scope"
                >
                    <span v-if="scope.row.nickname!==null">{{ scope.row.nickname }}</span>
                    <span v-else style="color: var(--el-text-color-secondary)">未设置</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="gender"
                label="性别"
                min-width="66"
            >
                <template
                    #default="scope"
                >
                    <span v-if="scope.row.gender===0">女</span>
                    <span v-else-if="scope.row.gender===1">男</span>
                    <span v-else-if="scope.row.gender===2">中立</span>
                    <span v-else-if="scope.row.gender===null" style="color: var(--el-text-color-secondary)">未设置</span>
                    <span v-else style="color: red;">未知</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="phoneNumber"
                label="手机号"
                min-width="118"
            >
                <template
                    #default="scope"
                >
                    <span v-if="scope.row.phoneNumber!==null">{{ scope.row.phoneNumber }}</span>
                    <span v-else style="color: var(--el-text-color-secondary)">未设置</span>
                </template>
            </el-table-column>
            <el-table-column
                label="邮箱"
                min-width="180"
            >
                <template
                    #default="scope"
                >
                    <span v-if="scope.row.email!==null">{{ scope.row.email }}</span>
                    <span v-else style="color: var(--el-text-color-secondary)">未设置</span>
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
                width="260"
                fixed="right"
            >
                <template #default="scope">
                    <el-button
                        size="small"
                        type="text"
                        @click="handleUpdateUser(scope.$index, scope.row)"
                    >
                        修改信息
                    </el-button>
                    <el-button
                        size="small"
                        type="text"
                        @click="handleUpdateUserRole(scope.$index, scope.row)"
                    >
                        分配角色
                    </el-button>
                    <el-button
                        size="small"
                        type="text"
                        @click="handleResetPassword(scope.$index, scope.row)"
                    >
                        重置密码
                    </el-button>
                    <el-button
                        size="small"
                        type="text"
                        @click="handleDeleteUser(scope.$index, scope.row)"
                    >
                        删除用户
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 10px;justify-content: end"
            layout="total, sizes, prev, pager, next, jumper"
            :background="true"
            :page-sizes="[5, 10, 20, 50, 100]"
            :disabled="loading"
            :page-size="pageSize"
            :current-page="currentPage"
            :total="userAmount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </el-card>
    <el-dialog
        v-model="addUserDialogVisible"
        title="新增用户"
        destroy-on-close
        @closed="handleClosed"
    >
        <el-scrollbar>
            <el-form
                ref="addFormRef"
                :rules="rules"
                :model="tempUser">
                <el-form-item label="用户ID：" :label-width="labelWidth" prop="id">
                    <el-input v-model="tempUser.id" placeholder="必填" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名：" :label-width="labelWidth" prop="username">
                    <el-input v-model="tempUser.username" placeholder="必填" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" :label-width="labelWidth">
                    <el-input v-model="tempUser.nickname" placeholder="必填" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" :label-width="labelWidth" prop="phoneNumber">
                    <el-input v-model="tempUser.phoneNumber" placeholder="选填"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" :label-width="labelWidth">
                    <el-input v-model="tempUser.email" placeholder="选填" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别：" :label-width="labelWidth" prop="gender">
                    <el-radio-group v-model="tempUser.gender">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="2">中立</el-radio>
                        <el-radio :label="null">未设置</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
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
    <el-dialog
        v-model="uploadUserDialogVisible"
        title="上传用户"
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
                    @click="handleConfirm"
                    :loading="loading"
                >
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog
        v-model="updateUserDialogVisible"
        title="修改信息"
        destroy-on-close
        @closed="handleClosed"
    >
        <el-scrollbar>
            <el-form
                ref="updateFormRef"
                :rules="rules"
                :model="tempUser">
                <el-form-item label="用户ID：" :label-width="labelWidth" prop="id">
                    <el-input v-model="tempUser.id" placeholder="必填" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名：" :label-width="labelWidth" prop="username">
                    <el-input v-model="tempUser.username" placeholder="必填" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" :label-width="labelWidth">
                    <el-input v-model="tempUser.nickname" placeholder="必填" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" :label-width="labelWidth" prop="phoneNumber">
                    <el-input v-model="tempUser.phoneNumber" placeholder="可选填"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" :label-width="labelWidth">
                    <el-input v-model="tempUser.email" placeholder="可选填" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别：" :label-width="labelWidth" prop="gender">
                    <el-radio-group v-model="tempUser.gender">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="2">中立</el-radio>
                        <el-radio :label="null">未设置</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--<el-form-item label="角色：" :label-width="labelWidth" prop="gender">-->
                <!--    <el-checkbox-group v-model="roleIds">-->
                <!--        <el-checkbox v-for="(role,index) in roles" :key="index" :label="role.id">{{ role.name }}</el-checkbox>-->
                <!--    </el-checkbox-group>-->
                <!--</el-form-item>-->
            </el-form>
            <p
                style="color: red;font-size: var(--el-font-size-extra-small);margin-top: 10px"
            >
                修改用户名需要该用户清空浏览器本地缓存，请谨慎修改
            </p>
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
                    @click="handleConfirm('修改信息', updateFormRef)"
                    :loading="loading"
                >
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog
        v-model="updateUserRoleDialogVisible"
        title="分配角色"
        destroy-on-close
        @closed="handleClosed"
    >
        <el-scrollbar>
            <el-checkbox-group v-model="roleIds">
                <el-checkbox v-for="(role,index) in roles" :key="index" :label="role.id">{{ role.name }}</el-checkbox>
            </el-checkbox-group>
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
    <el-dialog
        v-model="resetPasswordDialogVisible"
        title="重置密码"
        destroy-on-close
        @closed="handleClosed"
    >
        <el-scrollbar>
            确定要重置用户{{ tempUser.username }}的密码吗？
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
                    @click="handleConfirm('重置密码')"
                    :loading="loading"
                >
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog
        v-model="deleteUserDialogVisible"
        title="删除用户"
        destroy-on-close
        @closed="handleClosed"
    >
        <el-scrollbar>
            确定要删除用户{{ tempUser.username }}吗？
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
                    @click="handleConfirm('删除用户')"
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
import axios from "@/http/axios";
import {ElForm, ElMessage} from "element-plus";
import Result from "@/interface/result";
import User from "@/interface/user";
import {millisecond2StringDate} from "@/utils/date-utils";
import {TableColumnCtx} from "element-plus/es/components/table/src/table-column/defaults";
import Role from "@/interface/role";

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

// 搜索输入框的内容
const searchInput = ref('')

// =====================================================================================================================

// 所有table数据
const tableData = reactive<User[]>([]);
const userAmount = ref(0);
// 表格当前页
const currentPage = ref(1)
// 表格当前页容量
const pageSize = ref(10)

// =====================================================================================================================

const addUserDialogVisible = ref(false)
const uploadUserDialogVisible = ref(false)
const updateUserDialogVisible = ref(false)
const updateUserRoleDialogVisible = ref(false)
const resetPasswordDialogVisible = ref(false)
const deleteUserDialogVisible = ref(false)

// =====================================================================================================================

const addFormRef = ref<InstanceType<typeof ElForm>>()
const updateFormRef = ref<InstanceType<typeof ElForm>>()

// =====================================================================================================================

// 当前正在被操作的用户
const tempUser = reactive<User>({
    id: null,
    username: null,
    nickname: null,
    gender: null,
    phoneNumber: null,
    email: null,
    creationDate: null,
    roles: null,
})
// 系统中所有的角色
const roles = reactive([] as Role[])
// 对话框中选中的角色的id
const roleIds = ref([] as number[])

// =====================================================================================================================

const formatter = (row: User, column: TableColumnCtx<User>) => {
    return millisecond2StringDate(row.creationDate)
}

const resetTempUser = () => {
    for (let key in tempUser) {
        tempUser[key] = null
    }
}

const parseUser = (user: User) => {
    tempUser.id = user.id;
    tempUser.username = user.username;
    tempUser.nickname = (user.nickname === '' || typeof (user.nickname) == undefined) ? null : user.nickname
    tempUser.gender = user.gender;
    tempUser.phoneNumber = (user.phoneNumber === '' || typeof (user.phoneNumber) == undefined) ? null : user.phoneNumber
    tempUser.email = (user.email === '' || typeof (user.email) == undefined) ? null : user.email
    // 把创建时间转换成秒没用（象征性地赋值），因为”创建时间“在后端赋值
    // tempUser.creationDate = Math.floor(new Date(user.creationDate).getTime() / 1000);
    tempUser.creationDate = user.creationDate;
    // 角色也没用（象征性地赋值）
    tempUser.roles = user.roles;
}

const cancel = () => {
    addUserDialogVisible.value = false
    uploadUserDialogVisible.value = false
    updateUserDialogVisible.value = false
    updateUserRoleDialogVisible.value = false
    resetPasswordDialogVisible.value = false
    deleteUserDialogVisible.value = false

    loading.value = false
}

// =====================================================================================================================

const getUserList = () => {
    loading.value = true;
    axios.get(
        '/web/user/list',
        {
            params: {
                current_page: currentPage.value,
                page_size: pageSize.value,
                search_value: searchInput.value
            }
        }
    )
        .then(response => {
            let result = <Result>response.data;
            if (result.code == 0) {
                let userList = <User[]>result.data['userList'];
                userAmount.value = result.data['userAmount'];
                tableData.length = 0;
                for (let i = 0; i < userList.length; i++) {
                    tableData.push(userList[i])
                }
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
            loading.value = false;
        })
}

const getRoleList = () => {
    axios.get('/web/role/list')
        .then(response => {
            let result = response.data as Result;
            if (result.code === 0) {
                let roleList: Role[] = result.data['roleList'];
                for (let i = 0; i < roleList.length; i++) {
                    roles.push(roleList[i])
                }
            } else {
                ElMessage({
                    showClose: true,
                    message: result.msg,
                    type: 'warning'
                })
            }
        })
}

const addUser = () => {
    loading.value = true;
    axios.post('/web/user/add', tempUser)
        .then(response => {
            let result = <Result>response.data
            if (result.code === 0) {
                ElMessage({
                    showClose: true,
                    message: result.msg,
                    type: 'success'
                })
                tableData.length = 0;
                getUserList();
            } else {
                ElMessage({
                    showClose: true,
                    message: result.msg,
                    type: 'warning'
                })
            }
            // cancel();
        })
        .catch(error => {
            // cancel();
        })
}

const updateUser = () => {
    axios.post('/web/user/update', tempUser)
        .then(response => {
            let result = <Result>response.data
            if (result.code === 0) {
                ElMessage({
                    showClose: true,
                    message: result.msg,
                    type: 'success'
                })
                tableData.length = 0;
                getUserList();
            } else {
                ElMessage({
                    showClose: true,
                    message: result.msg,
                    type: 'warning'
                })
            }
            cancel();
        })
        .catch(error => {
            cancel();
        })
}

const updateUserRole = () => {

}

const resetPassword = () => {
    loading.value = true;
    axios.post('/web/user/password/reset', tempUser.id)
        .then(response => {
            let result = <Result>response.data
            let code = result.code;
            if (code === 0) {
                ElMessage({
                    showClose: true,
                    message: result.msg,
                    type: 'success'
                })
                tableData.length = 0;
                getUserList();
            } else {
                ElMessage({
                    showClose: true,
                    message: result.msg,
                    type: 'warning'
                })
            }
            cancel();
        })
        .catch(error => {
            cancel();
        })
}

const deleteUsers = (userIds: number[]) => {
    loading.value = true;
    axios.post('/web/user/delete', userIds)
        .then(response => {
            let result = <Result>response.data
            let code = result.code;
            if (code === 0) {
                ElMessage({
                    showClose: true,
                    message: result.msg,
                    type: 'success'
                })
                tableData.length = 0;
                getUserList();
            } else {
                ElMessage({
                    showClose: true,
                    message: result.msg,
                    type: 'warning'
                })
            }
            cancel();
        })
        .catch(error => {
            cancel();
        })
}

// =====================================================================================================================

// 最上方的新增用户按钮
const handleAddUser = () => {
    addUserDialogVisible.value = true
}
// 最上方的上传按钮
const handleUploadUser = () => {
    uploadUserDialogVisible.value = true
}
// 最上方的下载按钮
const handleDownloadUser = () => {
}

// =====================================================================================================================

// 表格的修改信息按钮
const handleUpdateUser = (index: number, user: User) => {
    updateUserDialogVisible.value = true
    parseUser(user)
    roleIds.value.length = 0;
    let roles = tempUser.roles;
    roles.forEach((r: Role) => {
        roleIds.value.push(r.id)
    })
}

// 表格的分配角色按钮
const handleUpdateUserRole = (index: number, user: User) => {
    updateUserRoleDialogVisible.value = true
    parseUser(user)
    roleIds.value.length = 0;
    let roles = tempUser.roles;
    roles.forEach((r: Role) => {
        roleIds.value.push(r.id)
    })
}
// 表格的重置密码按钮
const handleResetPassword = (index: number, user: User) => {
    resetPasswordDialogVisible.value = true
    parseUser(user)
}
// 表格的删除用户按钮
const handleDeleteUser = (index: number, user: User) => {
    deleteUserDialogVisible.value = true
    parseUser(user)
}

// =====================================================================================================================

// 对话框的取消按钮
const handleCancel = () => {
    cancel()
    resetTempUser()
}
// 对话框的确定按钮
const handleConfirm = (mode: string, formEl?: InstanceType<typeof ElForm> | undefined) => {
    switch (mode) {
        case '新增用户':
            parseUser(tempUser)
            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    addUser()
                } else {
                    return false;
                }
            });
            break
        case '上传用户':
            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    // updateUser()
                } else {
                    return false;
                }
            });
            break
        case '修改信息':
            parseUser(tempUser)
            updateUser()
            break
        case '分配角色':
            break
        case '重置密码':
            resetPassword()
            break
        case '删除用户':
            deleteUsers([tempUser.id])
            break
        default:
            ElMessage({
                showClose: true,
                message: '接收表单参数时发生意外错误',
                type: 'error'
            })
    }
}
// 对话框的closed
const handleClosed = () => {
    resetTempUser()
    roleIds.value.length = 0
}

// =====================================================================================================================

// 下面的方式适用于一次接受所有数据的情况
// 切换每页显示数量后回调
const handleSizeChange = (val) => {
    // console.log(`每页 ${val} 条`);
    pageSize.value = val;
    currentPage.value = 1;
    getUserList()
}
// 点击上、下一页或输入页码后回调
const handleCurrentChange = (val) => {
    // console.log(`当前页: ${val}`);
    currentPage.value = val;
    getUserList()
}

// =====================================================================================================================

onMounted(() => {
    getUserList()
    getRoleList()
})
</script>

<style scoped>

</style>
