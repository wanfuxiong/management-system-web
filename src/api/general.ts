import axios from "@/axios";
import { CAPTCHA, LOGIN } from "@/api/url";
import LoginData from "@/interface/request/LoginData";

export const captcha = () => {
    return axios({
        url: CAPTCHA,
        method: "get",
    }).then((result) => {
        const captcha: Captcha = <Captcha>result.data;
        return Promise.resolve(captcha);
    });
};

export const login = (data: LoginData) => {
    return axios({
        url: LOGIN,
        method: "post",
        params: data,
    }).then((result) => {
        return Promise.resolve(result);
    });
};
