import {createStore, Store} from 'vuex'
import Menu from "@/interface/menu";

// https://next.vuex.vuejs.org/zh/guide/typescript-support.html
declare module '@vue/runtime-core' {
    // 声明自己的 store state
    interface State {
        token: string
        authorities: string[]
        sidebarMenuList: Menu[]
        collapsibleMenus: Menu[]
    }

    // 为 `this.$store` 提供类型声明
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}

export default createStore({
    state: {
        token: "",
        authorities: [] as string[],
        sidebarMenuList: [] as Menu[],
        collapsibleMenus: [] as Menu[],
    },
    mutations: {
        setToken: (state, token) => {
            state.token = token;
            localStorage.setItem("token", token)
        },
        setSidebarMenuList: (state, sidebarMenuList) => {
            state.sidebarMenuList = sidebarMenuList;
            sidebarMenuList.forEach(sidebarMenuItem => {
                if (sidebarMenuItem.type === 0 && sidebarMenuItem.path === null) {
                    state.collapsibleMenus.push(sidebarMenuItem);
                }
            })
        },
        setAuthorities: (state, authorities) => {
            state.authorities = authorities;
        },

        resetState: (state) => {
            state.token = "";
            state.authorities = [];
            state.sidebarMenuList = [];
            state.collapsibleMenus = [];
        }
    },
    actions: {},
    modules: {}
})
