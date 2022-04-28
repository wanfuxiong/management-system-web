import axios from "@/http/axios";

export const captcha = () => {
    return axios({
        url: CAPTCHA,
        method: "get",
    }).then((response) => {});
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
