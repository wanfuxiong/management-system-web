export const stringDate2millisecond = (date: string) => {
    const f = date.split(' ', 2)
    const d = (f[0] ? f[0] : '').split('-', 3)
    const t = (f[1] ? f[1] : '').split(':', 3)
    return (new Date(
        parseInt(d[0], 10),
        (parseInt(d[1], 10) || 1) - 1,
        parseInt(d[2], 10),
        parseInt(t[0], 10),
        parseInt(t[1], 10),
        parseInt(t[2], 10)
    )).getTime()
}

export const date2StringDate = (date: Date): string => {
    const y = String(date.getFullYear())
    const m = String(date.getMonth() + 1)
    const d = String(date.getDate())
    const hour = String(date.getHours())
    const minute = String(date.getMinutes())
    const second = String(date.getSeconds())
    return y + '-' +
        (m.length === 2 ? m : '0' + m) + '-' +
        (d.length === 2 ? d : '0' + d) + ' ' +
        (hour.length === 2 ? hour : '0' + hour) + ':' +
        (minute.length === 2 ? minute : '0' + minute) + ':' +
        (second.length === 2 ? second : '0' + second)
}

export const millisecond2StringDate = (ms: number): string => {
    return date2StringDate(new Date(ms))
}

// export const date2String =(fmt, date)=> {
//     let ret;
//     const opt = {
//         'Y+': date.getFullYear().toString(), // 年
//         'm+': (date.getMonth() + 1).toString(), // 月
//         'd+': date.getDate().toString(), // 日
//         'H+': date.getHours().toString(), // 时
//         'M+': date.getMinutes().toString(), // 分
//         'S+': date.getSeconds().toString(), // 秒
//         W: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()]
//         // 有其他格式化字符需求可以继续添加，必须转化成字符串
//     }
//     for (const k in opt) {
//         ret = new RegExp('(' + k + ')').exec(fmt)
//         if (ret) {
//             fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
//         }
//     }
//     return fmt
// }
