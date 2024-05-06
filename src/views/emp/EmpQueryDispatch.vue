<script setup>
import { Edit, Delete,Check,Close,Finished,Bell} from "@element-plus/icons-vue";

import { ref } from "vue";

const isAssigned = ref("")
const orders = ref([])

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(5); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  dispatchOrderList()
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  dispatchOrderList()
};

import {dispatchOrderListService,getRepairItemService,applyOrderService} from '@/api/emp.js'
import { emptyProps } from "element-plus";
const dispatchOrderList = async()=>{
    let params = {
        page: pageNum.value,
        pageSize: pageSize.value,
        isAssigned: isAssigned.value
    };
    let result = await dispatchOrderListService(params);
    //渲染视图
    total.value = result.data.total;
    orders.value = result.data.rows;
}
dispatchOrderList()

//接单
import useEmpInfoStore from '@/stores/empInfo.js'
import { ElMessage,ElMessageBox } from "element-plus";
const orderModel = ref({
    mdoid: "",
    workLength: "",
    pricePerhour: "",
    riid: "",
    empId: "",
    empType: "",
    isComplete: ""
})

const applyOrder = async(row)=>{
    orderModel.value.mdoid = row.mdoid;
    orderModel.value.workLength = row.workLength;
    orderModel.value.pricePerhour = row.pricePerhour;
    orderModel.value.riid = row.riid;
    orderModel.value.isComplete = row.isComplete;
    orderModel.value.empId = useEmpInfoStore().empInfo.empId;
    orderModel.value.empType = useEmpInfoStore().empInfo.empType;
    let result = await applyOrderService(orderModel.value);
    ElMessage.success(result.msg ? result.msg : "修改成功");
    dispatchOrderList();
};

</script>
<template>
    <el-card class="page-container">
    <template #header>
      <div class="header" style="color: #409eff; font-weight: bold">
        <span>派工单大厅</span>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="工单状态:">
        <el-select
          v-model="isAssigned"
          placeholder="请选择工单状态"
          style="width: 150px"
        >
          <el-option label="未分配" value="0" />
          <el-option label="已分配" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dispatchOrderList">搜索</el-button>
        <el-button
          @click="
            isAssigned = '';
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 车辆列表 -->
    <el-table :data="orders" style="width: 100%">
        <!-- 加一个维修项目名称，通过riid来查 -->
      <el-table-column label="维修项目名称" prop="repairItem"></el-table-column>
      <el-table-column label="工时" prop="workLength"></el-table-column>
      <el-table-column label="工时单价" prop="pricePerhour"></el-table-column>
      <el-table-column label="工单状态" prop="status"></el-table-column>
      <el-table-column label="接单" width="150">
        <template #default="{row}">
            <el-button :icon="Bell" circle plain type="success" v-if="row.status=='未分配'" @click="applyOrder(row)"></el-button>
            <el-button :icon="Bell" circle plain type="danger" v-else disabled></el-button>
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
</style>