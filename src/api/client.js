import request from "@/utils/request.js"

export const clientInfoService = ()=>{
    return request.get('/client/queryInfo');
}

export const clientInfoUpdateService = (clientInfoData)=>{
    return request.put('/client/updateInfo',clientInfoData)
}

export const clientInfoListService = (params)=>{
    return request.get('/client/listClient',{params:params})
}

export const addClientService = (clientData)=>{
    const params = new URLSearchParams()
    for(let key in clientData){
        params.append(key,clientData[key]);
    }
    return request.post('/client/addClient',params)
}
