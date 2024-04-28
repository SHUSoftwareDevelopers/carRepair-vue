<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";

import { ref } from "vue";

//用户搜索时选中的车辆信息
const vehicleColor = ref("");
const vehicleType = ref("");

const cars = ref([])

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(3); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  carList()
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  carList()
};

import { ownCarInfoListService } from "@/api/client.js";

const carList = async() => {
    console.log("guo!");
    let params = {
        page: pageNum.value,
        pageSize: pageSize.value,
        vehicleColor: vehicleColor.value,
        vehicleType: vehicleType.value
    };
    let result = await ownCarInfoListService(params);
    //渲染视图
    total.value = result.data.total;
    cars.value = result.data.rows;
    //处理数据，扩展数据模型vehicleTypeName
    for (let i = 0; i < cars.value.length; i++) {
      if (cars.value[i].vehicleType == '0') {
        cars.value[i].vehicleTypeName = "SUV";
      } 
      else if(cars.value[i].vehicleType == '1') {
        cars.value[i].vehicleTypeName = "Bus";
      }
      else if(cars.value[i].vehicleType == '2') {
        cars.value[i].vehicleTypeName = "Family Sedan";
      }
      else if(cars.value[i].vehicleType == '3') {
        cars.value[i].vehicleTypeName = "Fire Engine";
      }
      else if(cars.value[i].vehicleType == '4') {
        cars.value[i].vehicleTypeName = "Heavy Truck";
      }
      else if(cars.value[i].vehicleType == '5') {
        cars.value[i].vehicleTypeName = "Jeep";
      }
      else if(cars.value[i].vehicleType == '6') {
        cars.value[i].vehicleTypeName = "Minibus";
      }
      else if(cars.value[i].vehicleType == '7') {
        cars.value[i].vehicleTypeName = "Racing Car";
      }
      else if(cars.value[i].vehicleType == '8') {
        cars.value[i].vehicleTypeName = "Taxi";
      }
      else{
        cars.value[i].vehicleTypeName = "Truck";
      }
    }
};
carList()
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header" style="color: #409eff; font-weight: bold">
        <span>车辆信息</span>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
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
      <el-table-column label="车架号" prop="vin"></el-table-column>
      <el-table-column label="车牌号" prop="license"></el-table-column>
      <el-table-column label="类型" prop="vehicleTypeName"></el-table-column>
      <el-table-column label="颜色" prop="vehicleColor"></el-table-column>
      <el-table-column label="操作" width="100">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
          ></el-button>
          <el-button :icon="Delete" circle plain type="danger"></el-button>
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
</style>