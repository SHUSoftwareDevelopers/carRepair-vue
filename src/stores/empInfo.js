import { defineStore } from "pinia";
import { ref } from "vue";

const useEmpInfoStore = defineStore('empInfo',()=>{
    //定义状态相关的内容

    const empInfo = ref({})

    const setInfo = (newInfo)=>{
        empInfo.value = newInfo
    }

    const removeInfo = ()=>{
        empInfo.value = {}
    }

    return {empInfo,setInfo,removeInfo}
},{persist:true})

export default useEmpInfoStore
