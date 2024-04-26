<script lang="ts" setup>
import { ref } from "vue";

//定义数据模型  修改密码
const modifyData = ref({
    oldPwd:'',
    newPwd:'',
    rePwd:''
})

//校验密码函数  修改密码
const checkRePassword = (rule,value,callback) => {
    if(value===''){
        callback(new Error('请再次确认新密码'))
    }else if(value !== modifyData.value.newPwd){
        callback(new Error('请确保两次输入的密码一样'))
    }else{
        callback()
    }
}

//定义表单校验规则  修改密码
const rules = {
    oldPwd:[
        {required:true, message:'请输入新密码', trigger:'blur'},
        {min:5, max:16, message:'密码应为5~16位非空字符', trigger:'blur'}
    ],
    newPwd:[
        {required:true, message:'请输入新密码', trigger:'blur'},
        {min:5, max:16, message:'密码应为5~16位非空字符', trigger:'blur'}
    ],
    rePwd:[
        {validator:checkRePassword,trigger:'blur'}
    ]
}

//修改密码
import { userResetPasswordService } from '../../api/common.js';
import { ElMessage } from "element-plus";
import useUserInfoStore from '../../stores/userInfo.js'
const userInfoStore = useUserInfoStore();
import { useTokenStore } from '../../stores/token.js';
import {useRouter} from 'vue-router'
const router = useRouter()
const tokenStore = useTokenStore();
const modifyPassword = async()=>{
    //调用接口
    let result = await userResetPasswordService(modifyData.value);
    if(result.code === 1){
        ElMessage.success(result.msg?result.msg:"修改成功")
        //清空pinia中的个人信息
        userInfoStore.removeInfo();

        //清空pinia中存的token
        tokenStore.removeToken();

        //路由到登录界面
        router.push('/login')
    }else{
        ElMessage.error(result.msg?result.msg:"修改失败")
    }
    
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header" style="color: #409eff; font-weight: bold;">
                <span>修改密码</span>
            </div>
        </template>
        <el-col :span="12">
            <el-form label-width="100px" size="large" :model="modifyData" :rules="rules">
                <el-form-item label="原密码" prop="oldPwd">
                    <el-input v-model="modifyData.oldPwd" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input v-model="modifyData.newPwd" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="rePwd">
                    <el-input v-model="modifyData.rePwd" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="modifyPassword">提交修改</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-card>
</template> 

<style scoped>
.el-input{
    --el-input-border-radius: 20px;
}
</style>