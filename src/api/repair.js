import request from "@/utils/request.js"

export const vehicleFaultListService = (params)=>{
    return request.get('/frontDesk/listMaintenanceAttorney',{params:params});
}

export const addCarFaultService = (carFaultInfo)=>{
    return request.post('/emp/addMaintenanceAttorney',carFaultInfo);
}

export const getAllVinService = ()=>{
    return request.get('/frontDesk/getVinList');
}

export const carFaultUpdateService = (carFaultData)=>{
    return request.put('/emp/updateMaintenanceAttorney',carFaultData);
}