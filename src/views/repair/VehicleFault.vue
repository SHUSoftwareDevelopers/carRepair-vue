<script setup>
import { Edit, Delete,Aim,DArrowRight,Select } from "@element-plus/icons-vue";

import { ref } from "vue";

const maintenanceType = ref("");
const taskClassification = ref("");
const paymentMethod = ref("");
const vin = ref("");

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
import { vehicleFaultListService,addCarFaultService,getAllVinService,carFaultUpdateService } from '@/api/repair.js'
const vehicleFaultList = async()=>{
    vinList.value = []
    let params = {
        page: pageNum.value,
        pageSize: pageSize.value,
        vin: vin.value,
        maintenanceType: maintenanceType.value,
        taskClassification: taskClassification.value,
        paymentMethod: paymentMethod.value
    }
    let result = await vehicleFaultListService(params);
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
    //为自动补全输入框准备vinList
    let au_result = await getAllVinService();
    console.log(au_result.data)
    console.log(au_result.data.length)
    console.log(au_result.data[0])
    for(let j=0;j<au_result.data.length;j++){
        const newvin = {vin:au_result.data[j]};
        vinList.value.push(newvin);
    }
    console.log(vinList.value)
}
vehicleFaultList()

import { ElMessage,ElMessageBox } from "element-plus";
const visibleDrawer = ref(false);
const carFaultModel = ref({
    maintenanceType:"",
    taskClassification:"",
    paymentMethod:"",
    vin:""
});
const showDrawer = ()=>{
  carFaultModel.value={
    maintenanceType:"",
    taskClassification:"",
    paymentMethod:"",
    vin:""
  }
  visibleDrawer.value = true;
}

const addCarFault = async () => {
  let result = await addCarFaultService(carFaultModel.value);
  ElMessage.success(result.msg ? result.msg : "添加成功");
  visibleDrawer.value = false;
  vehicleFaultList();
};
const dialogFormVisible = ref(false);
const showDialog = (row) => {
  dialogFormVisible.value = true;
  //数据拷贝
  carFaultModel.value.maintenanceType = row.maintenanceType;
  carFaultModel.value.taskClassification = row.taskClassification;
  carFaultModel.value.paymentMethod = row.paymentMethod;
  carFaultModel.value.vin = row.vin;
  carFaultModel.value.vfi = row.vfi;
};

//自动补全输入框  vin
const results = ref([]);
const querySearch = (queryString) => {
    results.value = [];
    if(queryString){
        for (let i = 0; i < vinList.value.length; i++) {
        if(vinList.value[i].vin.indexOf(queryString) === 0){
            const item = {vin: vinList.value[i].vin}
            results.value.push(item);
        }
    }
    }else{
        results.value = vinList.value;
    }
    
    for (let i = 0; i < results.value.length; i++) {
        results.value[i].value = results.value[i].vin;
    }
    console.log("****************启用querySearch事件后的results****************");
    console.log(results.value);
    return results.value;
}

const handleSelect = (item) => {
    console.log("****************启用handleSelect事件后的item****************");
    console.log(item.value)
}

//修改车辆故障信息
const updateCarFault = async()=>{
    let result = await carFaultUpdateService(carFaultModel.value);
    ElMessage.success(result.msg ? result.msg : "修改成功");
    vehicleFaultList();
    dialogFormVisible.value = false;
}

//故障信息跳转到详情页
import { useRouter } from "vue-router";
import { useVfiStore } from '@/stores/pageVfi.js'
const router = useRouter();
const vfiStore = useVfiStore();
const toDetail = (row) => {
    vfiStore.removeVfi();
    vfiStore.setVfi(row.vfi);
    router.push({path:'/repair/vehicleFaultDetail'});
}

//确认维修任务全部完成
const finishVF = async(row) => {
    ElMessageBox.confirm(
    "是否确认维修任务全部完成？",
    "💡温馨提示💡",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
    )
    .then(async() => {
        //数据模型赋值
        carFaultModel.value.maintenanceType = row.maintenanceType;
        carFaultModel.value.taskClassification = row.taskClassification;
        carFaultModel.value.paymentMethod = row.paymentMethod;
        carFaultModel.value.vin = row.vin;
        carFaultModel.value.vfi = row.vfi;
        carFaultModel.value.repairStatus = 1;
        carFaultModel.value.whetherPay = row.whetherPay;
        //调用接口
        let result = await carFaultUpdateService(carFaultModel.value);
        ElMessage({
            type: "success",
            message: "修改成功",
         });
        //刷新列表
        vehicleFaultList();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "用户取消操作",
      });
    });
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
        <div class="header" style="color: #409eff; font-weight: bold">
            <span>车辆故障管理</span>
            <div class="extra">
            <el-button type="primary" @click="showDrawer()"
                >添加车辆故障信息</el-button
            >
            </div>
        </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
        <el-form-item label="车架号:">
            <!-- <el-input v-model="vin" placeholder="请输入车架号" /> -->
            <el-autocomplete
                    name="车架号"
                    v-model="vin"
                    :fetch-suggestions="querySearch"
                    clearable
                    class="inline-input w-50"
                    placeholder="请输入车架号"
                    @select="handleSelect"
                />
        </el-form-item>
        <el-form-item label="维修类型:">
            <el-select
            v-model="maintenanceType"
            placeholder="请选择维修类型"
            style="width: 150px"
            >
                <el-option label="普通" value="0" />
                <el-option label="加急" value="1" />
            </el-select>
        </el-form-item>
        <el-form-item label="作业分类:">
            <el-select
            v-model="taskClassification"
            placeholder="请选择作业分类"
            style="width: 150px"
            >
                <el-option label="大" value="0" />
                <el-option label="中" value="1" />
                <el-option label="小" value="2" />
            </el-select>
        </el-form-item>
        <el-form-item label="结算方式:">
            <el-select
            v-model="paymentMethod"
            placeholder="请选择结算方式"
            style="width: 150px"
            >
                <el-option label="自付" value="0" />
                <el-option label="三包" value="1" />
                <el-option label="索赔" value="2" />
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="vehicleFaultList">搜索</el-button>
            <el-button
            @click="
                vin = '';
                maintenanceType = '';
                taskClassification = '';
                paymentMethod = ''
            "
            >重置</el-button
            >
        </el-form-item>
        </el-form>
        <!-- 车辆故障列表 -->
        <el-table :data="vehicleFaults" style="width: 100%">
        <el-table-column label="车架号" prop="vin"></el-table-column>
        <el-table-column label="维修类型" prop="maintenanceTypeName"></el-table-column>
        <el-table-column label="作业分类" prop="taskClassificationName"></el-table-column>
        <el-table-column label="结算方式" prop="paymentMethodName"></el-table-column>
        <el-table-column label="维修状态" prop="repairStatusName"></el-table-column>
        <el-table-column label="是否支付" prop="whetherPayName"></el-table-column>
        <el-table-column label="修改/确认完成/详情" width="150">
            <template #default="{row}">
                <el-button
                    :icon="Edit"
                    circle
                    plain
                    type="primary"
                    @click="showDialog(row)"
                ></el-button>
                <el-button
                    :icon="Select"
                    circle
                    plain
                    type="primary"
                    @click="finishVF(row)"
                ></el-button>
                <el-button
                    :icon="DArrowRight"
                    circle
                    plain
                    type="success"
                    @click="toDetail(row)"
                ></el-button>
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
        <!-- 抽屉 -->
        <el-drawer
        v-model="visibleDrawer"
        title="添加车辆故障信息"
        direction="rtl"
        size="50%"
        titleStyle="{ color: '#409eff', fontWeight: 'bold' }"
        >
            <el-form :model="carFaultModel" label-width="150px">
                <el-form-item label="车架号">
                    <!-- <el-input
                        v-model="carFaultModel.vin"
                        placeholder="请输入车架号"
                        style="width: 250px"
                    ></el-input> -->
                    <el-autocomplete
                        name="车架号"
                        v-model="carFaultModel.vin"
                        :fetch-suggestions="querySearch"
                        clearable
                        class="inline-input w-50"
                        placeholder="请输入车架号"
                        @select="handleSelect"
                        style="width: 250px"
                    />
                </el-form-item>
                <el-form-item label="维修类型:">
                    <el-select
                    v-model="carFaultModel.maintenanceType"
                    placeholder="请选择维修类型"
                    style="width: 250px"
                    >
                        <el-option label="普通" value="0" />
                        <el-option label="加急" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="作业分类:">
                    <el-select
                    v-model="carFaultModel.taskClassification"
                    placeholder="请选择作业分类"
                    style="width: 250px"
                    >
                        <el-option label="大" value="0" />
                        <el-option label="中" value="1" />
                        <el-option label="小" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="结算方式:">
                    <el-select
                    v-model="carFaultModel.paymentMethod"
                    placeholder="请选择结算方式"
                    style="width: 250px"
                    >
                        <el-option label="自付" value="0" />
                        <el-option label="三包" value="1" />
                        <el-option label="索赔" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addCarFault">添加</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="车辆故障信息" width="500">
        <el-form :model="carFaultModel">
            <el-form-item label="故障编号：" label-width="140px">
                <el-input v-model="carFaultModel.vfi" style="width: 250px" disabled />
            </el-form-item>
            <el-form-item label="车架号：" label-width="140px">
                <el-input v-model="carFaultModel.vin" style="width: 250px" disabled />
            </el-form-item>
            <el-form-item label="维修类型:" label-width="140px">
                <el-select v-model="carFaultModel.maintenanceType" placeholder="请选择维修类型" style="width: 250px">
                    <el-option label="普通" value="0" />
                    <el-option label="加急" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="作业分类:" label-width="140px">
                <el-select v-model="carFaultModel.taskClassification" placeholder="请选择作业分类" style="width: 250px">
                    <el-option label="大" value="0" />
                    <el-option label="中" value="1" />
                    <el-option label="小" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="结算方式:" label-width="140px">
                <el-select v-model="carFaultModel.paymentMethod" placeholder="请选择结算方式" style="width: 250px">
                    <el-option label="自付" value="0" />
                    <el-option label="三包" value="1" />
                    <el-option label="索赔" value="2" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="updateCarFault()"> 确认 </el-button>
            </div>
        </template>
    </el-dialog>
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