class LoginData {
    private _username: string;
    private _password: string;
    private _captcha: string;
    private _captchaKey: string;

    constructor(
        username?: string,
        password?: string,
        captcha?: string,
        captchaKey?: string
    ) {
        this._username = username ? username : "";
        this._password = password ? password : "";
        this._captcha = captcha ? captcha : "";
        this._captchaKey = captchaKey ? captchaKey : "";
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get captcha(): string {
        return this._captcha;
    }

    set captcha(value: string) {
        this._captcha = value;
    }

    get captchaKey(): string {
        return this._captchaKey;
    }

    set captchaKey(value: string) {
        this._captchaKey = value;
    }
}

export default LoginData;
