<script setup>
import { Edit, Delete,Check,Close,Finished} from "@element-plus/icons-vue";

import { ref } from "vue";

const status = ref("")
const ongoings = ref([])

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(5); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  ownOngoingList()
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  ownOngoingList()
};

import {ownOngoingInfoListService,ongoingUpdateService} from '@/api/emp.js'
const ownOngoingList = async()=>{
    let params = {
        page: pageNum.value,
        pageSize: pageSize.value,
        status: status.value
    };
    let result = await ownOngoingInfoListService(params);
    //渲染视图
    total.value = result.data.total;
    ongoings.value = result.data.rows;
    for (let i = 0; i < ongoings.value.length; i++) {
      if (ongoings.value[i].status == 0) {
        ongoings.value[i].statusName = "未受理";
      } 
      else if(ongoings.value[i].status == 1) {
        ongoings.value[i].statusName = "已受理";
      }
      else if(ongoings.value[i].status == 2) {
        ongoings.value[i].statusName = "已拒绝";
      }
      else if(ongoings.value[i].status == 3) {
        ongoings.value[i].statusName = "已完成";
      }
      else {
        ongoings.value[i].statusName = "中断受理";
      }
    }
}
ownOngoingList()

import { ElMessage,ElMessageBox } from "element-plus";
const ongoingModel = ref({
    ogid: "",
    mdoid: "",
    assignId: "",
    receivedId: "",
    status: ""
});

const updateOngoing = async(row,num)=>{
    console.log(num)
    ongoingModel.value.ogid = row.ogid;
    ongoingModel.value.mdoid = row.mdoid;
    ongoingModel.value.assignId = row.assignId;
    ongoingModel.value.receivedId = row.receivedId;
    ongoingModel.value.status = num;
    let result = await ongoingUpdateService(ongoingModel.value);
    ElMessage.success(result.msg ? result.msg : "修改成功");
    ownOngoingList();
}

</script>
<template>
    <el-card class="page-container">
    <template #header>
      <div class="header" style="color: #409eff; font-weight: bold">
        <span>维修记录</span>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="当前状态:">
        <el-select
          v-model="status"
          placeholder="请选择当前状态"
          style="width: 150px"
        >
          <el-option label="未受理" value="0" />
          <el-option label="已受理" value="1" />
          <el-option label="已拒绝" value="2" />
          <el-option label="已完成" value="3" />
          <el-option label="中断受理" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="ownOngoingList">搜索</el-button>
        <el-button
          @click="
            status = '';
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 车辆列表 -->
    <el-table :data="ongoings" style="width: 100%">
      <el-table-column label="派工单编号" prop="mdoid"></el-table-column>
      <el-table-column label="任务分配者ID" prop="assignId"></el-table-column>
      <el-table-column label="当前状态" prop="statusName"></el-table-column>
      <el-table-column label="结束时间" prop="endTime"></el-table-column>
      <el-table-column label="接受/  拒绝/  完成" width="150">
        <template #default="{row}">
            <div v-if="row.status==0">
                <el-button :icon="Check" circle plain type="primary" @click="updateOngoing(row,1)"></el-button>
                <el-button :icon="Close" circle plain type="danger" @click="updateOngoing(row,2)"></el-button>
                <el-button :icon="Finished" circle plain type="success" @click="updateOngoing(row,3)" disable></el-button>
            </div>
            <div v-else-if="row.status==1">
                <el-button :icon="Check" circle plain type="primary" @click="updateOngoing(row,1)" disabled></el-button>
                <el-button :icon="Close" circle plain type="danger" @click="updateOngoing(row,2)"></el-button>
                <el-button :icon="Finished" circle plain type="success" @click="updateOngoing(row,3)"></el-button>
            </div>
            <div v-else>
                <el-button :icon="Check" circle plain type="primary" @click="updateOngoing(row,1)" disabled></el-button>
                <el-button :icon="Close" circle plain type="danger" @click="updateOngoing(row,2)" disabled></el-button>
                <el-button :icon="Finished" circle plain type="success" @click="updateOngoing(row,3)" disabled></el-button>
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
</style>