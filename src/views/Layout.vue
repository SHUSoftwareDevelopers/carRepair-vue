<script setup>
import avatar from '@/assets/default.png'

import { userInfoService } from '@/api/common.js';
import { empInfoService } from '@/api/emp.js'
import { clientInfoService } from '@/api/client.js'
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
import useEmpInfoStore from '@/stores/empInfo.js'
import useClientInfoStore from '@/stores/clientInfo.js'
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
const empInfoStore = useEmpInfoStore();
const clientInfoStore = useClientInfoStore();
//调用函数，获取用户详细信息
const getUserInfo = async () => {
    //调用接口
    const result = await userInfoService();
    //数据存储到pinia
    userInfoStore.setInfo(result.data)
}
getUserInfo();

const getUniqueInfo = async () => {
    getUserInfo();
    if(userInfoStore.info.userType!==6){
        const result = await empInfoService();
        console.log("请求了员工数据")
        console.log(result.data)
        empInfoStore.setInfo(result.data)
    }
    else{
        const result = await clientInfoService();
        console.log("请求了客户数据")
        console.log(result.data)
        clientInfoStore.setInfo(result.data)
    }
}

getUniqueInfo();

//条目被点击后，调用的函数
// import { userLogoutService } from '@/api/common.js';
import { useRouter } from 'vue-router';
const router = useRouter();
import { ElMessage, ElMessageBox, ElStep } from 'element-plus';
const handleCommand = (command) => {
    //判断指令
    if (command === 'logout') {
        //退出登录
        ElMessageBox.confirm(
            '您确认退出登录吗？',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(async () => {
            //退出登录
            // await userLogoutService();
            //1.清空pinia中存储的token以及个人信息
            tokenStore.removeToken();
            userInfoStore.removeInfo();
            //2.跳转到登录页面
            router.push('/login')
            ElMessage({
                type: 'success',
                message: "退出登录成功"
            })
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '用户已取消退出登录'
            })
        })
    } else {
        //路由
        router.push('/user/' + command)
    }
}
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router>
                    <el-menu-item index="/repair/vehicleFault" v-show="userInfoStore.info.userType==0||userInfoStore.info.userType==5">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>车辆故障管理</span>
                    </el-menu-item>
                <el-sub-menu index="3" v-show="userInfoStore.info.userType==0">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>员工管理</span>
                    </template>
                    <el-menu-item index="/emp/infoManage">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>信息管理</span>
                    </el-menu-item>
                </el-sub-menu>
                    <el-menu-item index="/emp/queryDispatch" v-show="userInfoStore.info.userType>=2&&userInfoStore.info.userType<=4">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>接单大厅</span>
                    </el-menu-item>
                <el-sub-menu index="2" v-show="userInfoStore.info.userType==0||userInfoStore.info.userType==1||userInfoStore.info.userType==5">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>客户管理</span>
                    </template>
                    <el-menu-item index="/client/infoManage">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>信息管理</span>
                    </el-menu-item>
                    <el-menu-item index="/client/carManage">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>车辆管理</span>
                    </el-menu-item>
                    <el-menu-item index="/emp/listBills">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>账单信息</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/client/vehicleFault" v-show="userInfoStore.info.userType==6">
                    <el-icon>
                        <Crop />
                    </el-icon>
                    <span>车辆维修信息</span>
                </el-menu-item>
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/client/ownCar" v-show="userInfoStore.info.userType==6">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>车辆信息</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>修改密码</span>
                    </el-menu-item>
                    <el-menu-item index="/emp/ongoingInfo" v-show="userInfoStore.info.userType>=2&&userInfoStore.info.userType<=4">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>维修记录</span>
                    </el-menu-item>
                    <el-menu-item index="/client/clientBillsInfo" v-show="userInfoStore.info.userType==6">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>我的账单</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>
                    <span v-show="userInfoStore.info.userType == 0">管理员：</span>
                    <span v-show="userInfoStore.info.userType == 1">前台：</span>
                    <span v-show="userInfoStore.info.userType == 2">机修工：</span>
                    <span v-show="userInfoStore.info.userType == 3">焊工：</span>
                    <span v-show="userInfoStore.info.userType == 4">漆工：</span>
                    <span v-show="userInfoStore.info.userType == 5">业务员：</span>
                    <span v-show="userInfoStore.info.userType == 6">客户：</span>
                    <strong>{{ userInfoStore.info.username }}</strong>
                </div>
                <!-- 下拉菜单 -->
                <!-- command: 条目被点击后会触发，在事件函数上可声明一个参数接收条目对应的指令 -->
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.avatar ? userInfoStore.info.avatar : avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="resetPassword" :icon="EditPen">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
                    内容展示区
                </div> -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/R-C.jpg') no-repeat center / 160px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>
