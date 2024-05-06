//定义store
import { defineStore } from "pinia";
import { ref } from "vue";

export const useVfiStore = defineStore('vfi',()=>{
    //定义状态的内容

    //1.响应式变量
    const vfi = ref('')

    //2.定义一个函数，修改token的值
    const setVfi = (newVfi)=>{
        vfi.value=newVfi
    }

    //3.函数，移除token的值
    const removeVfi = ()=>{
        vfi.value=''
    }

    return {
        vfi,setVfi,removeVfi
    }
},{
    persist:true//持久化存储
});