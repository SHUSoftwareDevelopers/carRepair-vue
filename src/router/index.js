import {createRouter,createWebHistory} from 'vue-router' 

import LoginVue from "@/views/Login.vue"
import LayoutVue from "@/views/Layout.vue"
import UserInfoVue from "@/views/user/UserInfo.vue"
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'

import ClientInfoManageVue from '@/views/client/ClientInfoManage.vue'
import ClientCarManageVue from '@/views/client/ClientCarManage.vue'
import ClientOwnCarVue from '@/views/client/ClientOwnCar.vue'

import EmpInfoManageVue from '@/views/emp/EmpInfoManage.vue'
import QueryRepairProgressVue from '@/views/client/QueryRepairProgress.vue'

import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'

//定义路由关系
const routes = [
    {path:'/login', component:LoginVue},
    {path:'/', component:LayoutVue,redirect:'/user/resetPassword', children:[
        {path:'/user/info',component:UserInfoVue},
        {path:'/user/resetPassword',component:UserResetPasswordVue},
        {path:'/client/infoManage',component:ClientInfoManageVue},
        {path:'client/carManage',component:ClientCarManageVue},
        {path:'client/ownCar',component:ClientOwnCarVue},
        {path: 'emp/infoManage', component: EmpInfoManageVue},
        {path:'client/QueryRepairProgress', component: QueryRepairProgressVue}
    ]}
]

//创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

//导出路由
export default router