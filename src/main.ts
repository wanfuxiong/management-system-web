import {createApp} from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import * as ElIconModules from '@element-plus/icons-vue'
import '@/assets/fonts/font.css'
import '@/assets/css/reset.css'
import '@/assets/css/theme.css'
import '@/assets/css/element.css'
import '@/assets/css/my.css'
import Aaa from '@/components/dialog/Aaa.vue'
import Bbb from '@/components/dialog/Bbb.vue'
import DeleteUser from '@/components/dialog/user/DeleteUser.vue'
import ResetPassword from '@/components/dialog/user/ResetPassword.vue'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(ElementPlus, {locale})
app.mount('#app')
app.component('Aaa', Aaa)
app.component('Bbb', Bbb)
app.component('DeleteUser', DeleteUser)
app.component('ResetPassword', ResetPassword)

// 统一注册Icon图标
for (const iconName in ElIconModules) {
    if (Reflect.has(ElIconModules, iconName)) {
        const item = ElIconModules[iconName]
        app.component(iconName, item)
    }
}
//
// router.beforeEach((to, from, next) => {
//     // 设置浏览器标签的里文字
//     if (to.meta.title) {
//         // @ts-ignore
//         document.title = to.meta.title;
//     }
//     next();
// })
