import axios from "axios";
import router from "@/router";
import { ElMessage } from "element-plus";
import Result from "@/interface/result";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL as string;

const request = axios.create({
    timeout: parseInt(import.meta.env.VITE_TIMEOUT as string),
    headers: {
        "Content-Type": "application/json; charset=utf-8",
    },
});

// 前置拦截
request.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers["Authorization"] = token;
    }
    return config;
});

// 后置拦截
request.interceptors.response.use(
    (response) => {
        // 后端正常，响应200
        const result: Result = response.data;
        return Promise.resolve(result);
    },
    (error) => {
        if (error.response) {
            // 后端正常，响应非200
            const result: Result = error.response.data;
            const status = error.response.status;
            switch (status) {
                case 401:
                    router.push({ path: "/login" });
                // switch穿透，不要break
                case 400:
                case 403:
                    ElMessage({
                        showClose: true,
                        message: status + " - " + result.msg,
                        type: "error",
                    });
                    break;
                default:
                    ElMessage({
                        showClose: true,
                        message: status + " - " + error.response.data,
                        type: "error",
                    });
            }
        } else {
            // 后端不正常（很可能是没开后端）的情况
            ElMessage({
                showClose: true,
                message: "服务器内部错误",
                type: "error",
            });
        }
        return Promise.reject(error);
    }
);

export default request;
