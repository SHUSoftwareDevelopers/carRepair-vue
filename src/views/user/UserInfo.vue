<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js'
import useEmpInfoStore from '@/stores/empInfo.js'
import useClientInfoStore from '@/stores/clientInfo.js'
import router from '../../router';
import avatar from '@/assets/default.png'

const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})
const empInfoStore = useEmpInfoStore();
const clientInfoStore = useClientInfoStore();
const clientInfo = ref({...clientInfoStore.clientInfo})

const roleUser = ref('')
console.log(roleUser.value)
switch(userInfo.value.userType){
    case 0:
        roleUser.value='管理员'
        break
    case 1:
        roleUser.value='前台'
        break
    case 2:
        roleUser.value='机修工'
        break
    case 3:
        roleUser.value='焊工'
        break
    case 4:
        roleUser.value='漆工'
        break
    case 5:
        roleUser.value='业务员'
        break
    default:
        roleUser.value='客户'
        break
}
console.log(roleUser.value)

const rules = {
    username: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        {
            pattern: /^\S{3,10}$/,
            message: '昵称必须是3-10位的非空字符串',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入电话号码', trigger: 'blur' },
        { type: 'phone', message: '号码格式不正确', trigger: 'blur' }
    ]
}


//修改个人信息
import {userInfoUpdateService} from '@/api/common.js'
import {clientInfoUpdateService} from '@/api/client.js'
import {ElMessage} from 'element-plus'
const updateUserInfo = async()=>{
    //调用接口
    let result = await userInfoUpdateService(userInfo.value);

    if(userInfo.value.userType===6){
        console.log("okokok")
        await clientInfoUpdateService(clientInfo.value);
        clientInfoStore.setInfo(clientInfo.value)
    }
    ElMessage.success(result.msg?result.msg:"修改成功");

    //修改pinia中的个人信息
    userInfoStore.setInfo(userInfo.value)

    updateAvatar();
}

//头像上传
const uploadRef = ref()

import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();

//用户头像地址
const imgUrl= ref(userInfoStore.info.avatar)

//头像上传成功的回调函数
const uploadSuccess = (result)=>{
    imgUrl.value = result.data;
}

//头像修改
import {userAvatarUpdateService} from '@/api/common.js'
import SpaceItem from 'element-plus/es/components/space/src/item';
const updateAvatar = async()=>{
    //调用接口
    let result = await userAvatarUpdateService(imgUrl.value);
    //修改pinia中的数据
    userInfoStore.info.avatar=imgUrl.value;
}
</script>
<template>
    <el-card class="page-container" shadow="hover">
        <template #header>
            <div class="header" style="color: #409eff; font-weight: bold;">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="8">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登录账号">
                        <el-input v-model="userInfo.account" disabled :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="角色">
                        <el-input v-model="roleUser" disabled :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="用户昵称" prop="username">
                        <el-input v-model="userInfo.username" :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="用户邮箱" prop="email">
                            <el-input v-model="userInfo.email" :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="用户电话" prop="phone">
                        <el-input v-model="userInfo.phone" :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row v-if="userInfo.userType!==6">
            <el-col :span="8">
                <el-form :model="empInfoStore.empInfo" label-width="100px" size="large">
                    <el-form-item label="员工ID" prop="empId">
                        <el-input v-model="empInfoStore.empInfo.empId" disabled :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-form :model="empInfoStore.empInfo" label-width="100px" size="large">
                    <el-form-item label="真实姓名" prop="empName">
                            <el-input v-model="empInfoStore.empInfo.empName" disabled :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row v-if="userInfo.userType===6">
            <el-col :span="8">
                <el-form :model="clientInfo" label-width="100px" size="large">
                    <el-form-item label="客户ID" prop="clientId">
                        <el-input v-model="clientInfo.clientId" disabled :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-form :model="clientInfo" label-width="100px" size="large">
                    <el-form-item label="真实姓名" prop="clientName">
                            <el-input v-model="clientInfo.clientName" disabled :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-form :model="clientInfo" label-width="100px" size="large">
                    <el-form-item label="客户类型" prop="clientType">
                            <el-input v-model="clientInfo.clientType" disabled :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row v-if="userInfo.userType===6">
            <el-col :span="8">
                <el-form :model="clientInfo" label-width="100px" size="large">
                    <el-form-item label="折扣率" prop="discountRate">
                        <el-input v-model="clientInfo.discountRate" disabled :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-form :model="clientInfo" label-width="100px" size="large">
                    <el-form-item label="业务联系人" prop="businessContact">
                            <el-input v-model="clientInfo.businessContact" :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-form :model="clientInfoo" label-width="100px" size="large">
                    <el-form-item label="业务联系电话" prop="businessTele">
                            <el-input v-model="clientInfo.businessTele" :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col span="24">
                <el-upload 
                        ref="uploadRef"
                        class="avatar-uploader"
                        :show-file-list="false"
                        :auto-upload="true"
                        action="/api/upload"
                        name="image"
                        :headers="{'Authorization':tokenStore.token}"
                        :on-success="uploadSuccess"
                        >
                        <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                        <img v-else :src="avatar" width="278" />
                    </el-upload>
                    <br><br>
            </el-col>
        </el-row>
        <el-row>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="updateUserInfo">提交修改</el-button>     
        </el-row>  
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
            margin-right: 100px;
            margin-left: 100px;
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}

.el-input{
    --el-input-border-radius: 20px;
}
</style>
