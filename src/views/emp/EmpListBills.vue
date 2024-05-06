<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";

import { ref } from "vue";

const clientId = ref('');
const bills = ref([])

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(3); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  billList()
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  billList()
};

import { ListBillsService } from "@/api/emp.js";

const billList = async()=>{
    let params = {
        page: pageNum.value,
        pageSize: pageSize.value,
        clientId: clientId.value
    };
    let result = await ListBillsService(params);
    //渲染视图
    total.value = result.data.total;
    bills.value = result.data.rows;
}
billList()

</script>
<template>
    <el-card class="page-container">
    <template #header>
      <div class="header" style="color: #409eff; font-weight: bold">
        <span>账单信息</span>
      </div>
    </template>
    <el-form inline>
      <el-form-item label="客户ID:">
        <el-input v-model="clientId" placeholder="请输入客户ID" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="billList">搜索</el-button>
        <el-button
          @click="
            clientId = '';
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 车辆列表 -->
    <el-table :data="bills" style="width: 100%">
      <el-table-column label="账单ID" prop="billId"></el-table-column>
      <el-table-column label="车辆故障号" prop="vfi"></el-table-column>
      <el-table-column label="客户ID" prop="clientId"></el-table-column>
      <el-table-column label="折扣率(减免)" prop="discountRate"></el-table-column>
      <el-table-column label="支付方式" prop="paymentMethod"></el-table-column>
      <el-table-column label="支付金额" prop="payment"></el-table-column>
      <el-table-column label="支付时间" prop="payTime"></el-table-column>
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