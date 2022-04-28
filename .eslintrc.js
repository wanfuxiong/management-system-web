module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "vue-eslint-parser",
    parserOptions: {
        ecmaVersion: "latest",
        parser: "@typescript-eslint/parser",
        sourceType: "module",
    },
    plugins: ["vue", "@typescript-eslint"],
    rules: {
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-multiple-empty-lines": [2, { max: 3 }], // 空行最多不能超过多少行
        "no-undef": "off",
        "no-unused-vars": "off", // 不能有声明后未被使用的变量或参数
        "vue/multi-word-component-names": "off",
        "vue/no-multiple-template-root": "off", // 不能有多个根元素
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/ban-ts-comment": "off",
    },
};
