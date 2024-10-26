<template>
  <!-- 用户管理页面 -->
  <div class="app-container">
    <!--用户数据-->
    <el-form :model="searchForm" size="small" :inline="true" label-width="100px">
      <el-form-item label="用户账号" prop="userName">
        <el-input
          v-model="searchForm.username"
          placeholder="请输入用户账号"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户类型查询" prop="userName">
        <el-select
          v-model="searchForm.functions"
          placeholder="请选择用户类型"
          clearable
          style="width: 240px"
        >
          <el-option label="客户" value="0"></el-option>
          <el-option label="工程师" value="1"></el-option>
          <el-option label="管理员" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery()"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <!--用户数据表格-->
    <el-table :data="filteredTableDatax">
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column label="用户id" align="center" key="id" prop="id" />
      <el-table-column label="用户账号" align="center" key="username" prop="username" />
      <el-table-column label="用户密码" align="center" key="password" prop="password" width="120">
        <template slot-scope="scope">
          {{ decryptPassword(scope.row.password) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="用户密码" align="center" key="password" prop="password" /> -->
      <el-table-column label="用户姓名" align="center" key="name" prop="name" />
      <el-table-column label="手机号码" align="center" key="phone" prop="phone" width="120" />
      <el-table-column label="城市" align="center" key="city" prop="city" width="120" />
      <el-table-column label="工程师等级" align="center" key="power" prop="power" width="120">
        <template slot-scope="scope">
          <el-tag :type="formatpower(scope.row.power).type">{{
            formatpower(scope.row.power).label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" align="center" key="functions" prop="functions" width="120">
        <template slot-scope="scope">
          <el-tag :type="formatfunctions(scope.row.functions).type">{{
            formatfunctions(scope.row.functions).label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="地区" align="center" key="area" prop="area" width="120" />
      <el-table-column label="状态" align="center" key="state">
        <template slot-scope="scope" v-if="scope.row.functions !== 2">
          <el-tooltip class="item" effect="dark" content="启用或禁用账户" placement="top">
            <el-switch
              v-model="scope.row.begin"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="openuser(scope.row, scope.row.begin)"
            >
            </el-switch>
          </el-tooltip>

          <!-- <el-tag :type="scope.row.begin == 1 ? 'success' : 'danger'">{{
            scope.row.begin == 1 ? '启用' : '禁用'
          }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope" v-if="scope.row.functions !== 2">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button> -->
          <el-popconfirm title="确定删除这个用户吗？" @confirm="handleDelete(scope.row)">
            <el-button type="text" icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog center :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form
        :model="registerForm"
        :rules="forgetRules"
        ref="registerForm"
        :inline="false"
        label-width="100px"
        :hide-required-asterisk="true"
      >
        <el-form-item label="用户账号" prop="forgetusername">
          <el-input
            v-model="registerForm.forgetusername"
            placeholder="Username由数字以及字母组成"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="registerForm.pass"
            autocomplete="off"
            placeholder="Password由数字以及字母组成"
            :show-password="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="phone"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="registerForm.realName" placeholder="Name"></el-input>
        </el-form-item>
        <el-form-item label="地区" prop="region">
          <el-select v-model="registerForm.region" placeholder="请选择所在地区">
            <el-option-group v-for="group in options" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="账户类型">
          <el-radio-group v-model="registerForm.count" prop="count">
            <el-radio label="客户"></el-radio>
            <el-radio label="工程师"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工程师等级" v-show="registerForm.count == '工程师'">
          <el-radio-group v-model="registerForm.engineer" prop="count">
            <el-radio label="初级"></el-radio>
            <el-radio label="中级"></el-radio>
            <el-radio label="高级"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账户状态">
          <el-radio-group v-model="registerForm.begin">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import options from '../utils/selectdata.js';
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      options,
      searchForm: {
        username: '',
        functions: '',
      },
      // 用户列表
      registerForm: {
        id: '',
        forgetusername: '', //用户登录名
        phone: '',
        pass: '',
        realName: '', //用户姓名
        confirmPassword: '',
        region: '',
        count: '客户',
        state: '',
        engineer: '',
        begin: 0,
      },
      forgetRules: {
        forgetusername: [
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/,
            message: '账号必须是由4-20位字母+数字组合',
            trigger: 'blur',
            required: true,
          },
        ],
        phone: [
          {
            message: '请输入正确的手机号码',
            trigger: 'blur',
            required: true,
            validator: this.$validator.validatePhone,
          },
        ],
        pass: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' },
        ],
        realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        region: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
        count: [{ required: true, message: '请选择账号类型', trigger: 'change' }],
        // engineer: [{ required: true, message: '请选择账号类型', trigger: 'change' }],
      },
    };
  },
  created() {
    this.getList();
  },
  // 在Vue组件中定义计算属性
  computed: {
    filteredTableDatax() {
      // console.log(this.searchForm.functions);
      if (this.searchForm.functions) {
        return this.userList.filter((item) => item.functions == this.searchForm.functions);
      } else {
        return this.userList;
      }
    },
    formatpower() {
      return this.$tools.formatpower;
    },
    decryptPassword() {
      return this.$tools.decrypt;
    },
    formatfunctions() {
      return this.$tools.formatfunctions;
    },
  },
  methods: {
    /** 查询用户列表 */
    async getList() {
      this.loading = true;
      await this.apijs.getalluser().then((response) => {
        // console.log(response, 'getlist');
        this.userList = response.data;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        username: undefined,
        password: undefined,
        phone: undefined,
        city: undefined,
        area: undefined,
        power: undefined,
        functions: undefined,
        state: 0,
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.searchForm.username) {
        let canshu = {
          username: this.searchForm.username,
        };
        this.apijs
          .finduser(canshu)
          .then((resx) => {
            // console.log(res);
            let res = resx;
            // console.log(res);
            this.$message({
              message: '查询成功',
              type: 'success',
            });
            this.userList = res.data;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.getList();
      }
    },
    openuser(row, e) {
      // console.log(row, e);
      row.begin = e;
      this.apijs
        .updateuser(row)
        .then((resx) => {
          // console.log(res);
          let res = resx;
          // console.log(res);
          this.$message({
            message: '修改成功！',
            type: 'success',
          });
          this.loading = false;
          this.open = false;
          this.getList();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 密码加密
    encryptPassword(password) {
      return this.$tools.encrypt(password);
    },
    //密码解密
    decryptPasswords(password) {
      return this.$tools.decrypt(password);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true;
      this.reset();
      this.registerForm = {
        id: row.id,
        forgetusername: row.username, //用户登录名
        phone: row.phone,
        pass: this.decryptPasswords(row.password),
        realName: row.name, //用户姓名
        state: row.state,
      };
      this.title = '修改用户';
      // console.log(this.registerForm);
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let city = this.$tools.findGroupByValue(this.registerForm.region, this.options);
          let functions = this.registerForm.count == '客户' ? 0 : 1;
          let power;
          switch (this.registerForm.engineer) {
            case '初级':
              power = 0;
              break;
            case '中级':
              power = 1;
              break;
            case '高级':
              power = 2;
              break;
            default:
              power = 3;
          }
          let canshu = {
            id: this.registerForm.id,
            name: this.registerForm.realName,
            username: this.registerForm.forgetusername,
            password: this.encryptPassword(this.registerForm.pass),
            phone: this.registerForm.phone,
            city: city,
            area: this.registerForm.region,
            power: power,
            functions: functions,
            state: this.registerForm.state,
            begin: this.registerForm.begin,
          };
          // console.log('canshu', canshu);
          this.apijs
            .updateuser(canshu)
            .then((resx) => {
              // console.log(res);
              let res = resx;
              // console.log(res);
              this.$message({
                message: '修改成功！',
                type: 'success',
              });
              this.loading = false;
              this.open = false;
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      if (row.functions !== 2) {
        let canshu = {
          id: id,
        };
        this.apijs
          .deleteuser(canshu)
          .then((resx) => {
            // console.log(res);
            let res = resx;
            this.$message({
              message: '删除成功',
              type: 'success',
            });
            this.loading = false;
            this.getList();
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.$message({
          message: '管理员账号不可删除',
          type: 'warming',
        });
      }
    },
  },
};
</script>
