<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";

import { ref } from "vue";

//用户搜索时选中的车辆信息
const vehicleColor = ref("");
const vehicleType = ref("");
const clientId = ref("");

const cars = ref([]);

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(5); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  carList();
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  carList();
};

import {
  carInfoListService,
  addCarService,
  carInfoUpdateService,
  carDeleteService
} from "@/api/client.js";

const carList = async () => {
  console.log("guo!");
  let params = {
    page: pageNum.value,
    pageSize: pageSize.value,
    vehicleColor: vehicleColor.value,
    vehicleType: vehicleType.value,
    clientId: clientId.value,
  };
  let result = await carInfoListService(params);
  //渲染视图
  total.value = result.data.total;
  cars.value = result.data.rows;
  //处理数据，扩展数据模型vehicleTypeName
  for (let i = 0; i < cars.value.length; i++) {
    if (cars.value[i].vehicleType == "0") {
      cars.value[i].vehicleTypeName = "SUV";
    } else if (cars.value[i].vehicleType == "1") {
      cars.value[i].vehicleTypeName = "Bus";
    } else if (cars.value[i].vehicleType == "2") {
      cars.value[i].vehicleTypeName = "Family Sedan";
    } else if (cars.value[i].vehicleType == "3") {
      cars.value[i].vehicleTypeName = "Fire Engine";
    } else if (cars.value[i].vehicleType == "4") {
      cars.value[i].vehicleTypeName = "Heavy Truck";
    } else if (cars.value[i].vehicleType == "5") {
      cars.value[i].vehicleTypeName = "Jeep";
    } else if (cars.value[i].vehicleType == "6") {
      cars.value[i].vehicleTypeName = "Minibus";
    } else if (cars.value[i].vehicleType == "7") {
      cars.value[i].vehicleTypeName = "Racing Car";
    } else if (cars.value[i].vehicleType == "8") {
      cars.value[i].vehicleTypeName = "Taxi";
    } else {
      cars.value[i].vehicleTypeName = "Truck";
    }
  }
};
carList();

//添加客户用车
import { ElMessage,ElMessageBox } from "element-plus";
const visibleDrawer = ref(false);
const carModel = ref({
  vin: "",
  license: "",
  vehicleType: "",
  vehicleColor: "",
  clientId: "",
});

const addCar = async () => {
  let result = await addCarService(carModel.value);
  ElMessage.success(result.msg ? result.msg : "添加成功");
  visibleDrawer.value = false;
  carList();
};

//修改客户车辆信息
const dialogFormVisible = ref(false);
const showDialog = (row) => {
  dialogFormVisible.value = true;
  //数据拷贝
  carModel.value.clientId = row.clientId;
  carModel.value.vin = row.vin;
  carModel.value.license = row.license;
  carModel.value.vehicleType = row.vehicleType;
  carModel.value.vehicleColor = row.vehicleColor;
};

const updateCar = async () => {
  //调用接口
  let result = await carInfoUpdateService(carModel.value);
  ElMessage.success(result.msg ? result.msg : "修改成功");
  carList();
  dialogFormVisible.value = false;
};

const deleteCar = async (row) => {
  ElMessageBox.confirm(
    "您确认要删除该车辆信息吗?",
    "💡温馨提示💡",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async() => {
      let result = await carDeleteService(row.vin);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      carList()
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "用户取消删除",
      });
    });
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header" style="color: #409eff; font-weight: bold">
        <span>车辆管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer = true"
            >添加客户车辆</el-button
          >
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="车主ID:">
        <el-input v-model="clientId" placeholder="请输入车主ID" />
      </el-form-item>
      <el-form-item label="车辆颜色:">
        <el-input v-model="vehicleColor" placeholder="请输入车辆颜色" />
      </el-form-item>
      <el-form-item label="车辆型号:">
        <el-select
          v-model="vehicleType"
          placeholder="请选择车辆型号"
          style="width: 150px"
        >
          <el-option label="SUV" value="0" />
          <el-option label="Bus" value="1" />
          <el-option label="Family Sedan" value="2" />
          <el-option label="Fire Engine" value="3" />
          <el-option label="Heavy Truck" value="4" />
          <el-option label="Jeep" value="5" />
          <el-option label="Minibus" value="6" />
          <el-option label="Racing Car" value="7" />
          <el-option label="Taxi" value="8" />
          <el-option label="Truck" value="9" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="carList">搜索</el-button>
        <el-button
          @click="
            vehicleColor = '';
            vehicleType = '';
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 车辆列表 -->
    <el-table :data="cars" style="width: 100%">
      <el-table-column label="车主ID" prop="clientId"></el-table-column>
      <el-table-column label="车架号" prop="vin"></el-table-column>
      <el-table-column label="车牌号" prop="license"></el-table-column>
      <el-table-column label="类型" prop="vehicleTypeName"></el-table-column>
      <el-table-column label="颜色" prop="vehicleColor"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showDialog(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteCar(row)"
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
      title="添加客户车辆"
      direction="rtl"
      size="50%"
      titleStyle="{ color: '#409eff', fontWeight: 'bold' }"
    >
      <!-- 添加客户表单 -->
      <el-form :model="carModel" label-width="150px">
        <el-form-item label="车主ID">
          <el-input
            v-model="carModel.clientId"
            placeholder="请输入车主ID"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="车架号">
          <el-input
            v-model="carModel.vin"
            placeholder="请输入车架号"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input
            v-model="carModel.license"
            placeholder="请输入车牌号"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="车辆类型:">
          <el-select
            v-model="carModel.vehicleType"
            placeholder="请选择车辆类型"
            style="width: 250px"
          >
            <el-option label="SUV" value="0" />
            <el-option label="Bus" value="1" />
            <el-option label="Family Sedan" value="2" />
            <el-option label="Fire Engine" value="3" />
            <el-option label="Heavy Truck" value="4" />
            <el-option label="Jeep" value="5" />
            <el-option label="Minibus" value="6" />
            <el-option label="Racing Car" value="7" />
            <el-option label="Taxi" value="8" />
            <el-option label="Truck" value="9" />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆颜色">
          <el-input
            v-model="carModel.vehicleColor"
            placeholder="请输入车辆颜色"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addCar">添加</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-card>

  <!-- 修改信息对话框 -->
  <el-dialog v-model="dialogFormVisible" title="客户车辆信息" width="500">
    <el-form :model="carModel">
      <el-form-item label="车主ID：" label-width="140px">
        <el-input v-model="carModel.clientId" style="width: 250px" disabled />
      </el-form-item>
      <el-form-item label="车架号：" label-width="140px">
        <el-input v-model="carModel.vin" style="width: 250px" disabled />
      </el-form-item>
      <el-form-item label="车牌号：" label-width="140px">
        <el-input v-model="carModel.license" style="width: 250px" />
      </el-form-item>
      <el-form-item label="车辆类型：" label-width="140px">
        <el-select
          v-model="carModel.vehicleType"
          placeholder="请选择车辆类别"
          style="width: 250px"
        >
          <el-option label="SUV" value="0" />
          <el-option label="Bus" value="1" />
          <el-option label="Family Sedan" value="2" />
          <el-option label="Fire Engine" value="3" />
          <el-option label="Heavy Truck" value="4" />
          <el-option label="Jeep" value="5" />
          <el-option label="Minibus" value="6" />
          <el-option label="Racing Car" value="7" />
          <el-option label="Taxi" value="8" />
          <el-option label="Truck" value="9" />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆颜色：" label-width="140px">
        <el-input v-model="carModel.vehicleColor" style="width: 250px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateCar()"> 确认 </el-button>
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
</style>