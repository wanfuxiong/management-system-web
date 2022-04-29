class LoginData {
    username: string;
    password: string;
    captcha: string;
    captchaKey: string;

    constructor(
        username?: string,
        password?: string,
        captcha?: string,
        captchaKey?: string
    ) {
        this.username = username ? username : "";
        this.password = password ? password : "";
        this.captcha = captcha ? captcha : "";
        this.captchaKey = captchaKey ? captchaKey : "";
    }
}

export default LoginData;
