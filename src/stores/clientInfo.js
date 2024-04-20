import { defineStore } from "pinia";
import { ref } from "vue";

const useClientInfoStore = defineStore('clientInfo',()=>{
    //定义状态相关的内容

    const clientInfo = ref({})

    const setInfo = (newInfo)=>{
        clientInfo.value = newInfo
    }

    const removeInfo = ()=>{
        clientInfo.value = {}
    }

    return {clientInfo,setInfo,removeInfo}
},{persist:true})

export default useClientInfoStore
