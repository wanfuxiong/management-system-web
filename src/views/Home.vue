<template>
    <el-container>
        <el-aside width="auto">
            <router-link :to="{path:'/home'}">
                <el-row id="home-aside-logo-container">
                    <Logo/>
                </el-row>
            </router-link>
            <el-scrollbar id="home-aside-scrollbar">
                <el-menu
                    id="home-aside-menu"
                    :default-openeds="defaultOpenedIndexs"
                    :default-active="defaultActiveIndex"
                    :router="true"
                    :collapse="isSidebarCollapse"
                    :collapse-transition="true"
                    text-color="#fff"
                    background-color="#191a23"
                >
                    <!-- 动态渲染侧边栏（只支持父子二级结构，不支持三级结构）-->
                    <template
                        v-for="(sidebarMenuItem,index) in sidebarMenuList"
                        :key="index"
                    >
                        <!-- 没有子级菜单就使用el-menu-item -->
                        <el-menu-item
                            v-if="sidebarMenuItem.children.length===0"
                            :index="sidebarMenuItem.path">
                            <el-icon>
                                <component :is="sidebarMenuItem.icon"/>
                            </el-icon>
                            <template #title>{{ sidebarMenuItem.title }}</template>
                        </el-menu-item>
                        <!-- 有子级菜单就使用el-sub-menu -->
                        <el-sub-menu
                            v-else
                            :index="sidebarMenuItem.code"
                        >
                            <template #title>
                                <el-icon>
                                    <component :is="sidebarMenuItem.icon"/>
                                </el-icon>
                                <span>{{ sidebarMenuItem.title }}</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item
                                    v-for="(sidebarMenuItemChildren,index) in sidebarMenuItem.children"
                                    :key="index"
                                    :index="sidebarMenuItemChildren.path"
                                >
                                    {{ sidebarMenuItemChildren.title }}
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>
                    </template>
                </el-menu>
            </el-scrollbar>
            <el-row
                id="home-aside-collapse-container"
                @click="isSidebarCollapse=!isSidebarCollapse"
            >
                <el-icon color="#FFFFFF">
                    <Fold v-if="!isSidebarCollapse"/>
                    <Expand v-else/>
                </el-icon>
            </el-row>
        </el-aside>
        <el-container>
            <el-header style="box-shadow: 0 1px 5px #00000011;z-index: 1;">
                <el-row style="height: var(--el-header-height);">
                    <el-col :span="12" id="home-header-left-container">
                        <span id="home-header-text">MANAGEMENT SYSTEM</span>
                    </el-col>
                    <el-col :span="12" id="home-header-right-container">
                        <!--<el-link-->
                        <!--    :underline="false"-->
                        <!--    @click="defaultActiveIndex='/home/doc';this.$router.push({path: '/home/doc'});"-->
                        <!--    style="margin:0 10px;">-->
                        <!--    帮助文档-->
                        <!--</el-link>-->
                        <el-link
                            :underline="false"
                            icon="FullScreen"
                            style="margin:0 10px;"
                            @click="handleFullScreen"
                        ></el-link>
                        <el-dropdown @command="handleDropDownMenuCommand">
                            <div class="el-dropdown-link" id="home-header-user">
                                <el-avatar
                                    shape="square"
                                    size="small"
                                    src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                                    style="margin: 0 10px"
                                ></el-avatar>
                                <span style="line-height: 30px">
                                    {{ currentUser.nickname == null ? currentUser.username : currentUser.nickname }}
                                </span>
                                <el-icon class="el-icon--right">
                                    <ArrowDown/>
                                </el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item icon="Lock" command="修改密码">修改密码</el-dropdown-item>
                                    <el-dropdown-item icon="CircleClose" command="退出登录">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </el-header>
            <el-main>
                <el-scrollbar style="background-color:#f0f2f5;height: calc(100vh - 60px)">
                    <div class="base-body">
                        <router-view/>
                    </div>
                    <Footer/>
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>
    <el-dialog
        title="修改密码"
        v-model="passwordDialogVisible"
        @closed="cancel"
        destroy-on-close
    >
        <el-form
            ref="changePasswordFormRef"
            :rules="rules"
            :model="passwordData"
            @keyup.enter="handleChangePassword(changePasswordFormRef)"
        >
            <el-form-item label="原密码：" :label-width="labelWidth" prop="oldPassword">
                <el-input v-model="passwordData.oldPassword" placeholder="请输入原密码"
                          autocomplete="off" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" :label-width="labelWidth" prop="newPassword">
                <el-input v-model="passwordData.newPassword" placeholder="请输入新密码"
                          autocomplete="off" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码：" :label-width="labelWidth" prop="newPasswordAgain">
                <el-input placeholder="请再次输入新密码"
                          autocomplete="off" v-model="passwordData.newPasswordAgain" type="password"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button
                    type="primary"
                    @click="handleChangePassword(changePasswordFormRef)"
                    :loading="loading"
                >确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {
    ComponentInternalInstance,
    computed,
    getCurrentInstance,
    onMounted,
    onUpdated,
    reactive,
    ref
} from 'vue';
import {ElForm, ElMessage} from 'element-plus'
import axios from "@/axios";
import Result from "@/interface/result";
import User from "@/interface/user";
import Menu from "@/interface/menu";
import qs from "qs";
import Footer from "@/components/Footer.vue";
import Logo from "@/components/Logo.vue";
import Welcome from "@/views/home/Welcome.vue";
import router from "@/router";

interface Tab {
    title: string,
    name: string
}

const {proxy} = <ComponentInternalInstance>getCurrentInstance();

const labelWidth = '120px'

const passwordValidator = (rule, value, callback) => {
    if (value !== passwordData.newPassword) {
        callback(new Error('两次密码输入不一致'))
    } else {
        callback()
    }
}

const rules = {
    oldPassword: [
        {
            message: '请输入原密码',
            required: true,
            trigger: 'blur'
        },
        {
            min: 6,
            max: 16,
            message: '密码长度应是6 - 16位',
            trigger: 'blur'
        },
        {
            message: '密码只能包含大小写英文字母、数字或~!@#$%^&*_-=+?,.;:',
            pattern: '^[a-zA-Z0-9！@#$%^&*-=_+;:,./?]+$',
        },
    ],
    newPassword: [
        {
            message: '请输入新密码',
            required: true,
            trigger: 'blur'
        },
        {
            min: 6,
            max: 16,
            message: '密码长度应是6 - 16位',
            trigger: 'blur'
        },
        {
            message: '密码只能包含大小写英文字母、数字或~!@#$%^&*_-=+?,.;:',
            pattern: '^[a-zA-Z0-9！@#$%^&*-=_+;:,./?]+$',
        }
    ],
    newPasswordAgain: [
        {
            message: '请再次输入新密码',
            required: true,
            trigger: 'blur'
        },
        {
            validator: passwordValidator,
            trigger: 'blur'
        }
    ]
}

const currentUser = ref({
    id: null,
    username: null,
    nickname: null,
    gender: null,
    phoneNumber: null,
    email: null,
    creationDate: null,
    roles: null,
} as User);

const editableTabsValue = ref('');

const editableTabs = reactive<Tab[]>([])

const passwordData = reactive({
    oldPassword: "",
    newPassword: "",
    newPasswordAgain: "",
});

const loading = ref(false);

const passwordDialogVisible = ref(false);

const defaultActiveIndex = ref(proxy?.$route.path);

const isSidebarCollapse = ref(document.body.clientWidth < 1000);

const changePasswordFormRef = ref<InstanceType<typeof ElForm>>()

const sidebarMenuList = computed(() => {
    return proxy?.$store.state.sidebarMenuList as Menu[];
})

const defaultOpenedIndexs = computed(() => {
    let openedIndexs = [] as string[];
    let collapsibleMenus = proxy?.$store.state.collapsibleMenus as Menu[];
    collapsibleMenus.forEach(menu => {
        openedIndexs.push(menu.code);
    })
    return openedIndexs;
})

const addTab = (title, path) => {
    // console.log('点击了' + title);
    // console.log(editableTabs)
    // editableTabs.findIndex(e => e.name == name)
    if (editableTabs.findIndex(e => e.name == path) === -1) {
        editableTabs.push({
            title: title,
            name: path
        })
    }
    editableTabsValue.value = path;
}

const removeTab = (targetName) => {
    const tabs = editableTabs;
    let activeName = editableTabsValue.value;
    if (activeName === targetName) {
        tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                    activeName = nextTab.name
                }
            }
        })
    }

    editableTabsValue.value = activeName
    let tabsTemp = tabs.filter((tab) => tab.name !== targetName)
    editableTabs.length = 0;
    for (let i = 0; i < tabsTemp.length; i++) {
        editableTabs.push(tabsTemp[i]);
    }
}

const clickTab = (target) => {
    router.push({path: target.props.name})
    // proxy.$router.push({path: target.props.name})
}

const cancel = () => {
    passwordDialogVisible.value = false;
    loading.value = false;
}

const handleFullScreen = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
        ElMessage('再次点击或按键盘左上角esc键即可退出全屏')
    }
}

const resetPasswordData = () => {
    passwordData.oldPassword = '';
    passwordData.newPassword = '';
    passwordData.newPasswordAgain = '';
}

const handleDropDownMenuCommand = (command: string) => {
    switch (command) {
        case '修改密码':
            resetPasswordData();
            passwordDialogVisible.value = true;
            break;
        case '退出登录':
            localStorage.clear();
            sessionStorage.clear();
            // proxy?.$store.commit();// 清空vuex
            proxy?.$router.push({path: '/login'});
            break;
        default:
            break;
    }
}

const handleChangePassword = (formEl: InstanceType<typeof ElForm> | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {// 登录信息填写无误
            // changePassword()
        } else {
            return false
        }
    });
}

const changePassword = () => {
    loading.value = true;
    axios.post(
        '/web/user/password/change',
        qs.stringify({
            old_password: passwordData.oldPassword,
            new_password: passwordData.newPassword,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }
    ).then(response => {
        let result = response.data as Result;
        if (result.code == 0) {
            ElMessage({
                showClose: true,
                message: result.msg,
                type: 'success'
            })
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
    });
}

const getCurrentUserInfo = () => {
    axios.get('/user/info').then(response => {
        const result = response.data as Result;
        if (result.code == 0) {
            localStorage.setItem('user_info', JSON.stringify(result.data['userInfo']));
            currentUser.value = result.data['userInfo'] as User;
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
            type: 'warning'
        })
    });
}

onMounted(() => {
    getCurrentUserInfo();
    let userString = localStorage.getItem("user_info");
    if (userString) {
        currentUser.value = JSON.parse(userString) as User;
    }
    window.onresize = () => {
        isSidebarCollapse.value = document.body.clientWidth < 1000;
    }
})

onUpdated(() => {
    defaultActiveIndex.value = proxy?.$route.path;
})

</script>

<style scoped>
:root {
    --aside-background-color: #191a23;
}

.el-aside {
    background-color: #191a23;
}

#home-aside-logo-container {
    /*background-color: #14151c;*/
    background-color: var(--aside-background-color);
    height: 60px;
    padding: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}

#home-aside-logo {
    height: 36px;
}

#home-aside-scrollbar {
    height: calc(100vh - 110px);
    background-color: var(--aside-background-color);
}

#home-aside-menu {
    height: 100%;
    border-right: none;
}

/*#home-aside-menu .el-menu-item i {*/
/*    !* 图标默认颜色 *!*/
/*    !* color: var(--el-text-color-secondary); *!*/
/*    color: #fff;*/
/*}*/

#home-aside-menu .el-sub-menu__title i {
    color: #fff;
}

#home-aside-menu:not(.el-menu--collapse) {
    width: 220px;
}

#home-aside-collapse-container {
    background-color: #14151c;
    height: 50px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

#home-aside-collapse {
    color: var(--el-color-white);
}

#home-header-left-container {
    display: flex;
    /* 主轴方向，默认是row，从左到右 */
    flex-direction: row;
    /* 主轴子元素排列方式，默认是flex-start，靠左 */
    justify-content: flex-start;
    /* 子元素是否换行，默认是wrap，换行 */
    flex-wrap: nowrap;
    /* 侧轴排列方式 */
    align-items: center;
}

#home-header-right-container {
    display: flex;
    /* 主轴方向，默认是row，从左到右 */
    flex-direction: row;
    /* 主轴子元素排列方式，默认是flex-start，靠左 */
    justify-content: flex-end;
    /* 子元素是否换行，默认是wrap，换行 */
    flex-wrap: nowrap;
    /* 侧轴排列方式 */
    align-items: center;
}

#home-header-text {
    font-family: Anton;
    /*line-height: 20px;*/
    /*font-weight: bold;*/
}

#home-header-user {
    display: flex;
    /* 子元素是否换行，默认是wrap，换行 */
    flex-wrap: nowrap;
    /* 侧轴排列方式 */
    align-items: center;
    cursor: default;
}

</style>
