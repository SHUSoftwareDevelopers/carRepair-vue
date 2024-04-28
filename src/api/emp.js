import request from "@/utils/request.js"

export const empInfoService = ()=>{
    return request.get('/emp/queryInfo');
}

export const empInfoListService = (params)=>{
    return request.get('/emp/queryList',{params:params});
}

export const addEmpService = (empData)=>{
    const params = new URLSearchParams()
    for(let key in empData){
        params.append(key,empData[key]);
    }
    return request.post('/emp/addEmp',params)
}

export const empInfoUpdateService = (empInfoData) =>{
    return request.put('/emp/update',empInfoData);
}