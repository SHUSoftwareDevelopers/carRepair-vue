import request from "@/utils/request.js"

export const clientInfoService = ()=>{
    return request.get('/client/queryInfo');
}

export const clientInfoUpdateService = (clientInfoData)=>{
    return request.put('/client/updateInfo',clientInfoData)
}