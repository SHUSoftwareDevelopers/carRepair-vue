<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";

import { ref } from "vue";

//用户搜索时选中的类别
const clientType = ref("");

//用户搜索时选中的客户姓名
const clientName = ref("");

//客户列表数据模型
const clients = ref([]);

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(3); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  clientList();
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  clientList();
};

//获取客户信息数据
import { clientInfoListService,addClientService,clientInfoUpdateService } from "@/api/client.js";
const clientList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    clientName: clientName.value,
    clientType: clientType.value,
  };
  let result = await clientInfoListService(params);
  //渲染视图
  total.value = result.data.total;
  clients.value = result.data.rows;
  //处理数据，扩展数据模型clientTypeName客户类别名 个人/单位
  for (let i = 0; i < clients.value.length; i++) {
    if (clients.value[i].clientType == 0) {
      clients.value[i].clientTypeName = "个人";
    } else {
      clients.value[i].clientTypeName = "单位";
    }
  }
};
clientList();

import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
//控制抽屉是否显示
const visibleDrawer = ref(false);
//添加表单数据模型
const clientModel = ref({
  account: "",
  password: "123456",
  username: "",
  trueName: "",
  userType: 6,
  clientType: "",
  phone:"",
  discountRate:"",
  businessContact:"",
  businessTele:""
});

const addClient = async()=>{
    console.log("数据来啦");
    console.log(clientModel.value);
    let result = await addClientService(clientModel.value);
    ElMessage.success(result.msg?result.msg:"添加成功");
    visibleDrawer.value=false;
    clientList()
}

const dialogFormVisible = ref(false)
//编辑客户信息数据模型
const clientUpdateModel = ref({
  clientId:"",
  clientName: "",
  clientType: "",
  discountRate:"",
  businessContact:"",
  businessTele:"",
  account:""
});
//展示编辑弹窗
const showDialog = (row) =>{
    dialogFormVisible.value=true;
    //数据拷贝
    clientUpdateModel.value.clientId=row.clientId;
    clientUpdateModel.value.clientName=row.clientName;
    clientUpdateModel.value.clientType=row.clientType;
    clientUpdateModel.value.discountRate=row.discountRate;
    clientUpdateModel.value.businessContact=row.businessContact;
    clientUpdateModel.value.businessTele=row.businessTele;
    clientUpdateModel.value.account=row.account;
}

const updateClient = async()=>{
    //调用接口
    let result = await clientInfoUpdateService(clientUpdateModel.value);
    ElMessage.success(result.msg? result.msg: "修改成功");
    clientList();
    dialogFormVisible.value=false;
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header" style="color: #409eff; font-weight: bold">
        <span>客户管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer = true"
            >添加客户</el-button
          >
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="客户姓名:">
        <el-input v-model="clientName" placeholder="请输入客户姓名" />
      </el-form-item>
      <el-form-item label="客户类别:">
        <el-select
          v-model="clientType"
          placeholder="请选择客户类别"
          style="width: 150px"
        >
          <el-option label="个人" value="0" />
          <el-option label="单位" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clientList">搜索</el-button>
        <el-button
          @click="
            clientName = '';
            clientType = '';
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 客户列表 -->
    <el-table :data="clients" style="width: 100%">
      <el-table-column label="客户账号" prop="account"></el-table-column>
      <el-table-column label="客户姓名" prop="clientName"></el-table-column>
      <el-table-column label="客户类别" prop="clientTypeName"></el-table-column>
      <el-table-column label="折扣率" prop="discountRate"></el-table-column>
      <el-table-column label="业务联系人" prop="businessContact">
      </el-table-column>
      <el-table-column
        label="业务联系电话"
        prop="businessTele"
      ></el-table-column>
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
      title="添加客户"
      direction="rtl"
      size="50%"
      titleStyle="{ color: '#409eff', fontWeight: 'bold' }"
    >
      <!-- 添加客户表单 -->
      <el-form :model="clientModel" label-width="150px">
        <el-form-item label="客户账号">
          <el-input
            v-model="clientModel.account"
            placeholder="请输入账号"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户用户名">
          <el-input
            v-model="clientModel.username"
            placeholder="请输入用户名"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input
            v-model="clientModel.trueName"
            placeholder="请输入真实姓名"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户类别:">
          <el-select
            v-model="clientModel.clientType"
            placeholder="请选择客户类别"
            style="width: 250px"
          >
            <el-option label="个人" value="0" />
            <el-option label="单位" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input
            v-model="clientModel.phone"
            placeholder="请输入电话号码"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="折扣率">
          <el-input
            v-model="clientModel.discountRate"
            placeholder="请输入折扣率"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务联系人姓名">
          <el-input
            v-model="clientModel.businessContact"
            placeholder="请输入业务联系人姓名"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务联系电话">
          <el-input
            v-model="clientModel.businessTele"
            placeholder="请输入业务联系电话"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addClient">添加</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-card>

  <!-- 修改信息对话框 -->
  <el-dialog v-model="dialogFormVisible" title="客户信息" width="500">
    <el-form :model="clientUpdateModel">
      <el-form-item label="客户ID：" label-width="140px">
        <el-input v-model="clientUpdateModel.clientId"  style="width: 250px;" disabled/>
      </el-form-item>
      <el-form-item label="客户姓名：" label-width="140px">
        <el-input v-model="clientUpdateModel.clientName" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="客户类别：" label-width="140px">
        <el-radio-group v-model="clientUpdateModel.clientType">
          <el-radio value="0" size="large">个人</el-radio>
          <el-radio value="1" size="large">单位</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="折扣率：" label-width="140px">
        <el-input v-model="clientUpdateModel.discountRate" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="业务联系人：" label-width="140px">
        <el-input v-model="clientUpdateModel.businessContact" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="业务联系电话：" label-width="140px">
        <el-input v-model="clientUpdateModel.businessTele" style="width: 250px;"/>
      </el-form-item>
      <el-form-item label="客户账号：" label-width="140px">
        <el-input v-model="clientUpdateModel.account" style="width: 250px;" disabled/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateClient()">
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
/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>