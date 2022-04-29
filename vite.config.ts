import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [vue()],
    resolve: {
        // 配置路径别名
        alias: {
            "@": resolve(__dirname, "./src"),
        },
        // 省略后缀
        extensions: [".vue", ".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    build: {
        minify: "terser",
        terserOptions: {
            compress: {
                // 生产环境移除console.log
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
});
