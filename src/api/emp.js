import request from "@/utils/request.js"

export const empInfoService = ()=>{
    return request.get('/emp/queryMyInfo');
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

export const queryRepairProgressService = (vfi) =>{
    return request.get('/emp/empQueryMaintenanceProgress?vfi='+vfi);
}

export const addRepairAuthorizationService = (raData)=>{
    return request.post('/emp/addRepairAuthorization',raData);
}

export const updateRepairAuthorizationService = (raData)=>{
    return request.put('/emp/updateRepairAuthorization',raData);
}

export const addRepairTaskService = (rtData)=>{
    return request.post('/emp/addRepairTask',rtData);
}

export const updateRepairTaskService = (rtData)=>{
    return request.put('/emp/updateRepairTask',rtData);
}

export const addDispatchService = (dispatchData)=>{
    return request.post('/emp/addDispatchOrder',dispatchData);
}

export const assignDispatchService = (dispatchData)=>{
    return request.put('/emp/assignDispatchOrder',dispatchData);
}

export const updateDispatchService = (dispatchData)=>{
    return request.put('/emp/updateDispatchOrder',dispatchData);
}

export const ownOngoingInfoListService = (params)=>{
    return request.get('/emp/empQueryOnGoingTable',{params:params})
}

export const ongoingUpdateService = (ogData)=>{
    return request.put('/emp/updateOnGoingTable',ogData)
}

export const dispatchOrderListService = (params)=>{
    return request.get('/emp/queryDispatchOrder',{params:params})
}

export const getRepairItemService = (riid)=>{
    return request.get('/emp/getRepairItemByRiid?riid='+riid)
}

export const applyOrderService = (applyData)=>{
    return request.put('/emp/applyDispatchOrder',applyData)
}

export const ListBillsService = (params)=>{
    return request.get('/emp/listBills',{params:params})
}

export const queryVehicleFaultInfoByVFId = (vfi) => {
    return request.get('/client/findFault/' + vfi);
}