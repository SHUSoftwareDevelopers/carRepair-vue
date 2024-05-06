<script setup>
import { Edit, Delete,Aim,DArrowRight,Money } from "@element-plus/icons-vue";

import { ref } from "vue";

const repairStatus= ref("");

const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(5); //每页条数

const vehicleFaults = ref([]);
const vinList = ref([])
const onSizeChange = (size) => {
  pageSize.value = size;
  vehicleFaultList()
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  vehicleFaultList()
};
import { carFaultListService,payBillService} from '@/api/client.js'
const vehicleFaultList = async()=>{
    vinList.value = []
    let params = {
        page: pageNum.value,
        pageSize: pageSize.value,
        repairStatus: repairStatus.value
    }
    let result = await carFaultListService(params);
    total.value = result.data.total;
    vehicleFaults.value = result.data.rows;
    //数据处理
    for (let i = 0; i < vehicleFaults.value.length; i++) {
        if(vehicleFaults.value[i].maintenanceType == "0")
            vehicleFaults.value[i].maintenanceTypeName = "普通";
        else
            vehicleFaults.value[i].maintenanceTypeName = "加急";
        if(vehicleFaults.value[i].taskClassification == "0")
            vehicleFaults.value[i].taskClassificationName = "大";
        else if(vehicleFaults.value[i].taskClassification == "1")
            vehicleFaults.value[i].taskClassificationName = "中";
        else
            vehicleFaults.value[i].taskClassificationName = "小";
        if(vehicleFaults.value[i].paymentMethod == "0")
            vehicleFaults.value[i].paymentMethodName = "自付";
        else if(vehicleFaults.value[i].paymentMethod == "1")
            vehicleFaults.value[i].paymentMethodName = "三包";
        else
            vehicleFaults.value[i].paymentMethodName = "索赔";
        if(vehicleFaults.value[i].repairStatus == "0")
            vehicleFaults.value[i].repairStatusName = "未维修";
        else
            vehicleFaults.value[i].repairStatusName = "已维修";
        if(vehicleFaults.value[i].whetherPay == "0")
            vehicleFaults.value[i].whetherPayName = "未支付";
        else
            vehicleFaults.value[i].whetherPayName = "已支付";
    }
}
vehicleFaultList()

//故障信息跳转到详情页
import { useRouter } from "vue-router";
import { useVfiStore } from '@/stores/pageVfi.js'
import { ElMessage } from "element-plus";
const router = useRouter();
const vfiStore = useVfiStore();
const toDetail = (row) => {
    vfiStore.removeVfi();
    vfiStore.setVfi(row.vfi);
    router.push({path:'/client/repairProgress'});
}

//支付功能
const bill = ref({
  clientId: "",
  vfi:"",
  discountRate:"",
  paymentMethod:"",
  payment:""
});
const payBill = async(row)=>{
  bill.value.vfi = row.vfi;
  let result = await payBillService(bill.value);
  ElMessage.success(result.msg ? result.msg : "修改成功");
  vehicleFaultList();
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
        <div class="header" style="color: #409eff; font-weight: bold">
            <span>车辆维修信息</span>
        </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
        <el-form-item label="维修状态:">
            <el-select
            v-model="repairStatus"
            placeholder="请选择维修状态"
            style="width: 150px"
            >
                <el-option label="未完成" value="0" />
                <el-option label="已完成" value="1" />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="vehicleFaultList">搜索</el-button>
            <el-button
            @click="
                repairStatus = ''
            "
            >重置</el-button
            >
        </el-form-item>
        </el-form>
        <!-- 车辆故障列表 -->
        <el-table :data="vehicleFaults" style="width: 100%">
        <el-table-column label="车辆故障号" prop="vfi"></el-table-column>
        <el-table-column label="车架号" prop="vin" width="200"></el-table-column>
        <el-table-column label="维修类型" prop="maintenanceTypeName"></el-table-column>
        <el-table-column label="作业分类" prop="taskClassificationName"></el-table-column>
        <el-table-column label="结算方式" prop="paymentMethodName"></el-table-column>
        <el-table-column label="维修状态" prop="repairStatusName"></el-table-column>
        <el-table-column label="是否支付" prop="whetherPayName"></el-table-column>
        <el-table-column label="支付/详情" width="100">
            <template #default="{row}"> 
                <div v-if="row.repairStatus==0">
                    <el-button :icon="Money" circle plain type="primary" disabled></el-button>
                    <el-button :icon="DArrowRight" circle plain type="success" @click="toDetail(row)"></el-button>
                </div>
                <div v-else>
                    <el-button :icon="Money" circle plain type="primary" @click="payBill(row)"></el-button>
                    <el-button :icon="DArrowRight" circle plain type="success" @click="toDetail(row)"></el-button>
                </div>
            </template>
        </el-table-column>
        <template #empty>
            <el-empty description="没有数据" />
        </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 10, 15]"
        layout="jumper, total, sizes, prev, pager, next"
        background
        :total="total"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
        />
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.el-input {
  --el-input-border-radius: 20px;
}
.el-autocomplete {
    --el-autocomplete-border-radius: 20px;
}
</style>