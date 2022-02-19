import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import store from "@/store"
import axios from "@/axios";
import Result from "@/interface/result";
import Menu from "@/interface/menu";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Index',
        component: () => import('@/views/Index.vue'),
        children: [
            {
                path: '',
                name: 'Index',
                component: () => import( '@/views/index/Index.vue'),
                meta: {
                    title: '管理系统',
                    keepalive: true
                },
            },
            {
                path: '/app',
                name: 'App',
                component: () => import( '@/views/index/App.vue'),
                meta: {
                    title: '管理系统 - 移动端App',
                    keepalive: true
                }
            },
            // {
            //     path: '/doc',
            //     name: 'Doc',
            //     component: () => import( '@/views/index/Doc.vue'),
            //     meta: {
            //         title: '管理系统 - 帮助文档',
            //         keepalive: true
            //     }
            // },
            {
                path: '/about',
                name: 'About',
                component: () => import( '@/views/index/About.vue'),
                meta: {
                    title: '管理系统 - 关于',
                    keepalive: true
                },
            },
            {
                path: '/donate',
                name: 'Donate',
                component: () => import( '@/views/index/Donate.vue'),
                meta: {
                    title: '管理系统 - 捐助',
                    keepalive: true
                },
            },
        ]
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        children: [
            {
                path: '',
                name: 'Welcome',
                component: () => import('@/views/home/Welcome.vue'),
                meta: {
                    title: '管理系统 - 欢迎',
                    keepalive: true
                },
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: {
            title: '管理系统 - 登录',
            keepalive: true
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/404.vue'),
        meta: {
            title: '页面被怪兽吃掉了'
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 白名单列表，访问以下路由不需要登录，更不会验证token有效性
const whiteListRoutes = ['/', '/about', '/app', '/doc', '/donate', '/test'];

// 在访问每个页面前，都会执行下面这个方法，新建空项目时，该方法是没有的，需要自己写
router.beforeEach((to, from, next) => {
    // // 设置浏览器标签的里文字
    // if (to.meta.title) {
    //     document.title = <string>to.meta.title;
    // }

    let token = localStorage.getItem('token');
    if (whiteListRoutes.indexOf(to.path) != -1) {// 只有这些页面才允许不登陆的情况下访问
        next();
    } else {
        if (token) {
            // console.log("有token")

            // 看看vuex中有没有路由。因为当点击浏览器刷新按钮时，vuex中的数据会被清除。
            if (!store.state.sidebarMenuList?.length) {
                // console.log("vuex没有路由")
                // 向服务端发送请求校验token、获取路由后添加到vuex中
                axios.get('/web/sidebar')
                    .then((response) => {
                        let result = response.data as Result;
                        // console.log(result);
                        if (result.code == 0) {// token有效
                            if (to.path == '/login') {// 访问的是登录页面就跳到Home，可以开始正常使用国建安全培训各项功能
                                next({path: '/home'});
                            } else {// 别的页面随便访问，因为已经登录并且token有效

                                // 后端根据用户权限返回该用户有权显示的侧边栏，并存放到vuex中，以供全局使用
                                // 前端根据从后端返回的侧边栏数据进行路由动态绑定，并在Home页面中渲染，这样对应的用户才能通过存在的路由访问对应的页面

                                // 存入vuex
                                store.commit("setSidebarMenuList", result.data['sidebarMenuList'])
                                store.commit("setAuthorities", result.data['authorities'])

                                // 动态添加路由
                                result.data['sidebarMenuList'].forEach((menuItem: Menu) => {
                                    if (menuItem.children.length > 0) {// 有子级菜单
                                        // console.log('有子级菜单')
                                        menuItem.children.forEach(child => {
                                            // 转换路由
                                            let route = convertMenuToRoute(child);
                                            // 添加路由
                                            if (route) {
                                                router.addRoute("Home", route);
                                            }
                                        })
                                    } else {// 没有子级菜单
                                        // console.log('没有子级菜单')
                                        // 转换路由
                                        let route = convertMenuToRoute(menuItem);
                                        // 添加路由
                                        if (route) {
                                            router.addRoute("Home", route);
                                        }
                                    }
                                });

                                // console.log(store.state.sidebarMenuList);

                                next({path: to.path});// 一定要这么写，不能写next()
                            }
                        } else if (result.code == 1) {// token失效
                            alert(result.msg);
                            localStorage.removeItem('user_info');
                            localStorage.removeItem('token');
                            next({path: '/login'});
                        } else {
                            alert(result.msg);
                        }
                    })
                    .catch(error => {
                        if (error.response) {
                            // 如果服务端告诉用户Token失效
                            if (error.response.status == 403 &&
                                from.path == '/' &&
                                to.path == '/login'
                            ) {
                                localStorage.removeItem('user_info');
                                localStorage.removeItem('token');
                                next({path: '/login'})
                            }
                        }

                        // if (error.response) {// 后端正常的情况
                        //     const status = error.response.status
                        //     switch (status) {
                        //         case 400:
                        //         case 401:
                        //         case 403:
                        //             localStorage.removeItem('user_info');
                        //             localStorage.removeItem('token');
                        //             next({path: '/login'});
                        //             break;
                        //     }
                        // } else {// 后端不正常（很可能是没开后端）的情况，跳转到首页
                        //     next({path: '/'});
                        // }
                    })
            } else {
                // console.log("vuex存有路由")
                if (to.path == '/login') {// 访问的是登录页面就跳到Home，可以开始正常使用各项功能
                    next({path: '/home'});
                } else {
                    next();
                }
            }
        } else {
            // console.log("无token")
            if (to.path == '/login') {
                // console.log('无token进入了Login')
                next();
            } else {
                // console.log('无token进入了别的界面')
                next({path: '/login'});
                // alert('请先登录');
            }
        }
    }
})

// 将后端传来的侧边栏类型数据转换为路由类型的数据
const convertMenuToRoute = (menuItem: Menu) => {
    if (menuItem.path == '' || menuItem.path == null) {
        return null;
    } else {
        // console.log('../views' + menuItem.path.substring(0, menuItem.path.lastIndexOf('/') + 1) + menuItem.name + '.vue')
        return {
            // path: menuItem.path.substr('/home/'.length),
            path: menuItem.path,
            name: menuItem.name,
            // component: () => import( '../views' + menuItem.path.substring(0, menuItem.path.lastIndexOf('/') + 1) + menuItem.name + '.vue'),
            component: () => import('../views/home/' + menuItem.name + '.vue'),
            meta: {
                title: menuItem.title,
                keepalive: true
            }
        };
    }
}

export default router
