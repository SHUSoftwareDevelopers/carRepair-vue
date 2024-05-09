import {createRouter,createWebHistory} from 'vue-router' 

import LoginVue from "@/views/Login.vue"
import LayoutVue from "@/views/Layout.vue"
import UserInfoVue from "@/views/user/UserInfo.vue"
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'

import ClientInfoManageVue from '@/views/client/ClientInfoManage.vue'
import ClientCarManageVue from '@/views/client/ClientCarManage.vue'
import ClientOwnCarVue from '@/views/client/ClientOwnCar.vue'

import EmpInfoManageVue from '@/views/emp/EmpInfoManage.vue'

import VehicleFaultVue from '@/views/repair/VehicleFault.vue'
import VehicleFaultDetailVue from '@/views/repair/VehicleFaultDetail.vue'

import EmpOngoingInfoVue from '@/views/emp/EmpOngoingInfo.vue'
import EmpQueryDispatchVue from '@/views/emp/EmpQueryDispatch.vue'
import EmpListBillsVue from '@/views/emp/EmpListBills.vue'

import ClientVehicleFaultVue from '@/views/client/ClientVehicleFault.vue'
import ClientRepairProgressVue from '@/views/client/ClientRepairProgress.vue'
import ClientBillsInfoVue from '@/views/client/ClientBillsInfo.vue'
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
        {path:'emp/infoManage',component:EmpInfoManageVue},
        {path:'repair/vehicleFault',component:VehicleFaultVue},
        {path:'repair/vehicleFaultDetail',component:VehicleFaultDetailVue},
        {path:'emp/ongoingInfo',component:EmpOngoingInfoVue},
        {path:'emp/queryDispatch',component:EmpQueryDispatchVue},
        {path:'client/vehicleFault',component:ClientVehicleFaultVue},
        {path:'client/repairProgress',component:ClientRepairProgressVue},
        {path:'client/clientBillsInfo',component:ClientBillsInfoVue},
        {path:'emp/listBills',component:EmpListBillsVue}
    ]}
]

//创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

//导出路由
export default router