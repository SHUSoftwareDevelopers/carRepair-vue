//定义store
import { defineStore } from "pinia";
import { ref } from "vue";

export const useVehicleFaultStore = defineStore('vehicleFault',()=>{
    //定义状态的内容

    //1.响应式变量
    const vehicleFault = ref('')

    //2.定义一个函数，修改token的值
    const setvehicleFault = (newVehicleFault)=>{
        vehicleFault.value=newVehicleFault
    }

    //3.函数，移除token的值
    const removevehicleFault = ()=>{
        vehicleFault.value=''
    }

    return {
        vehicleFault,setvehicleFault,removevehicleFault
    }
},{
    persist:true//持久化存储
});