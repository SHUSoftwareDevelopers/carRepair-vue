<script setup>
import { Edit, Delete, Aim, Pointer } from "@element-plus/icons-vue";
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

//获取维修详细信息
import { queryOwnRepairService } from "@/api/client.js";
import { es } from "element-plus/es/locales.mjs";
const getProgress = async () => {
  let result = await queryOwnRepairService(vfi);
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
};
getProgress();

//展示维修项目+派工单
const activeNames = ref(["1"]);
const handleChange = (val) => {
  console.log(val);
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
</script>

<template>
  <el-card class="page-container">
    <!-- <strong>车辆故障维修进度：</strong> -->
    <!-- <span>{{ repairprogress.finishedTaskNum }}/{{ repairprogress.repairTaskList.length }}</span> -->
    <template #header>
      <div class="header" style="color: #409eff; font-weight: bold">
        <span>车辆维修详细信息</span>
      </div>
    </template>

    <!-- 展示维修委托书-->
    <el-descriptions
      class="margin-top"
      title="维修委托书"
      :column="3"
      :size="size"
      v-if="flag == false"
      border
    >
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
            <p style="font-size: 16px; font-weight: bold; color: #333">
              派工单信息
            </p>
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
          </el-table>
        </el-collapse-item>
      </el-collapse>
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