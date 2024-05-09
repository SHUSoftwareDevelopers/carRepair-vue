<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";

import { ref } from "vue";
import { ElMessage } from "element-plus";

const empType = ref("");
const emps = ref([]);
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(3); //每页条数
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  empList()
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  empList()
};

import {empInfoListService,addEmpService,empInfoUpdateService } from '@/api/emp.js'

const empList = async () => {
  let params = {
    page: pageNum.value,
    pageSize: pageSize.value,
    empType: empType.value
  };
  let result = await empInfoListService(params);
  total.value = result.data.total;
  emps.value = result.data.rows;
  for (let i = 0; i < emps.value.length; i++) {
    if (emps.value[i].empType == 0) {
      emps.value[i].empTypeName = "管理员";
    } 
    else if(emps.value[i].empType == 1){
      emps.value[i].empTypeName = "前台";
    }
    else if(emps.value[i].empType == 2){
      emps.value[i].empTypeName = "机修工";
    }
    else if(emps.value[i].empType == 3){
      emps.value[i].empTypeName = "焊工";
    }
    else if(emps.value[i].empType == 4){
      emps.value[i].empTypeName = "漆工";
    }
    else if(emps.value[i].empType == 5){
      emps.value[i].empTypeName = "业务员";
    }
  }
};
empList();

const visibleDrawer=ref(false)
const empModel = ref({
    account: "",
    password: "123456",
    username: "",
    trueName: "",
    userType: "",
    empType:"",
    phone:""
})

const addEmp = async()=>{
    empModel.value.empType = empModel.value.userType;
    let result = await addEmpService(empModel.value);ElMessage.success(result.msg?result.msg:"添加成功");
    visibleDrawer.value=false;
    empList()
}

const dialogFormVisible = ref(false)
//编辑客户信息数据模型
const empUpdateModel = ref({
  empId:"",
  empName: "",
  empType: "",
  account:""
});
//展示编辑弹窗
const showDialog = (row) =>{
    dialogFormVisible.value=true;
    //数据拷贝
    empUpdateModel.value.empId=row.empId;
    empUpdateModel.value.empName=row.empName;
    empUpdateModel.value.empType=row.empType;
    empUpdateModel.value.account=row.account;
}

const updateEmp = async()=>{
    let result = await empInfoUpdateService(empUpdateModel.value);
    ElMessage.success(result.msg? result.msg: "修改成功");
    empList();
    dialogFormVisible.value=false;
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header" style="color: #409eff; font-weight: bold">
        <span>员工管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer = true">添加员工</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="员工类别:">
        <el-select
          v-model="empType"
          placeholder="请选择员工类别"
          style="width: 150px"
        >
          <el-option label="管理员" value="0" />
          <el-option label="前台" value="1" />
          <el-option label="机修工" value="2" />
          <el-option label="焊工" value="3" />
          <el-option label="漆工" value="4" />
          <el-option label="业务员" value="5" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="empList">搜索</el-button>
        <el-button
          @click="
            empType = '';
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 客户列表 -->
    <el-table :data="emps" style="width: 100%">
      <el-table-column label="员工ID" prop="empId"></el-table-column>
      <el-table-column label="员工姓名" prop="empName"></el-table-column>
      <el-table-column label="员工类别" prop="empTypeName"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{row}">
            <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
            <el-button :icon="Delete" circle plain type="danger"></el-button>
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
      title="添加员工"
      direction="rtl"
      size="50%"
      titleStyle="{ color: '#409eff', fontWeight: 'bold' }"
    >
      <!-- 添加员工表单 -->
      <el-form :model="empModel" label-width="150px">
        <el-form-item label="员工账号">
          <el-input
            v-model="empModel.account"
            placeholder="请输入账号"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="员工用户名">
          <el-input
            v-model="empModel.username"
            placeholder="请输入用户名"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="员工姓名">
          <el-input
            v-model="empModel.trueName"
            placeholder="请输入真实姓名"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="员工类别:">
          <el-select
            v-model="empModel.userType"
            placeholder="请选择员工类别"
            style="width: 250px"
          >
            <el-option label="管理员" value="0" />
            <el-option label="前台" value="1" />
            <el-option label="机修工" value="2" />
            <el-option label="焊工" value="3" />
            <el-option label="漆工" value="4" />
            <el-option label="业务员" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工电话">
          <el-input
            v-model="empModel.phone"
            placeholder="请输入电话号码"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addEmp">添加</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-card>

  <!-- 修改信息对话框 -->
  <el-dialog v-model="dialogFormVisible" title="员工信息" width="500">
    <el-form :model="empUpdateModel">
      <el-form-item label="员工ID：" label-width="140px">
        <el-input v-model="empUpdateModel.empId"  style="width: 250px;" disabled/>
      </el-form-item>
      <el-form-item label="员工姓名：" label-width="140px">
        <el-input v-model="empUpdateModel.empName" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="员工类别：" label-width="140px">
        <el-select
            v-model="empUpdateModel.empType"
            placeholder="请选择员工类别"
            style="width: 250px"
          >
            <el-option label="管理员" value= "parseInt(0)" />
            <el-option label="前台" value= "parseInt(1)" />
            <el-option label="机修工" value= "parseInt(2)" />
            <el-option label="焊工" value= "parseInt(3)" />
            <el-option label="漆工" value= "parseInt(4)" />
            <el-option label="业务员" value= "parseInt(5)" />
          </el-select>
      </el-form-item>
      <el-form-item label="员工账号：" label-width="140px">
        <el-input v-model="empUpdateModel.account" style="width: 250px;" disabled/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateEmp()">
          确认
        </el-button>
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