<template>
    <el-row style="margin-bottom: 20px">
        <el-col :span="24">
            <el-input
                placeholder="搜索角色名"
                prefix-icon="Search"
                clearable
                v-model="searchInput"
                style="display: inline-block;width: 200px;margin-right: 10px;vertical-align: middle;"
            >
            </el-input>
            <el-button
                type="primary"
                icon="Plus"
                style="vertical-align: middle;"
                @click="handleAdd"
            >
                新增角色
            </el-button>
        </el-col>
    </el-row>
    <el-table
        v-loading="loading"
        :data="filterCurrentPageTableData()"
        style="width: 100%;"
    >
        <el-table-column
            prop="id"
            label="角色ID"
            min-width="80"
            fixed
        ></el-table-column>
        <el-table-column
            prop="name"
            label="角色名称"
            min-width="104"
            fixed
        >
            <template
                #default="scope"
            >
                <el-tag
                    type=""
                    disable-transitions
                >
                    {{ scope.row.name }}
                </el-tag>
            </template>
        </el-table-column>
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
            label="创建日期"
            min-width="166"
        >
            <template
                #default="scope"
            >
                {{ fDate(scope.row.creationDate) }}
            </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="198"
            fixed="right"
        >
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
    <div style="text-align: right;">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filterSearchTableData().length"
            style="margin-top: 20px"
        />
    </div>
    <el-dialog
        title="新增角色"
        v-model="addDialogVisible"
        width="500px"
        @closed="cancel"
        destroy-on-close
    >
        <el-form
            ref="addForm"
            :rules="rules"
            :model="tempRole">
            <el-form-item label="角色ID：" :label-width="labelWidth" prop="id">
                <el-input size="small" v-model="tempRole.id" placeholder="必填" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色名称：" :label-width="labelWidth" prop="name">
                <el-input size="small" v-model="tempRole.name" placeholder="必填" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色代码：" :label-width="labelWidth" prop="code">
                <el-input size="small" v-model="tempRole.code" placeholder="必填" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述：" :label-width="labelWidth" prop="description">
                <el-input size="small" v-model="tempRole.description" placeholder="选填" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="addRole('addForm')"
                           :loading="loading">确定</el-button>
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
        <span style="display:block;text-align: center">确定要删除角色 {{ tempRole.name }} 吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="danger" @click="deleteRoles([tempRole.id])"
                           :loading="loading">删除</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        title="更新角色"
        v-model="updateDialogVisible"
        width="500px"
        @closed="cancel"
        destroy-on-close
    >
        <el-form
            ref="updateForm"
            :rules="rules"
            :model="tempRole">
            <el-form-item label="角色ID：" :label-width="labelWidth" prop="id">
                <el-input size="small" v-model="tempRole.id" placeholder="必填" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色名称：" :label-width="labelWidth" prop="name">
                <el-input size="small" v-model="tempRole.name" placeholder="必填" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色代码：" :label-width="labelWidth" prop="code">
                <el-input size="small" v-model="tempRole.code" placeholder="必填" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述：" :label-width="labelWidth" prop="description">
                <el-input size="small" v-model="tempRole.description" placeholder="选填" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="updateRole('updateForm')"
                           :loading="loading">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        title="分配菜单"
        v-model="menuDialogVisible"
        width="500px"
        @closed="cancel"
        destroy-on-close
    >
        <el-tree
            ref="menuTree"
            :data="menus"
            :props="menuProps"
            node-key="id"
            default-expand-all
            :default-checked-keys="defaultCheckedKeys"
            show-checkbox
            @check-change="handleCheckChange"
        />
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="updateRoleMenu"
                           :loading="loading">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, reactive, ref} from "vue";
import Role from "@/api/role";
import User from "@/api/user";
import {ElMessage} from "element-plus";
import Result from "@/api/result";
import axios from "@/axios";
import qs from "qs";
import {formatDate} from "@/utils/my-utils";
import Menu from "@/api/menu";

export default defineComponent({
    name: 'Role',
    props: [
        'currentUser'
    ],
    setup(props, context) {
        // @ts-ignore
        const {proxy} = getCurrentInstance();
        // Dialog中的表单每行前面的文字区域的宽度
        const labelWidth = '100px';
        // 新增角色和修改信息Dialog中的表单校验规则
        const rules = {
            id: [
                {
                    message: '请输入角色id',
                    required: true,
                    trigger: 'blur'
                }
            ],
            name: [
                {
                    message: '请输入角色名',
                    required: true,
                    trigger: 'blur'
                }
            ],
            code: [
                {
                    message: '请输入角色代码',
                    required: true,
                    trigger: 'blur'
                },
                {
                    message: '角色代码只能包含小写字母',
                    pattern: '[a-z]',
                }
            ]
        }
        const menuProps = {
            children: 'children',
            label: 'title',
        }
        const defaultCheckedKeys = reactive([] as number[]);
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
        // 系统中所有的菜单
        const menus = reactive([] as Menu[]);
        const menusTemp = reactive([] as Menu[]);
        // 所有table数据
        const tableData = reactive([] as Role[]);
        const roleIds = ref([] as number[]);
        // 新增角色的对话框的判断显示的标识符
        const addDialogVisible = ref(false);
        // 删除角色的对话框的判断显示的标识符
        const deleteDialogVisible = ref(false);
        // 编辑角色的对话框的判断显示的标识符
        const updateDialogVisible = ref(false);
        // 分配菜单的对话框的判断显示的标识符
        const menuDialogVisible = ref(false);
        // 重置密码的对话框的判断显示的标识符
        const passwordDialogVisible = ref(false);

        const tempRole = reactive({} as Role);

        // 过滤出包含搜索字符串的（所有）表格数据。（该方法的tableData数组是一次性获得所有表格的数据，不是分页查询后的表格数据）
        const filterSearchTableData = (): Role[] => {
            return tableData.filter((role: Role) =>
                JSON.stringify(role).includes(// 过滤掉特殊字符
                    (searchInput.value.includes('{') ||
                        searchInput.value.includes('}') ||
                        searchInput.value.includes(':') ||
                        searchInput.value.includes('[') ||
                        searchInput.value.includes(']') ||
                        searchInput.value.includes('\"') ||
                        searchInput.value.includes('\'')) ?
                        '' : searchInput.value)
            );
        }

        // 将过滤出包含搜索字符串的表格数据，过滤出当前页的（需要显示的）表格数据。（该方法的tableData数组是一次性获得所有表格的数据，不是分页查询后的表格数据）
        const filterCurrentPageTableData = (): Role[] => {
            return filterSearchTableData().filter((role: Role, index: number) =>
                (currentPage.value - 1) * pageSize.value <= index && index < currentPage.value * pageSize.value
            );
        }

        const resetTempRole = () => {
            tempRole.id = null;
            tempRole.name = null;
            tempRole.code = null;
            tempRole.description = null;
            tempRole.creationDate = null;
            tempRole.menuIds = null;
        }

        // 将角色信息包装成传输的格式（也是数据库存储的格式）
        const parseRole = (role: Role) => {
            tempRole.id = role.id === '' ? null : role.id;
            tempRole.name = role.name === '' ? null : role.name;
            tempRole.code = role.code === '' ? null : role.code;
            tempRole.description = role.description === '' ? null : role.description;
            tempRole.creationDate = role.creationDate === '' ? null : role.creationDate;
            tempRole.menuIds = role.menuIds === '' ? null : role.menuIds;
        }

        const cancel = () => {
            deleteDialogVisible.value = false;
            updateDialogVisible.value = false;
            menuDialogVisible.value = false;
            passwordDialogVisible.value = false;
            addDialogVisible.value = false;
            loading.value = false;
        }

        // 点击新增角色按钮
        const handleAdd = () => {
            resetTempRole();
            addDialogVisible.value = true;
        }

        // 点击表格内的编辑信息按钮
        const handleUpdate = (index: number, row: Role) => {
            // 获取该角色信息
            parseRole(row);
            // 显示删除对话框
            updateDialogVisible.value = true;
        }

        // 点击表格内的删除角色按钮
        const handleDelete = (index: number, row: Role) => {
            // 获取该角色信息
            parseRole(row);
            // 显示删除对话框
            deleteDialogVisible.value = true;
        }

        // 点击表格内的分配角色按钮
        const handleMenu = (index: number, row: Role) => {
            defaultCheckedKeys.length = 0;
            // 获取该角色信息
            parseRole(row);
            // 显示删除对话框
            // menuDialogVisible.value = true;

            getMenuIds();
        }

        // 下面的方式适用于一次接受所有数据的情况
        // 切换每页显示数量后回调
        const handleSizeChange = (val) => {
            // console.log(`每页 ${val} 条`);
            pageSize.value = val;
            currentPage.value = 1;
        };
        // 点击上、下一页或输入页码后回调
        const handleCurrentChange = (val) => {
            // console.log(`当前页: ${val}`);
            currentPage.value = val;
        };

        const handleCheckChange = () => {

        }

        const getRoleList = () => {
            loading.value = true;
            proxy.$axios.get('/web/role/list').then(response => {
                let result = response.data as Result;
                if (result.code == 0) {
                    let roleList: Role[] = result.data['roleList'];
                    // console.log(roleList)
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
                ElMessage({
                    showClose: true,
                    message: error,
                    type: 'error'
                })
                loading.value = false;
            })
        }

        const getMenuList = () => {
            proxy.$axios.get('/web/menu/list').then(response => {
                let result = response.data as Result;
                if (result.code == 0) {
                    let menuList: Menu[] = result.data['menuList'];
                    menuList.forEach(menu => {
                        // 留着，为了给树形图勾选用
                        menusTemp.push(menu);
                        menuList.forEach(m => {
                            // 如果不是一级菜单
                            if (m.parentId != null && menu.id == m.parentId) {
                                menu.children.push(m)
                            }
                        })
                        if (menu.parentId == null) {
                            menus.push(menu);
                        }
                    })
                    // console.log(menus)
                } else {
                    // ElMessage({
                    //     showClose: true,
                    //     message: result.msg,
                    //     type: 'warning'
                    // })
                }
            }).catch(error => {
                // ElMessage({
                //     showClose: true,
                //     message: error,
                //     type: 'error'
                // })
            })
        }

        const getMenuIds = () => {
            defaultCheckedKeys.length = 0;
            proxy.$axios.get('/web/role/info/' + tempRole.id).then(response => {
                let result = response.data as Result;
                if (result.code === 0) {
                    let role: Role = result.data['role'];
                    let menuIds = role.menuIds;
                    menusTemp.forEach(m => {
                        if (m.children === null || m.children.length === 0) {
                            if (menuIds.includes(m.id)) {
                                defaultCheckedKeys.push(m.id);
                            }
                        }
                    })
                    menuDialogVisible.value = true;
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

        const addRole = (formName: string) => {
            proxy.$refs[formName].validate((valid) => {
                if (valid) {// 登录信息填写无误
                    loading.value = true;
                    axios.post('/web/role/add', tempRole).then(response => {
                        let result = response.data as Result;
                        if (result.code == 0) {
                            ElMessage({
                                showClose: true,
                                message: result.msg,
                                type: 'success'
                            })
                            tableData.length = 0;
                            getRoleList();
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
                            message: error.response.data['msg'],
                            type: 'error'
                        })
                        cancel();
                    })
                }
            })
        }

        const updateRole = (formName: string) => {
            proxy.$refs[formName].validate((valid) => {
                if (valid) {// 登录信息填写无误
                    loading.value = true;
                    axios.post('/web/role/update', tempRole)
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
                                getRoleList();
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
                            message: error.response.data['msg'],
                            type: 'error'
                        })
                        cancel();
                    })

                }
            })
        }

        const deleteRoles = (roleIds: number[]) => {
            // console.log(userIds);
            loading.value = true;
            axios.post('/web/role/delete', roleIds).then(response => {
                let result = response.data as Result;
                let code = result.code;
                if (code == 0) {
                    ElMessage({
                        showClose: true,
                        message: result.msg,
                        type: 'success'
                    })
                    tableData.length = 0;
                    getRoleList();
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
                    message: error.response.data['msg'],
                    type: 'error'
                })
                cancel();
            })
        }

        const updateRoleMenu = () => {
            loading.value = true;
            let menuIds = proxy.$refs['menuTree'].getCheckedKeys()
                .concat(proxy.$refs['menuTree'].getHalfCheckedKeys())
                .sort(function (a, b) {
                    return a - b //a-b为升序
                    //return b-a  //b-a为降序
                });
            axios.post(
                '/web/role/menu',
                qs.stringify(
                    {
                        role_id: tempRole.id,
                        menu_ids: menuIds
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
                } else {
                    ElMessage({
                        showClose: true,
                        message: result.msg,
                        type: 'warning'
                    })
                    cancel();
                }
            }).catch(error => {
                ElMessage({
                    showClose: true,
                    message: error.response.data['msg'],
                    type: 'error'
                })
                cancel();
            })
        }

        onMounted(() => {
            getRoleList();
            getMenuList();
        })

        const fDate = (ms: number) => {
            return formatDate(ms * 1000);
        }

        return {
            fDate,
            labelWidth,
            rules,
            menuProps,
            defaultCheckedKeys,
            searchInput,
            currentPage,
            pageSize,
            pageSizes,
            loading,
            menus,
            tableData,
            roleIds,
            addDialogVisible,
            deleteDialogVisible,
            updateDialogVisible,
            menuDialogVisible,
            passwordDialogVisible,
            tempRole,
            filterSearchTableData,
            filterCurrentPageTableData,
            resetTempRole,
            parseRole,
            cancel,
            handleAdd,
            handleUpdate,
            handleDelete,
            handleMenu,
            handleSizeChange,
            handleCurrentChange,
            handleCheckChange,
            getRoleList,
            addRole,
            updateRole,
            deleteRoles,
            updateRoleMenu,
        };
    }
});
</script>

<style>

</style>
