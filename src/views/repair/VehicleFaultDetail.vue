<script setup>
import { Edit, Delete, Aim, Pointer, Search } from "@element-plus/icons-vue";
import { ref } from "vue";

const size = ref("default");
const flag = ref(true);

//获取路由参数
import { useVfiStore } from "@/stores/pageVfi.js";
const vfiStore = useVfiStore();
const vfi = vfiStore.vfi;
console.log(vfi);
const repairprogress = ref({
  repairAuthorization: {},
  finishedTaskNum: 0,
  repairTaskList: [],
  riidTomdoidMap: {},
  mdoidToogidMap: {},
});

import { queryVehicleByVfiService } from "@/api/client.js";
const vehicle = ref({});
const getVehicle = async () => {
  let result = await queryVehicleByVfiService(vfi);
  vehicle.value = result.data;
};
getVehicle();

//获取维修详细信息
import {
  queryRepairProgressService,
  addRepairAuthorizationService,
  updateRepairAuthorizationService,
  addRepairTaskService,
  updateRepairTaskService,
  addDispatchService,
  assignDispatchService,
  updateDispatchService,
} from "@/api/emp.js";
import { es } from "element-plus/es/locales.mjs";
const getProgress = async () => {
  let result = await queryRepairProgressService(vfi);
  console.log(result);
  // 将获取到的数据赋值给 repairprogress 对象
  repairprogress.value.repairAuthorization = result.data.repairAuthorization;
  repairprogress.value.finishedTaskNum = result.data.finishedTaskNum;
  repairprogress.value.repairTaskList = result.data.repairTaskList;
  repairprogress.value.riidTomdoidMap = result.data.riidTomdoidMap;
  repairprogress.value.mdoidToogidMap = result.data.mdoidToogidMap;
  if (result.data.repairAuthorization.clientId == null) {
    flag.value = true;
  } else {
    flag.value = false;
  }
  console.log(repairprogress.value.mdoidToogidMap);
};
getProgress();

//展示维修项目+派工单
const activeNames = ref(["1"]);
const handleChange = (val) => {
  console.log(val);
};

//添加维修委托书
import { ElMessage, ElMessageBox } from "element-plus";
const RAModel = ref({
  rai: "",
  clientId: "",
  vfi: vfi,
  empId: "",
  mileage: "",
  onboardItems: "",
  checkResult: "",
  repairMethod: "",
  isWashCar: 0,
  isGetFormerComponent: 0,
  totalCost: "",
  estDelivTime: "",
});
const visibleDrawer = ref(false);
const showDrawer = () => {
  RAModel.value = {
    rai: "",
    clientId: "",
    vfi: vfi,
    empId: "",
    mileage: "",
    onboardItems: "",
    checkResult: "",
    repairMethod: "",
    isWashCar: 0,
    isGetFormerComponent: 0,
    totalCost: "",
    estDelivTime: "",
  };
  visibleDrawer.value = true;
};
const formateTime = (time) => {
  var newTime = new Date(time);
  var year = newTime.getFullYear();
  var month = newTime.getMonth() + 1; // 月份从0开始，所以要加1
  var day = newTime.getDate();
  var hour = newTime.getHours();
  var minute = newTime.getMinutes();
  var second = newTime.getSeconds();
  // 格式化为 "yyyy-MM-dd HH:mm:ss"
  var formattedDateTime = year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (day < 10 ? "0" + day : day) +
    " " +
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minute < 10 ? "0" + minute : minute) +
    ":" +
    (second < 10 ? "0" + second : second);
  return formattedDateTime;
};
const addRA = async () => {
  RAModel.value.estDelivTime = formateTime(RAModel.value.estDelivTime);
  let result = await addRepairAuthorizationService(RAModel.value);
  ElMessage.success(result.msg ? result.msg : "添加成功");
  visibleDrawer.value = false;
  getProgress();
};

//更新维修委托书
const dialogFormVisible1 = ref(false);
const showDialog1 = () => {
  RAModel.value = {
    rai: repairprogress.value.repairAuthorization.rai,
    clientId: repairprogress.value.repairAuthorization.clientId,
    vfi: repairprogress.value.repairAuthorization.vfi,
    empId: repairprogress.value.repairAuthorization.empId,
    mileage: repairprogress.value.repairAuthorization.mileage,
    onboardItems: repairprogress.value.repairAuthorization.onboardItems,
    checkResult: repairprogress.value.repairAuthorization.checkResult,
    repairMethod: repairprogress.value.repairAuthorization.repairMethod,
    isWashCar: repairprogress.value.repairAuthorization.isWashCar,
    isGetFormerComponent:
      repairprogress.value.repairAuthorization.isGetFormerComponent,
    totalCost: repairprogress.value.repairAuthorization.totalCost,
    estDelivTime: repairprogress.value.repairAuthorization.estDelivTime,
  };
  dialogFormVisible1.value = true;
};

const updateRA = async () => {
  RAModel.value.estDelivTime = formateTime(RAModel.value.estDelivTime);
  let result = await updateRepairAuthorizationService(RAModel.value);
  ElMessage.success(result.msg ? result.msg : "修改成功");
  dialogFormVisible1.value = false;
  getProgress();
};

//派工单表格显示处理
const empTypeMap = {
  1: "前台",
  2: "机修工",
  3: "焊工",
  4: "漆工",
  5: "业务员",
};
const isCompleteMap = {
  0: "否",
  1: "是",
};

//添加维修项目
const dialogFormVisible2 = ref(false);
const RTModel = ref({
  riid: "",
  repairItem: "",
  needComponent: "",
  pricePerComponent: "",
  totalComponentPrice: "",
  rai: repairprogress.value.repairAuthorization.rai,
  isComplete: "",
});
const showDialog2 = () => {
  RTModel.value = {
    riid: "",
    repairItem: "",
    needComponent: "",
    pricePerComponent: "",
    totalComponentPrice: "",
    rai: repairprogress.value.repairAuthorization.rai,
    isComplete: "",
  };
  dialogFormVisible2.value = true;
};

const addRT = async () => {
  let result = await addRepairTaskService(RTModel.value);
  ElMessage.success(result.msg ? result.msg : "添加成功");
  dialogFormVisible2.value = false;
  getProgress();
};

//修改目标维修项目
const dialogFormVisible3 = ref(false);
const showDialog3 = (task) => {
  RTModel.value = {
    riid: task.riid,
    repairItem: task.repairItem,
    needComponent: task.needComponent,
    pricePerComponent: task.pricePerComponent,
    totalComponentPrice: task.totalComponentPrice,
    rai: task.rai,
    isComplete: task.isComplete,
  };
  dialogFormVisible3.value = true;
};
const updateRT = async () => {
  let result = await updateRepairTaskService(RTModel.value);
  ElMessage.success(result.msg ? result.msg : "修改成功");
  dialogFormVisible3.value = false;
  getProgress();
};

//添加派工单
const dialogFormVisible4 = ref(false);
const dispatchModel = ref({
  mdoid: "",
  riid: "",
  workLength: "",
  pricePerhour: "",
  empId: "",
  empType: "",
  isComplete: "",
});
const showDialog4 = (riid) => {
  dispatchModel.value = {
    mdoid: "",
    riid: riid,
    workLength: "",
    pricePerhour: "",
    empId: "",
    empType: "",
    isComplete: ""
  };
  dialogFormVisible4.value = true;
};
const addDispatch = async () => {
  let result = await addDispatchService(dispatchModel.value);
  ElMessage.success(result.msg ? result.msg : "添加成功");
  dialogFormVisible4.value = false;
  getProgress();
};
//修改派工单
const dialogFormVisible5 = ref(false);
const tag = ref(true);
const showDialog5 = (row, num) => {
  if (num == 0) {
    tag.value = true;
  } else {
    tag.value = false;
  }
  dispatchModel.value = {
    mdoid: row.mdoid,
    riid: row.riid,
    workLength: row.workLength,
    pricePerhour: row.pricePerhour,
    empId: row.empId,
    empType: row.empType,
    isComplete: row.isComplete,
  };
  dialogFormVisible5.value = true;
};
const updateDispatch = async () => {
  if (tag.value) {
    let result = await assignDispatchService(dispatchModel.value);
    ElMessage.success(result.msg ? result.msg : "修改成功");
    dialogFormVisible5.value = false;
    getProgress();
  } else {
    let result = await updateDispatchService(dispatchModel.value);
    ElMessage.success(result.msg ? result.msg : "修改成功");
    dialogFormVisible5.value = false;
    getProgress();
  }
};

//显示派工单任务记录
const gridData = ref([]);
const fuzhi = (mdoid) => {
  const records = repairprogress.value.mdoidToogidMap[mdoid];
  if (records) {
    gridData.value = records;
  } else {
    // 如果没有找到相应的记录，可以选择清空gridData或者做其他处理
    gridData.value = [];
  }
};
</script>

<template>
  <el-card class="page-container">
    <!-- <strong>车辆故障维修进度：</strong> -->
    <!-- <span>{{ repairprogress.finishedTaskNum }}/{{ repairprogress.repairTaskList.length }}</span> -->
    <template #header>
      <div class="header" style="color: #409eff; font-weight: bold">
        <span>车辆故障详细信息</span>
      </div>
    </template>

    <!-- 汽车图片 -->
    <div style="display: flex; justify-content: center">
      <el-image
        style="width: 600px; height: 338px"
        :src="vehicle.vehicleImage"
        fit="cover"
      ></el-image>
    </div>

    <el-button type="primary" @click="showDrawer()" round v-if="flag"
      >添加维修委托书</el-button
    >
    <!-- 展示维修委托书-->
    <el-descriptions
      class="margin-top"
      title="维修委托书"
      :column="3"
      :size="size"
      v-if="flag == false"
      border
    >
      <template #extra>
        <el-button type="success" @click="showDialog1" round
          >修改维修委托书</el-button
        >
      </template>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            故障单号
          </div>
        </template>
        {{ repairprogress.repairAuthorization.vfi }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <iphone />
            </el-icon>
            车主ID
          </div>
        </template>
        {{ repairprogress.repairAuthorization.clientId }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <location />
            </el-icon>
            经办人ID
          </div>
        </template>
        {{ repairprogress.repairAuthorization.empId }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <tickets />
            </el-icon>
            车辆行驶里程
          </div>
        </template>
        {{ repairprogress.repairAuthorization.mileage }} km
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            随车物品
          </div>
        </template>
        {{ repairprogress.repairAuthorization.onboardItems }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            检查结果
          </div>
        </template>
        {{ repairprogress.repairAuthorization.checkResult }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            维修方案
          </div>
        </template>
        {{ repairprogress.repairAuthorization.repairMethod }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            是否洗车
          </div>
        </template>
        <span v-if="repairprogress.repairAuthorization.isWashCar == 1">是</span>
        <span v-else>否</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            旧件是否带回
          </div>
        </template>
        <span
          v-if="repairprogress.repairAuthorization.isGetFormerComponent == 1"
          >是</span
        >
        <span v-else>否</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            维修总费用
          </div>
        </template>
        {{ repairprogress.repairAuthorization.totalRepairCost }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            开始日期
          </div>
        </template>
        {{ repairprogress.repairAuthorization.createTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            预计交付日期
          </div>
        </template>
        {{ repairprogress.repairAuthorization.estDelivTime }}
      </el-descriptions-item>
    </el-descriptions>

    <br /><br />

    <!-- 展示维修项目和对应的派工单 -->
    <div
      style="display: flex; align-items: center; justify-content: space-between"
      v-if="repairprogress.repairAuthorization"
    >
      <strong style="font-weight: bold; color: #333; font-size: 20px"
        >维修详情：</strong
      >
      <el-button type="primary" @click="showDialog2" round
        >添加维修项目</el-button
      >
    </div>
    <div class="demo-collapse">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          v-for="(task, index) in repairprogress.repairTaskList"
          :name="index"
          :key="task.riid"
        >
          <template #title>
            <div style="font-weight: bold; color: purple; font-size: 18px">
              维修项目{{ index + 1 }}
            </div>
          </template>
          <el-descriptions
            class="margin-top"
            :title="task.repairItem"
            :column="3"
            :size="size"
            border
          >
            <template #extra>
              <el-button type="success" @click="showDialog3(task)" round
                >修改该维修项目</el-button
              >
            </template>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon :style="iconStyle">
                    <user />
                  </el-icon>
                  所需零件
                </div>
              </template>
              {{ task.needComponent }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon :style="iconStyle">
                    <user />
                  </el-icon>
                  零件单价
                </div>
              </template>
              {{ task.pricePerComponent }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon :style="iconStyle">
                    <user />
                  </el-icon>
                  零件总金额
                </div>
              </template>
              {{ task.totalComponentPrice }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon :style="iconStyle">
                    <user />
                  </el-icon>
                  创建时间
                </div>
              </template>
              {{ task.createTime }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon :style="iconStyle">
                    <user />
                  </el-icon>
                  更新时间
                </div>
              </template>
              {{ task.updateTime }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon :style="iconStyle">
                    <user />
                  </el-icon>
                  是否完成
                </div>
              </template>
              {{ task.isComplete === 0 ? "否" : "是" }}
            </el-descriptions-item>
          </el-descriptions>
          <br />
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <p style="font-size: 16px; font-weight: bold; color: #333">
              派工单信息
            </p>
            <el-button type="primary" round @click="showDialog4(task.riid)"
              >添加派工单</el-button
            >
          </div>
          <el-table
            v-if="repairprogress.riidTomdoidMap[task.riid]"
            :data="repairprogress.riidTomdoidMap[task.riid]"
            border
          >
            <el-table-column prop="mdoid" label="派工单ID"></el-table-column>
            <el-table-column prop="workLength" label="工时"></el-table-column>
            <el-table-column
              prop="pricePerhour"
              label="工时单价"
            ></el-table-column>
            <el-table-column prop="empId" label="维修员编号"></el-table-column>
            <el-table-column prop="empType" label="维修员类型">
              <template #default="{ row }">
                {{ empTypeMap[row.empType] }}
              </template>
            </el-table-column>
            <el-table-column prop="isComplete" label="是否完成">
              <template #default="{ row }">
                {{ isCompleteMap[row.isComplete] }}
              </template>
            </el-table-column>
            <el-table-column label="指派/修改/派工记录" width="180">
              <template #default="{ row }">
                <div v-if="row.empId && row.isComplete != 1">
                  <el-button
                    :icon="Pointer"
                    circle
                    plain
                    type="primary"
                    @click="showDialog5(row, 0)"
                    disabled
                  ></el-button>
                  <el-button
                    :icon="Edit"
                    circle
                    plain
                    type="success"
                    @click="showDialog5(row, 1)"
                  ></el-button>
                  <el-popover placement="left" :width="600" trigger="click">
                    <template #reference>
                      <el-button
                        :icon="Search"
                        circle
                        plain
                        type="warning"
                        @click="fuzhi(row.mdoid)"
                      ></el-button>
                    </template>
                    <el-table :data="gridData">
                      <el-table-column property="ogid" label="记录编号" />
                      <el-table-column property="assignId" label="分配者ID" />
                      <el-table-column property="receivedId" label="接单者ID" />
                      <el-table-column property="status" label="状态" />
                      <el-table-column
                        width="150"
                        property="endTime"
                        label="结束时间"
                      />
                    </el-table>
                  </el-popover>
                </div>
                <div v-else-if="!row.empId && isComplete != 1">
                  <el-button
                    :icon="Pointer"
                    circle
                    plain
                    type="primary"
                    @click="showDialog5(row, 0)"
                  ></el-button>
                  <el-button
                    :icon="Edit"
                    circle
                    plain
                    type="success"
                    @click="showDialog5(row, 1)"
                  ></el-button>
                  <el-popover placement="left" :width="600" trigger="click">
                    <template #reference>
                      <el-button
                        :icon="Search"
                        circle
                        plain
                        type="warning"
                        @click="fuzhi(row.mdoid)"
                      ></el-button>
                    </template>
                    <el-table :data="gridData">
                      <el-table-column property="ogid" label="记录编号" />
                      <el-table-column property="assignId" label="分配者ID" />
                      <el-table-column property="receivedId" label="接单者ID" />
                      <el-table-column property="status" label="状态" />
                      <el-table-column
                        width="150"
                        property="endTime"
                        label="结束时间"
                      />
                    </el-table>
                  </el-popover>
                </div>
                <div v-else>
                  <el-button
                    :icon="Pointer"
                    circle
                    plain
                    type="primary"
                    @click="showDialog5(row, 0)"
                    disabled
                  ></el-button>
                  <el-button
                    :icon="Edit"
                    circle
                    plain
                    type="success"
                    @click="showDialog5(row, 1)"
                    disabled
                  ></el-button>
                  <el-popover placement="left" :width="600" trigger="click">
                    <template #reference>
                      <el-button
                        :icon="Search"
                        circle
                        plain
                        type="warning"
                        @click="fuzhi(row.mdoid)"
                      ></el-button>
                    </template>
                    <el-table :data="gridData">
                      <el-table-column property="ogid" label="记录编号" />
                      <el-table-column property="assignId" label="分配者ID" />
                      <el-table-column property="receivedId" label="接单者ID" />
                      <el-table-column property="status" label="状态" />
                      <el-table-column
                        width="150"
                        property="endTime"
                        label="结束时间"
                      />
                    </el-table>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>

      <!-- 添加维修委托书抽屉 -->
      <el-drawer v-model="visibleDrawer" title="添加维修委托书" width="500">
        <el-form :model="RAModel">
          <el-form-item label="故障单号：" label-width="140px">
            <el-input v-model="RAModel.vfi" style="width: 250px" disabled />
          </el-form-item>
          <el-form-item label="车主ID：" label-width="140px">
            <el-input v-model="RAModel.clientId" style="width: 250px" />
          </el-form-item>
          <el-form-item label="经办人ID：" label-width="140px">
            <el-input v-model="RAModel.empId" style="width: 250px" />
          </el-form-item>
          <el-form-item label="车辆行驶里程：" label-width="140px">
            <el-input v-model="RAModel.mileage" style="width: 250px" />
          </el-form-item>
          <el-form-item label="随车物品：" label-width="140px">
            <el-input v-model="RAModel.onboardItems" style="width: 250px" />
          </el-form-item>
          <el-form-item label="检查结果：" label-width="140px">
            <el-input v-model="RAModel.checkResult" style="width: 250px" />
          </el-form-item>
          <el-form-item label="维修方案：" label-width="140px">
            <el-input v-model="RAModel.repairMethod" style="width: 250px" />
          </el-form-item>
          <el-form-item label="是否洗车：" label-width="140px">
            <el-select
              v-model="RAModel.isWashCar"
              placeholder="请选择是否洗车"
              style="width: 250px"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="旧件是否带回：" label-width="140px">
            <el-select
              v-model="RAModel.isGetFormerComponent"
              placeholder="请选择是否带回旧件"
              style="width: 250px"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="维修总费用：" label-width="140px">
            <el-input v-model="RAModel.totalCost" style="width: 250px" />
          </el-form-item>
          <el-form-item label="预计交付日期：" label-width="140px">
            <el-date-picker
              v-model="RAModel.estDelivTime"
              type="datetime"
              placeholder="选择预计交付日期"
              style="width: 250px"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="visibleDrawer = false">取消</el-button>
            <el-button type="primary" @click="addRA()"> 确认 </el-button>
          </div>
        </template>
      </el-drawer>

      <!-- 修改维修委托书对话框 -->
      <el-dialog
        v-model="dialogFormVisible1"
        title="修改维修委托书"
        width="500"
      >
        <el-form :model="RAModel">
          <el-form-item label="故障单号：" label-width="140px">
            <el-input v-model="RAModel.vfi" style="width: 250px" disabled />
          </el-form-item>
          <el-form-item label="车主ID：" label-width="140px">
            <el-input
              v-model="RAModel.clientId"
              style="width: 250px"
              disabled
            />
          </el-form-item>
          <el-form-item label="经办人ID：" label-width="140px">
            <el-input v-model="RAModel.empId" style="width: 250px" />
          </el-form-item>
          <el-form-item label="车辆行驶里程：" label-width="140px">
            <el-input v-model="RAModel.mileage" style="width: 250px" />
          </el-form-item>
          <el-form-item label="随车物品：" label-width="140px">
            <el-input v-model="RAModel.onboardItems" style="width: 250px" />
          </el-form-item>
          <el-form-item label="检查结果：" label-width="140px">
            <el-input v-model="RAModel.checkResult" style="width: 250px" />
          </el-form-item>
          <el-form-item label="维修方案：" label-width="140px">
            <el-input v-model="RAModel.repairMethod" style="width: 250px" />
          </el-form-item>
          <el-form-item label="是否洗车：" label-width="140px">
            <el-select
              v-model="RAModel.isWashCar"
              placeholder="请选择是否洗车"
              style="width: 250px"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="旧件是否带回：" label-width="140px">
            <el-select
              v-model="RAModel.isGetFormerComponent"
              placeholder="请选择是否带回旧件"
              style="width: 250px"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="维修总费用：" label-width="140px">
            <el-input v-model="RAModel.totalCost" style="width: 250px" />
          </el-form-item>
          <el-form-item label="预计交付日期：" label-width="140px">
            <el-date-picker
              v-model="RAModel.estDelivTime"
              type="datetime"
              placeholder="选择预计交付日期"
              style="width: 250px"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible1 = false">取消</el-button>
            <el-button type="primary" @click="updateRA()"> 确认 </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 添加维修项目对话框 -->
      <el-dialog v-model="dialogFormVisible2" title="添加维修项目" width="500">
        <el-form :model="RTModel">
          <el-form-item label="委托书ID：" label-width="140px">
            <el-input v-model="RTModel.rai" style="width: 250px" disabled />
          </el-form-item>
          <el-form-item label="维修项目名称：" label-width="140px">
            <el-input v-model="RTModel.repairItem" style="width: 250px" />
          </el-form-item>
          <el-form-item label="所需零件：" label-width="140px">
            <el-input v-model="RTModel.needComponent" style="width: 250px" />
          </el-form-item>
          <el-form-item label="零件单价：" label-width="140px">
            <el-input
              v-model="RTModel.pricePerComponent"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="零件总金额：" label-width="140px">
            <el-input
              v-model="RTModel.totalComponentPrice"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="是否已完成：" label-width="140px">
            <el-select
              v-model="RTModel.isComplete"
              placeholder="维修项目是否已完成"
              style="width: 250px"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false">取消</el-button>
            <el-button type="primary" @click="addRT()"> 确认 </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 修改维修项目对话框 -->
      <el-dialog v-model="dialogFormVisible3" title="修改维修项目" width="500">
        <el-form :model="RTModel">
          <el-form-item label="委托书ID：" label-width="140px">
            <el-input v-model="RTModel.rai" style="width: 250px" disabled />
          </el-form-item>
          <el-form-item label="维修项目名称：" label-width="140px">
            <el-input v-model="RTModel.repairItem" style="width: 250px" />
          </el-form-item>
          <el-form-item label="所需零件：" label-width="140px">
            <el-input v-model="RTModel.needComponent" style="width: 250px" />
          </el-form-item>
          <el-form-item label="零件单价：" label-width="140px">
            <el-input
              v-model="RTModel.pricePerComponent"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="零件总金额：" label-width="140px">
            <el-input v-model="RTModel.totalComponentPrice" style="width: 250px" />
          </el-form-item>
          <el-form-item label="是否已完成：" label-width="140px">
            <el-select
              v-model="RTModel.isComplete"
              placeholder="维修项目是否已完成"
              style="width: 250px"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible3 = false">取消</el-button>
            <el-button type="primary" @click="updateRT"> 确认 </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 添加派工单对话框 -->
      <el-dialog v-model="dialogFormVisible4" title="修改维修项目" width="500">
        <el-form :model="dispatchModel">
          <el-form-item label="维修项目编号：" label-width="140px">
            <el-input
              v-model="dispatchModel.riid"
              style="width: 250px"
              disabled
            />
          </el-form-item>
          <el-form-item label="工时：" label-width="140px">
            <el-input v-model="dispatchModel.workLength" style="width: 250px" />
          </el-form-item>
          <el-form-item label="工时单价：" label-width="140px">
            <el-input
              v-model="dispatchModel.pricePerhour"
              style="width: 250px"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible4 = false">取消</el-button>
            <el-button type="primary" @click="addDispatch"> 确认 </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 修改派工单对话框 -->
      <el-dialog v-model="dialogFormVisible5" title="修改派工单" width="500">
        <el-form :model="dispatchModel">
          <el-form-item label="维修项目编号：" label-width="140px">
            <el-input
              v-model="dispatchModel.riid"
              style="width: 250px"
              disabled
            />
          </el-form-item>
          <div v-if="tag">
            <el-form-item label="工时：" label-width="140px">
              <el-input
                v-model="dispatchModel.workLength"
                style="width: 250px"
                disabled
              />
            </el-form-item>
            <el-form-item label="工时单价：" label-width="140px">
              <el-input
                v-model="dispatchModel.pricePerhour"
                style="width: 250px"
                disabled
              />
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="工时：" label-width="140px">
              <el-input
                v-model="dispatchModel.workLength"
                style="width: 250px"
              />
            </el-form-item>
            <el-form-item label="工时单价：" label-width="140px">
              <el-input
                v-model="dispatchModel.pricePerhour"
                style="width: 250px"
              />
            </el-form-item>
          </div>
          <el-form-item label="维修员编号：" label-width="140px">
            <el-input v-model="dispatchModel.empId" style="width: 250px" />
          </el-form-item>
          <el-form-item label="维修员类型：" label-width="140px">
            <el-select
              v-model="dispatchModel.empType"
              placeholder="请选择维修员类型"
              style="width: 250px"
            >
              <el-option label="机修工" value="2" />
              <el-option label="焊工" value="3" />
              <el-option label="漆工" value="4" />
              <el-option label="暂无" value="" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible5 = false">取消</el-button>
            <el-button type="primary" @click="updateDispatch"> 确认 </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
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