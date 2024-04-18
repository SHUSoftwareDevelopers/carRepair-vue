import {createRouter,createWebHistory} from 'vue-router' 

import LoginVue from "@/views/Login.vue"
import LayoutVue from "@/views/Layout.vue"
import UserInfoVue from "@/views/user/UserInfo.vue"
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'

//定义路由关系
const routes = [
    {path:'/login', component:LoginVue},
    {path:'/', component:LayoutVue,redirect:'/user/info', children:[
        {path:'/user/info',component:UserInfoVue},
        {path:'/user/resetPassword',component:UserResetPasswordVue}
    ]}
]

//创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

//导出路由
export default router