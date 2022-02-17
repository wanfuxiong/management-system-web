<template>
    <el-row style="margin-bottom: 20px">
        <el-col :span="24">
            <el-button
                type="primary"
                icon="Plus"
                style="vertical-align: middle;"
                @click="handleAdd"
            >
                新增菜单
            </el-button>
        </el-col>
    </el-row>
    <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
    >
        <el-table-column prop="title" label="标题" min-width="180" fixed/>
        <el-table-column prop="id" label="菜单ID" min-width="90" fixed/>
        <el-table-column prop="code" label="操作码" min-width="180"/>
        <el-table-column prop="path" label="路径" min-width="180"/>
        <el-table-column prop="icon" label="图标" min-width="180">
            <template #default="scope">
                <el-icon>
                    <component :is="scope.row.icon"/>
                </el-icon>
            </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" min-width="90"/>
        <el-table-column prop="type" label="种类" min-width="92">
            <template
                #default="scope"
            >
                <el-tag
                    :type="scope.row.type===0||scope.row.type===1?'':(scope.row.type===2?'success':'danger')"
                    disable-transitions
                >
                    {{ formatType(scope.row.type) }}
                </el-tag>
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
        title="新增菜单"
        v-model="addDialogVisible"
        width="500px"
        @closed="cancel"
        destroy-on-close
    >
        <el-form
            ref="addForm"
            :rules="rules"
            :model="tempMenu">
            <el-form-item label="类型：" :label-width="labelWidth" prop="type">
                <!--<el-radio-group v-model="tempMenu.type">-->
                <!--    <el-radio :label="0">父菜单</el-radio>-->
                <!--    <el-radio :label="1">子菜单</el-radio>-->
                <!--    <el-radio :label="2">基本操作</el-radio>-->
                <!--</el-radio-group>-->
                <el-select
                    v-model="tempMenu.type"
                    placeholder="请先选择菜单类型"
                    style="width: 100%"
                    @change="handleChangeType"
                >
                    <el-option label="一级菜单" :value="0"></el-option>
                    <el-option label="二级菜单" :value="1"></el-option>
                    <el-option label="基本操作" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="父id：" :label-width="labelWidth" prop="parentId"
                          v-if="tempMenu.type!==0&&tempMenu.type!==null">
                <el-input v-model="tempMenu.parentId" placeholder="选填" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="操作代码：" :label-width="labelWidth" prop="code" v-if="tempMenu.type!==null">
                <el-input v-model="tempMenu.code" placeholder="必填，以冒号分割" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="名称：" :label-width="labelWidth" prop="name"
                          v-if="tempMenu.type===0||tempMenu.type===1">
                <el-input v-model="tempMenu.name" placeholder="二级菜单必填，内部名称（英文、并以大写字母开头）"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="标题：" :label-width="labelWidth" prop="title" v-if="tempMenu.type!==null">
                <el-input v-model="tempMenu.title" placeholder="必填，外部名称" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="路径：" :label-width="labelWidth" prop="path" v-if="tempMenu.type===0||tempMenu.type===1">
                <el-input v-model="tempMenu.path" placeholder="选填" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="图标：" :label-width="labelWidth" prop="icon"
                          v-if="tempMenu.type===0">
                <el-input v-model="tempMenu.icon" placeholder="必填，图标见elementui官网"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序：" :label-width="labelWidth" prop="order" v-if="tempMenu.type!=null">
                <el-input v-model="tempMenu.order" placeholder="必填" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer" v-if="tempMenu.type!==null">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="addMenu('addForm')"
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
        <span style="display:block;text-align: center">确定要删除 {{ tempMenu.title }} 吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="danger" @click="deleteMenu(tempMenu.id)"
                           :loading="loading">删除</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        title="编辑菜单"
        v-model="updateDialogVisible"
        width="500px"
        @closed="cancel"
        destroy-on-close
    >
        <el-form
            ref="updateForm"
            :rules="rules"
            :model="tempMenu">
            <el-form-item label="类型：" :label-width="labelWidth" prop="type">
                <el-select

                    v-model="tempMenu.type"
                    placeholder="请先选择菜单类型"
                    style="width: 100%"
                >
                    <el-option label="一级菜单" :value="0"></el-option>
                    <el-option label="二级菜单" :value="1"></el-option>
                    <el-option label="基本操作" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="父id：" :label-width="labelWidth" prop="parentId"
                          v-if="tempMenu.type===1||tempMenu.type===2">
                <el-input v-model="tempMenu.parentId" placeholder="选填" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="操作码：" :label-width="labelWidth" prop="code" v-if="tempMenu.type!==null">
                <el-input v-model="tempMenu.code" placeholder="必填，以冒号分割" autocomplete="off"
                          disabled></el-input>
            </el-form-item>
            <el-form-item label="名称：" :label-width="labelWidth" prop="name"
                          v-if="tempMenu.type===0||tempMenu.type===1">
                <el-input v-model="tempMenu.name" placeholder="子菜单必填，内部名称（英文、并以大写字母开头）"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="标题：" :label-width="labelWidth" prop="title" v-if="tempMenu.type!==null">
                <el-input v-model="tempMenu.title" placeholder="必填，外部名称" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="路径：" :label-width="labelWidth" prop="path" v-if="tempMenu.type===0||tempMenu.type===1">
                <el-input v-model="tempMenu.path" placeholder="选填" autocomplete="off"></el-input>
            </el-form-item>
<!--            <el-form-item label="图标：" :label-width="labelWidth" prop="icon"-->
<!--                          v-if="tempMenu.type===0">-->
<!--                <el-input v-model="tempMenu.icon" placeholder="必填，图标见elementui官网"-->
<!--                          autocomplete="off"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="图标：" :label-width="labelWidth" prop="icon"
                          v-if="tempMenu.type===0">
                <el-select
                    v-model="tempMenu.icon"
                    placeholder="请选择图标"
                    filterable
                    style="width: 100%"
                >
                    <el-option
                        v-for="iconName in modules"
                        :key="iconName"
                        :label="iconName"
                        :value="iconName"
                    >
                        <div style="display: flex;justify-content: space-between;align-items: center;">
                            <el-icon color="var(--el-text-color-regular)">
                                <component :is="iconName"/>
                            </el-icon>
                            <span style="font-size: 13px;font-weight: normal;color: var(--el-text-color-secondary)">
                                {{ iconName }}
                            </span>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="排序：" :label-width="labelWidth" prop="order" v-if="tempMenu.type!=null">
                <el-input v-model="tempMenu.order" placeholder="必填" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer" v-if="tempMenu.type!==null">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="updateMenu('updateForm')"
                           :loading="loading">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance, onMounted, reactive, ref, toRefs} from "vue";
import User from "@/api/user";
import {ElMessage} from "element-plus";
import Result from "@/api/result";
import Menu from "@/api/menu";
import axios from "@/axios";
import {formatDate} from "@/utils/my-utils";
import * as ElIconModules from '@element-plus/icons-vue'

export default defineComponent({
    name: 'Menu',
    props: [
        'currentUser'
    ],
    setup(props, context) {
        // @ts-ignore
        const {proxy} = getCurrentInstance();

        const modules: string[] = []

        const labelWidth = '100px';
        const rules = {
            code: [
                {
                    message: '请输入操作码',
                    required: true,
                    trigger: 'blur'
                },
            ],
            name: [
                {
                    message: '名称只能是大写字母开头的英文单词加数字（长度在16个字母内）',
                    pattern: '^[A-Z]{1}[a-zA-Z0-9]{1,15}$',
                },
            ],
            title: [
                {
                    message: '请输入标题',
                    required: true,
                    trigger: 'blur'
                },
            ],
            icon: [
                {
                    message: '请输入icon',
                    required: true,
                    trigger: 'blur'
                },
            ],
            order: [
                {
                    message: '请输入排序',
                    required: true,
                    trigger: 'blur'
                },
                {
                    message: '排序只能是10000以内的正整数',
                    pattern: '^\\d{1,4}$',
                },
            ],
        }
        const loading = ref(false);
        const addDialogVisible = ref(false);
        const deleteDialogVisible = ref(false);
        const updateDialogVisible = ref(false);

        const menus = reactive([] as Menu[]);
        const tableData = reactive([] as Menu[]);

        const tempMenu = reactive({} as Menu);

        const assignTempMenu = (menu: Menu) => {
            tempMenu.id = menu.id;
            tempMenu.parentId = menu.parentId;
            tempMenu.name = menu.name;
            tempMenu.title = menu.title;
            tempMenu.path = menu.path;
            tempMenu.icon = menu.icon;
            tempMenu.order = String(menu.order);
            tempMenu.type = menu.type;
            tempMenu.code = menu.code;
            tempMenu.creationDate = menu.creationDate;
            tempMenu.children = menu.children;
        }

        const resetMenu = () => {
            tempMenu.id = null;
            tempMenu.parentId = null;
            tempMenu.name = null;
            tempMenu.title = null;
            tempMenu.path = null;
            tempMenu.icon = null;
            tempMenu.order = null;
            tempMenu.type = null;
            tempMenu.code = null;
            tempMenu.creationDate = null;
            tempMenu.children = null;
        }

        const parseMenu = (menu: Menu) => {
            tempMenu.id = menu.id;
            tempMenu.parentId = menu.parentId === '' ? null : menu.parentId;
            tempMenu.title = menu.title === '' ? null : menu.title;
            tempMenu.path = menu.path === '' ? null : menu.path;
            tempMenu.icon = menu.icon === '' ? null : menu.icon;
            tempMenu.order = menu.order === '' ? null : menu.order;
            tempMenu.code = menu.code === '' ? null : menu.code;
            tempMenu.creationDate = menu.creationDate;
            tempMenu.children = menu.children;
        }

        const handleChangeType = () => {
            tempMenu.id = null;
            tempMenu.parentId = null;
            tempMenu.title = null;
            tempMenu.path = null;
            tempMenu.icon = null;
            tempMenu.order = null;
            tempMenu.code = null;
            tempMenu.creationDate = null;
            tempMenu.children = null;
        }

        const cancel = () => {
            deleteDialogVisible.value = false;
            updateDialogVisible.value = false;
            addDialogVisible.value = false;
            loading.value = false;
        }

        const formatType = (type: number) => {
            return type === 0 ? '一级菜单' : (type === 1 ? '二级菜单' : (type === 2 ? '基本操作' : '未知'))
        }

        const fDate = (ms: number) => {
            return formatDate(ms);
        }

        const getMenuInfo = () => {
            proxy.$axios.get('/web/menu/').then(response => {
                let result = response.data as Result;
                if (result.code == 0) {

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

        const getMenuList = () => {
            loading.value = true;
            proxy.$axios.get('/web/menu/list').then(response => {
                let result = response.data as Result;
                if (result.code == 0) {
                    let menuList: Menu[] = result.data['menuList'];
                    tableData.length = 0;
                    menuList.forEach(menu => {
                        menus.push(menu);
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
                    // console.log(tableData)
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

        const addMenu = (formName: string) => {
            loading.value = true;
            proxy.$refs[formName].validate((valid) => {
                if (valid) {
                    parseMenu(tempMenu);
                    proxy.$axios.post('/web/menu/add', tempMenu).then(response => {
                        let result = response.data as Result;
                        if (result.code == 0) {
                            ElMessage({
                                showClose: true,
                                message: result.msg,
                                type: 'success'
                            })
                            getMenuList();
                            cancel();
                        } else {
                            ElMessage({
                                showClose: true,
                                message: result.msg,
                                type: 'warning'
                            })
                            loading.value = false;
                        }
                    }).catch(error => {
                        ElMessage({
                            showClose: true,
                            message: error,
                            type: 'error'
                        })
                        loading.value = false;
                    })
                } else {
                    loading.value = false;
                }
            })
        }

        const deleteMenu = (id: number) => {
            loading.value = true;
            proxy.$axios.post('/web/menu/delete/' + id).then(response => {
                let result = response.data as Result;
                if (result.code == 0) {
                    ElMessage({
                        showClose: true,
                        message: result.msg,
                        type: 'success'
                    })
                    getMenuList();
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

        const updateMenu = (formName: string) => {
            loading.value = true;
            proxy.$refs[formName].validate((valid) => {
                if (valid) {
                    proxy.$axios.post('/web/menu/update', tempMenu).then(response => {
                        let result = response.data as Result;
                        if (result.code == 0) {
                            ElMessage({
                                showClose: true,
                                message: result.msg,
                                type: 'success'
                            })
                            proxy.$router.go(0);
                            cancel();
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
                            message: error.response.data['msg'],
                            type: 'error'
                        })
                        cancel();
                    })
                }
            })
        }

        const handleAdd = () => {
            resetMenu();
            addDialogVisible.value = true;
        }

        const handleDelete = (index: number, row: Menu) => {
            // console.log(row)
            assignTempMenu(row)
            deleteDialogVisible.value = true;
        }

        const handleUpdate = (index: number, row: Menu) => {
            console.log(row)
            assignTempMenu(row)
            console.log(tempMenu.type)
            updateDialogVisible.value = true;
        }

        onMounted(() => {
            getMenuList();
            for (const iconName in ElIconModules) {
                modules.push(iconName)
            }
        })

        return {
            modules,
            labelWidth,
            rules,
            loading,
            addDialogVisible,
            deleteDialogVisible,
            updateDialogVisible,
            tableData,
            tempMenu,
            cancel,
            formatType,
            fDate,
            handleChangeType,
            addMenu,
            deleteMenu,
            updateMenu,
            handleAdd,
            handleDelete,
            handleUpdate,
        }
    }
});
</script>

<style>

</style>
