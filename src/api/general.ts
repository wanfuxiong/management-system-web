import axios from "@/http/axios";
import { CAPTCHA } from "@/api/url";
import Result from "@/interface/Result";

export const captcha = () => {
    return axios({
        url: CAPTCHA,
        method: "get",
    }).then((response) => {
        const result: Result = response.data;
        const captcha: Captcha = <Captcha>result.data;
        return Promise.resolve(captcha);
    });
};

// export const login = () => {
//     return axios({
//         url: LOGIN,
//         method: "post",
//     }).then((response) => {
//         const responseDeviceList: ResponseDeviceWithPoints[] = response.data;
//         return Promise.resolve(responseDeviceList);
//     });
// };
