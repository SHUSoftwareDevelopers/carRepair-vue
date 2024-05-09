# carRepair-vue

#### 所需依赖下载：

- npm install element-plus --save
- npm install axios
- npm install sass -D
- npm install pinia-persistedstate-plugin
- npm install vue-router@4



#### 前后端联调接口说明

**==common.js==**

| 后端接口             | 请求数据                               | 响应数据   | 说明                   |
| -------------------- | -------------------------------------- | ---------- | ---------------------- |
| /common/register     | 账号、密码、用户名、真实姓名、用户类型 |            | 注册                   |
| /common/login        | 账号、密码                             |            | 登录                   |
| /common/queryInfo    |                                        | user实体类 | 用户查询自己的公共信息 |
| /common/updatePwd    | 原密码、新密码、确认密码               |            | 修改密码               |
| /common/updateInfo   | user实体类                             |            | 更改公共信息           |
| /common/updateAvatar | 图片链接                               |            | 更换头像               |

**==client.js==**

| 后端接口                   | 请求数据                                                     | 响应数据     | 说明                         |
| -------------------------- | ------------------------------------------------------------ | ------------ | ---------------------------- |
| /client/queryInfo          | 无（后端自己获取ID）                                         | client实体类 | 客户获取自己的客户相关信息   |
| /client/updateInfo         | client实体类                                                 |              | 更新客户信息                 |
| /client/listClient         | page,pageSize,[客户姓名、客户类型]                           | pageBean     | 查询所有客户信息(可条件搜索) |
| /client/addClient          | 账号、密码、用户名、手机号码<br />用户类型、真实姓名、客户类型<br />折扣率、业务联系人、业务联系电话 |              | 增加客户(一次性完成两表添加) |
| /client/queryOwnCar        | page,pageSize,[车颜色、车类型]                               | pageBean     | 客户查自己车                 |
| /client/findCar            | page,pageSize,[车颜色、车类型、车主ID]                       | pageBean     | 查询所有车                   |
| /frontDesk/addCar          | vehicle实体类                                                |              | 加车                         |
| /frontDesk/updateCar       | vehicle实体类                                                |              | 修改车的信息                 |
| /frontDesk/deleteCar/{vin} | vin                                                          |              | 删除车架号为vin的车          |

**==emp.js==**

| 后端接口         | 请求数据                                                     | 响应数据  | 说明                       |
| ---------------- | ------------------------------------------------------------ | --------- | -------------------------- |
| /emp/queryMyInfo | 无(后端自己获取account)                                      | emp实体类 | 员工获取自己的员工信息     |
| /emp/queryList   | page,pageSize,[员工类型]                                     | pageBean  | 查询所有员工信息           |
| /emp/addEmp      | 账号、密码、用户名、手机号码<br />用户类型、真实姓名、员工类型 |           | 添加员工(一次完成两表添加) |
| /emp/update      | emp实体类                                                    |           | 更新员工数据               |

