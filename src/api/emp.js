import request from "@/utils/request.js"

export const empInfoService = ()=>{
    return request.get('/emp/queryInfo');
}
