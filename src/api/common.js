import request from "@/utils/request.js"

//调用注册接口
export const userRegisterService = (registerData)=>{
    //借助UrlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
    return request.post('/common/register',params);
}

//调用登录接口
export const userLoginService = (loginData)=>{
    const params = new URLSearchParams()
    for(let key in loginData){
        params.append(key,loginData[key]);
    }
    return request.post('/common/login',params);
}

//获取个人信息
export const userInfoService = ()=>{
    return request.get('/common/queryInfo');
}

//修改密码
export const userResetPasswordService = (modifyData)=>{
    const params = new URLSearchParams()
    for(let key in modifyData){
        params.append(key,modifyData[key]);
    }
   return request.patch('/common/updatePwd',params);
}

//修改用户个人信息
export const userInfoUpdateService = (userInfoData)=>{
    return request.put('/common/updateInfo',userInfoData)
}

//修改头像
export const userAvatarUpdateService = (avatarUrl)=>{
    const params = new URLSearchParams();
    params.append('avatarUrl',avatarUrl);
    return request.patch('/common/updateAvatar',params);
}   