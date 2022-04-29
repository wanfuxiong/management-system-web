import axios from "@/axios";
import { CAPTCHA, LOGIN } from "@/api/url";
import Result from "@/interface/Result";

export const captcha = () => {
    return axios({
        url: CAPTCHA,
        method: "get",
    }).then((result) => {
        const captcha: Captcha = <Captcha>result.data;
        return Promise.resolve(captcha);
    });
};

export const login = () => {
    return axios({
        url: LOGIN,
        method: "post",
    }).then((result) => {
        return Promise.resolve(result);
    });
};
