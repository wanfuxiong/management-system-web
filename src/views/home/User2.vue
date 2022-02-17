<template>
    <el-row style="margin-bottom: 20px">
        <el-col :span="24">
            <el-input
                placeholder="搜索用户"
                prefix-icon="Search"
                clearable
                v-model="searchInput"
                style="display: inline-block;width: 200px;margin-right: 10px;vertical-align: middle;"
                @input="getUserList"
            >
            </el-input>
            <el-button type="primary" icon="Plus"
                       style="margin-right: 10px;vertical-align: middle;"
                       @click="handleAdd">新增用户
            </el-button>
            <el-button-group style="margin-right: 10px;vertical-align: middle;">
                <el-button type="primary" icon="Upload" @click="handleUpload">导入</el-button>
                <el-button type="primary" icon="Download" @click="handleDownload" :loading="loading">导出</el-button>
            </el-button-group>
            <el-button type="danger" icon="Delete" @click="deleteUsers(deleteSelectionIds)"
                       style="vertical-align: middle;">
                批量删除
            </el-button>
        </el-col>
    </el-row>
    <el-table
        v-loading="loading"
        type="selection"
        :data="tableData"
        stripe style="width: 100%;"
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="38" fixed></el-table-column>
        <el-table-column
            prop="id"
            label="用户ID"
            min-width="90"
            fixed
        ></el-table-column>
        <el-table-column
            prop="username"
            label="用户名"
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
            label="创建日期"
            min-width="166"
        >
            <template
                #default="scope"
            >
                {{ fDate(scope.row.creationDate) }}
            </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--    label="状态"-->
        <!--    min-width="90"-->
        <!--&gt;-->
        <!--    <template-->
        <!--        #default="scope"-->
        <!--    >-->
        <!--        <el-tag-->
        <!--            size="small"-->
        <!--            type="success"-->
        <!--            disable-transitions-->
        <!--        >-->
        <!--            正常-->
        <!--        </el-tag>-->
        <!--    </template>-->
        <!--</el-table-column>-->
        <el-table-column
            label="操作"
            width="260"
            fixed="right"
        >
            <template #default="scope">
                <el-button
                    size="small"
                    type="text"
                    @click="handleUpdate(scope.$index, scope.row)"
                >
                    修改信息
                </el-button>
                <el-button
                    size="small"
                    type="text"
                    @click="handleRole(scope.$index, scope.row)"
                >
                    分配角色
                </el-button>
                <el-button
                    size="small"
                    type="text"
                    @click="handlePassword(scope.$index, scope.row)"
                >
                    重置密码
                </el-button>
                <el-button
                    size="small"
                    type="text"
                    @click="handleDelete(scope.$index, scope.row)"
                >
                    删除用户
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <div style="text-align: right;">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userAmount"
            style="margin-top: 20px"
        />
    </div>
    <el-dialog
        title="提示"
        v-model="multipleDeleteDialogVisible"
        width="400px"
        @closed="cancel"
        destroy-on-close
        center
    >
        <span style="display:block;text-align: center">确定要批量删除选中的用户吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="danger" @click="deleteUsers(deleteSelectionIds)"
                           :loading="loading">删除</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        title="提示"
        v-model="deleteDialogVisible"
        width="400px"
        @closed="cancel"
        destroy-on-close
        center
    >
        <span style="display:block;text-align: center">确定要删除 {{ tempUser.username }} 吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="danger" @click="deleteUsers([tempUser.id])"
                           :loading="loading">删除</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        title="新增用户"
        v-model="addDialogVisible"
        width="500px"
        @closed="cancel"
        destroy-on-close
    >
        <el-form
            ref="addForm"
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
            <el-form-item label="手机号：" :label-width="labelWidth">
                <el-input v-model="tempUser.phoneNumber" placeholder="可选填"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" :label-width="labelWidth">
                <el-input v-model="tempUser.email" placeholder="可选填" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="性别：" :label-width="labelWidth" prop="resource">
                <el-radio-group v-model="tempUser.gender">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                    <el-radio :label="2">中立</el-radio>
                    <el-radio :label="null">未设置</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="addUser('addForm')"
                           :loading="loading">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        title="修改用户信息"
        v-model="updateDialogVisible"
        width="500px"
        @closed="cancel"
        destroy-on-close
    >
        <el-form
            ref="updateForm"
            :rules="rules"
            :model="tempUser">
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
        </el-form>
        <el-row>
            <p style="color: red;font-size: 10px">修改用户名需要该用户清空浏览器本地缓存，请谨慎修改</p>
        </el-row>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="updateUser('updateForm')"
                           :loading="loading">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        title="分配用户角色"
        v-model="roleDialogVisible"
        width="400px"
        @closed="cancel"
        destroy-on-close
    >
        <el-checkbox-group v-model="roleIds">
            <el-checkbox v-for="(role,index) in roles" :label="role.id">{{ role.name }}</el-checkbox>
        </el-checkbox-group>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="updateUserRole" :loading="loading">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        title="重置用户密码"
        v-model="passwordDialogVisible"
        width="400px"
        destroy-on-close
        center
    >
        <span style="display:block;text-align: center">确定要重置 {{ tempUser.username }} 的密码吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="resetPassword" :loading="loading">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <UploadDialog/>
    <el-dialog
        title="上传用户"
        v-model="uploadDialogVisible"
        width="400px"
        destroy-on-close
    >
        <el-upload
            drag
            ref="upload"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :multiple="true"
            :auto-upload="false"
            :on-success="uploadOnSuccess"
            :on-error="uploadOnError"
        >
            <el-icon color="var(--el-text-color-placeholder)" :size="60" style="margin-top: 40px;margin-bottom: 10px">
                <UploadFilled/>
            </el-icon>
            <div class="el-upload__text">
                将文件拖到此处 或 <em>点此选择文件</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    <p style="color: red">只支持xls和xlsx格式的文件，且必须使用规定的xls模板</p>
                </div>
            </template>
        </el-upload>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="success" @click="uploadUser" :loading="loading">上传</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance, onMounted, reactive, ref} from "vue";
import {ElMessage} from 'element-plus'
import User from "@/api/user";
import axios from "@/axios";
import qs from "qs";
import xlsx from 'xlsx';
import Role from "@/api/role";
import Result from "@/api/result";
import {formatDate} from "@/utils/my-utils";
import UploadDialog from "@/components/UploadDialog.vue";

export default defineComponent({
    name: 'User',
    components: {UploadDialog},
    props: [
        'currentUser'
    ],
    setup(props, context) {
        // @ts-ignore
        const {proxy} = getCurrentInstance();
        // Dialog中的表单每行前面的文字区域的宽度
        const labelWidth = '80px';
        // 新增用户和修改信息Dialog中的表单校验规则
        const rules = {
            id: [
                {
                    message: '请输入用户id',
                    required: true,
                    trigger: 'blur'
                },
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
        const uploadUrl = process.env['VUE_APP_BASE_URL'] + '/web/user/upload';
        const uploadHeaders = {
            Authorization: localStorage.getItem('token')
        }
        // 搜索输入框的内容
        const searchInput = ref('');
        // 表格当前页
        const currentPage = ref(1);
        // 表格当前页容量
        const pageSize = ref(10);
        // 表格所有页容量
        const pageSizes = [5, 10, 20, 50, 100];
        // 加载中遮罩显示与否
        const loading = ref(false);
        // 系统中所有的角色
        const roles = reactive([] as Role[]);
        // 所有table数据
        const tableData = reactive([] as User[]);
        const userAmount = ref(0);
        const roleIds = ref([] as number[]);
        const deleteSelection = ref([] as User[]);
        const deleteSelectionIds: number[] = [];
        // 新增用户的对话框的判断显示的标识符
        const addDialogVisible = ref(false);
        // 批量删除用户的对话框的判断显示的标识符
        const multipleDeleteDialogVisible = ref(false);
        // 删除用户的对话框的判断显示的标识符
        const deleteDialogVisible = ref(false);
        // 编辑用户的对话框的判断显示的标识符
        const updateDialogVisible = ref(false);
        // 分配角色的对话框的判断显示的标识符
        const roleDialogVisible = ref(false);
        const uploadDialogVisible = ref(false);
        // 重置密码的对话框的判断显示的标识符
        const passwordDialogVisible = ref(false);

        const tempUser = reactive({} as User);

        const resetTempUser = () => {
            tempUser.id = null;
            tempUser.username = null;
            tempUser.nickname = null;
            tempUser.gender = null;
            tempUser.phoneNumber = null;
            tempUser.email = null;
            tempUser.creationDate = null;
            tempUser.roles = null;
        }

        // 将用户信息包装成传输的格式（也是数据库存储的格式）
        const parseUser = (user: User) => {
            tempUser.id = user.id;
            tempUser.username = user.username;
            if (user.nickname == '') {
                tempUser.nickname = null;
            } else {
                tempUser.nickname = user.nickname;
            }
            tempUser.nickname = user.nickname;
            tempUser.gender = user.gender;
            if (user.phoneNumber == '') {
                tempUser.phoneNumber = null;
            } else {
                tempUser.phoneNumber = user.phoneNumber;
            }
            if (user.email == '') {
                tempUser.email = null;
            } else {
                tempUser.email = user.email;
            }
            // 把创建时间转换成秒没什么用，因为不可能修改创建时间
            // tempUser.creationDate = Math.floor(new Date(user.creationDate).getTime() / 1000);
            tempUser.creationDate = user.creationDate;
            // 角色也没什么用
            tempUser.roles = user.roles;
            console.log(tempUser);
        }

        const cancel = () => {
            multipleDeleteDialogVisible.value = false
            deleteDialogVisible.value = false;
            updateDialogVisible.value = false;
            roleDialogVisible.value = false;
            passwordDialogVisible.value = false;
            addDialogVisible.value = false;
            uploadDialogVisible.value = false;
            loading.value = false;
        }

        const handleSelectionChange = (val) => {
            deleteSelection.value = val
            deleteSelectionIds.length = 0;
            for (let i = 0; i < deleteSelection.value.length; i++) {
                deleteSelectionIds.push(deleteSelection.value[i].id);
            }
        }

        // 点击新增用户按钮
        const handleAdd = () => {
            resetTempUser();
            addDialogVisible.value = true;
        }

        // 点击批量删除按钮
        const handleMutipleDelete = () => {
            if (deleteSelectionIds.length == 0) {
                ElMessage({
                    showClose: true,
                    message: '未勾选任何用户',
                    type: 'warning'
                })
            } else {
                multipleDeleteDialogVisible.value = true;
                // console.log(deleteSelectionIds);
            }
        }

        // 点击表格内的编辑信息按钮
        const handleUpdate = (index: number, row: User) => {
            console.log(row)
            // 获取该用户信息
            parseUser(row);
            // 显示删除对话框
            updateDialogVisible.value = true;
        }

        // 点击表格内的删除用户按钮
        const handleDelete = (index: number, row: User) => {
            // 获取该用户信息
            parseUser(row);
            // 显示删除对话框
            deleteDialogVisible.value = true;
        }

        // 点击表格内的分配角色按钮
        const handleRole = (index: number, row: User) => {
            // 获取该用户信息
            parseUser(row);
            // 显示删除对话框
            roleDialogVisible.value = true;

            // 赋值
            roleIds.value.length = 0;
            let roles = tempUser.roles;
            for (let i = 0; i < roles.length; i++) {
                roleIds.value.push(roles[i].id)
            }
            // console.log(roleIds.value)
        }

        // 点击表格内的重置密码按钮
        const handlePassword = (index: number, row: User) => {
            // 获取该用户信息
            parseUser(row);
            // 显示删除对话框
            passwordDialogVisible.value = true;
        }

        const handleUpload = () => {
            uploadDialogVisible.value = true;
        }

        const handleDownload = () => {
            loading.value = true;
        }

        // 下面的方式适用于一次接受所有数据的情况
        // 切换每页显示数量后回调
        const handleSizeChange = (val) => {
            // console.log(`每页 ${val} 条`);
            pageSize.value = val;
            currentPage.value = 1;
            getUserList()
        };
        // 点击上、下一页或输入页码后回调
        const handleCurrentChange = (val) => {
            // console.log(`当前页: ${val}`);
            currentPage.value = val;
            getUserList()
        };

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
            ).then(response => {
                let result = response.data as Result;
                if (result.code == 0) {
                    let userList = result.data['userList'] as User[];
                    userAmount.value = result.data['userAmount'] as number;
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
            }).catch(error => {
                ElMessage({
                    showClose: true,
                    message: error,
                    type: 'error'
                })
                loading.value = false;
            })
        }

        const getRoleList = () => {
            proxy.$axios.get('/web/role/list').then(response => {
                let result = response.data as Result;
                if (result.code == 0) {
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
            }).catch(error => {
                ElMessage({
                    showClose: true,
                    message: error,
                    type: 'error'
                })
            })
        }

        const addUser = (formName: string) => {
            proxy.$refs[formName].validate((valid) => {
                if (valid) {// 登录信息填写无误
                    loading.value = true;
                    parseUser(tempUser);
                    axios.post('/web/user/add', tempUser).then(response => {
                        let result = response.data as Result;
                        if (result.code == 0) {
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
                    }).catch(error => {
                        ElMessage({
                            showClose: true,
                            message: error,
                            type: 'error'
                        })
                        cancel();
                    })
                }
            })
        }

        const updateUser = (formName: string) => {
            proxy.$refs[formName].validate((valid) => {
                if (valid) {// 登录信息填写无误
                    loading.value = true;
                    // console.log(user)
                    axios.post('/web/user/update', tempUser)
                        .then(response => {
                            let result = response.data as Result;
                            let code = result.code;
                            if (code == 0) {
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
                        }).catch(error => {
                        ElMessage({
                            showClose: true,
                            message: error,
                            type: 'error'
                        })
                        cancel();
                    })

                }
            })
        }

        const deleteUsers = (userIds: number[]) => {
            // console.log(userIds);
            loading.value = true;
            axios.post('/web/user/delete', userIds).then(response => {
                let result = response.data as Result;
                let code = result.code;
                if (code == 0) {
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
            }).catch(error => {
                cancel();
            })
        }

        const resetPassword = () => {
            loading.value = true;
            axios.post('/web/user/password/reset', tempUser.id as number).then(response => {
                let result = response.data as Result;
                let code = result.code;
                if (code == 0) {
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
            }).catch(error => {
                ElMessage({
                    showClose: true,
                    message: error,
                    type: 'error'
                })
                cancel();
            })
        }

        const updateUserRole = () => {
            loading.value = true;
            axios.post(
                '/web/user/role',
                qs.stringify(
                    {
                        user_id: tempUser.id as number,
                        role_ids: roleIds.value
                    },
                    {
                        indices: false
                    }
                ),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                }
            ).then(response => {
                let result = response.data as Result;
                let code = result.code;
                if (code == 0) {
                    ElMessage({
                        showClose: true,
                        message: result.msg,
                        type: 'success'
                    })
                    proxy.$router.go(0);
                    // tableData.length = 0;
                    // getUserList();
                } else {
                    ElMessage({
                        showClose: true,
                        message: result.msg,
                        type: 'warning'
                    })
                }
                cancel();
            }).catch(error => {
                ElMessage({
                    showClose: true,
                    message: error,
                    type: 'error'
                })
                cancel();
            })
        }

        const uploadUser = () => {
            loading.value = true;
            proxy.$refs.upload.submit();
        }

        const uploadOnSuccess = (response, file, fileList) => {
            loading.value = false;
            ElMessage({
                showClose: true,
                message: response.msg,
                type: 'success'
            })
            cancel();
        }

        const uploadOnError = (error, file, fileList) => {
            loading.value = false;
            let result = JSON.parse(error.message) as Result
            ElMessage({
                showClose: true,
                message: result.msg,
                type: 'error'
            })
        }

        onMounted(() => {
            getUserList();
            getRoleList();
        })

        const fDate = (ms: number) => {
            return formatDate(ms * 1000);
        }

        return {
            fDate,
            labelWidth,
            rules,
            uploadUrl,
            uploadHeaders,
            searchInput,
            currentPage,
            pageSize,
            pageSizes,
            loading,
            roles,
            tableData,
            userAmount,
            roleIds,
            deleteSelection,
            deleteSelectionIds,
            addDialogVisible,
            multipleDeleteDialogVisible,
            deleteDialogVisible,
            updateDialogVisible,
            roleDialogVisible,
            passwordDialogVisible,
            uploadDialogVisible,
            tempUser,
            resetTempUser,
            parseUser,
            cancel,
            handleSelectionChange,
            handleAdd,
            handleMutipleDelete,
            handleUpdate,
            handleDelete,
            handleRole,
            handlePassword,
            handleSizeChange,
            handleCurrentChange,
            handleUpload,
            handleDownload,
            getUserList,
            getRoleList,
            addUser,
            updateUser,
            deleteUsers,
            resetPassword,
            updateUserRole,
            uploadUser,
            uploadOnSuccess,
            uploadOnError,
        };
    },
});
</script>

<style>
/*.el-checkbox.el-checkbox--small {*/
/*    width: 100%;*/
/*}*/

/*.el-checkbox {*/
/*    margin-right: 0;*/
/*}*/

</style>
