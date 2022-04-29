<template>
    <el-container style="height: 100vh; background: #f6f6f6">
        <el-header>
            <el-row style="height: 100%">
                <Logo />
            </el-row>
        </el-header>
        <el-main>
            <el-scrollbar>
                <div id="login-body">
                    <el-card id="login-card">
                        <div id="login-card-header">登录</div>
                        <el-form
                            ref="loginFormRef"
                            :model="loginData"
                            :rules="rules"
                        >
                            <el-form-item prop="username">
                                <!--type属性和vue无关-->
                                <el-input
                                    v-model="loginData.username"
                                    placeholder="用户名"
                                    class="w-50 m-2"
                                    prefix-icon="User"
                                    type="text"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <!--type属性和vue无关-->
                                <el-input
                                    v-model="loginData.password"
                                    placeholder="密码"
                                    class="w-50 m-2"
                                    prefix-icon="Lock"
                                    type="password"
                                    clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item prop="captcha">
                                <!--type属性和vue无关-->
                                <el-input
                                    v-model="loginData.captcha"
                                    placeholder="验证码"
                                    style="width: 140px"
                                    type="text"
                                    @keyup.enter="handleLogin(loginFormRef)"
                                    clearable
                                ></el-input>
                                <div
                                    id="login-captcha"
                                    @click="updateCaptcha()"
                                >
                                    <el-image
                                        :src="captchaImg"
                                        fit="cover"
                                        style="width: 120px; height: 32px"
                                    >
                                        <template #error>
                                            <div
                                                v-if="captchaLoading"
                                                class="image-slot"
                                            >
                                                <el-icon class="is-loading">
                                                    <Loading />
                                                </el-icon>
                                            </div>
                                            <div v-else class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    :loading="loading"
                                    type="primary"
                                    @click="handleLogin(loginFormRef)"
                                    style="width: 100%"
                                >
                                    登录
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </div>
                <Footer />
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import router from "@/router";
import { ElForm, ElNotification } from "element-plus";
import Logo from "@/components/IndexLink.vue";
import Footer from "@/components/Footer.vue";
import { captcha, login } from "@/api/general";
import LoginData from "@/interface/request/LoginData";
import { ElMessage } from "element-plus/es";

const loginFormRef = ref<InstanceType<typeof ElForm>>();

const loading = ref(false);

const captchaLoading = ref(false);

const loginData = reactive<LoginData>(
    new LoginData("fx_wan@foxmail.com", "88888888", "ab12", "")
);

const rules = {
    username: [
        {
            message: "请输入用户名",
            required: true,
            trigger: "blur", // trigger；离开时触发
        },
        // {
        //     // 这个type会让element-ui检测格式
        //     type: "email",
        //     message: "用户名格式不正确",
        //     trigger: 'blur'
        // }
    ],
    password: [
        {
            required: true,
            message: "请输入密码",
            trigger: "blur",
        },
        {
            min: 6,
            max: 16,
            message: "密码长度应是6 - 16位",
            trigger: "blur",
        },
        {
            message: "密码只能包含大小写英文字母、数字或~!@#$%^&*_-=+?,.;:",
            pattern: "^[a-zA-Z0-9！@#$%^&*-=_+;:,./?]+$",
        },
    ],
    captcha: [
        {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
        },
        {
            min: 4,
            max: 4,
            message: "验证码长度是4位",
            trigger: "blur",
        },
    ],
};

const captchaImg = ref("");

const openNotification = () => {
    ElNotification({
        title: "使用须知",
        dangerouslyUseHTMLString: true,
        message:
            "<div>" +
            "<p><strong>用户名：888888</strong></p>" +
            "<p><strong>密码：88888888</strong></p>" +
            "</div>",
        duration: 0,
    });
};

const updateCaptcha = () => {
    captchaLoading.value = true;
    captcha()
        .then((captcha: Captcha) => {
            captchaImg.value = captcha.captchaImg;
            loginData.captchaKey = captcha.captchaKey;
            captchaLoading.value = false;
        })
        .catch((error) => {
            captchaLoading.value = false;
        });
};

const startLogin = () => {
    loading.value = true;
    login(loginData)
        .then((result) => {
            ElMessage({
                showClose: true,
                message: "欢迎",
                type: "success",
            });
            loading.value = false;
        })
        .catch((error) => {
            loading.value = false;
        });
};

const handleLogin = (formEl: InstanceType<typeof ElForm> | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            // 登录信息填写无误
            startLogin();
        } else {
            return false;
        }
    });
};

onMounted(() => {
    // openNotification();
    updateCaptcha();
});
</script>

<style scoped>
#login-body {
    height: calc(100vh - 120px);
    min-height: 400px;
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    align-items: center;
    overflow: hidden;
}

#login-card-header {
    font-size: var(--el-font-size-large);
    font-weight: bold;
    margin-bottom: 16px;
}

#login-card {
    width: 320px;
    height: auto;
}

#login-captcha {
    width: 120px;
    height: 32px;
    cursor: pointer;
    margin-left: 20px;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: var(--el-text-color-secondary);
    font-size: 14px;
}
</style>
