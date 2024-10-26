<template>
  <!-- 受理中心页面 -->
  <div class="app-container">
    <!--搜索区域-->
    <el-form size="small" :inline="true" label-width="100px">
      <el-form-item label="工单处理状态">
        <el-select
          v-model="searchForm.orderstate"
          placeholder="请选择换件处理状态"
          clearable
          style="width: 240px"
        >
          <el-option label="未接单" value="0"></el-option>
          <el-option label="已接单" value="1"></el-option>
          <el-option label="维修结束" value="2"></el-option>
          <el-option label="管理员驳回换件申请" value="3"></el-option>
          
        </el-select>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          >新增维修工单</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="filteredTableDatax">
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column label="工单id" align="center" key="id" prop="id" />
      <el-table-column label="工单维修类型" align="center" key="type" prop="type" />
      <el-table-column label="故障等级" align="center" key="level" prop="level">
        <template slot-scope="scope">
          <el-tag :type="formatlevel(scope.row.level).type">{{
            formatlevel(scope.row.level).label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="分配工程师id" align="center" key="engineers" prop="engineers" />
      <el-table-column label="电话号码" align="center" key="engineer_phone" prop="engineer_phone" />
      <el-table-column label="工单状态" align="center" key="state" prop="state">
        <template slot-scope="scope">
          <el-tag :type="orderstatetools(scope.row.state).type">{{
            orderstatetools(scope.row.state).label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="城市" align="center" key="city" prop="city" />
      <el-table-column label="工单所在地区" align="center" key="area" prop="area" />
      <el-table-column label="工单撤销状态" align="center" key="enable" prop="enable">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable == 0 ? 'danger' : 'success'">
            {{ scope.row.enable == 0 ? '已取消' : '正常' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-popconfirm
            title="确定撤销这个维修申请吗？"
            v-if="scope.row.state == 0"
            @confirm="handleDelete(scope.row)"
          >
            <el-button type="text" icon="el-icon-delete" slot="reference">撤销</el-button>
          </el-popconfirm>
          <el-button
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.state == 2"
            @click="handleEdit(scope.row, 'edit')"
            >评价</el-button
          >
          <el-button
            type="text"
            icon="el-icon-view"
            v-if="scope.row.state == 5"
            @click="handleEdit(scope.row, 'view')"
            >查看评价</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改工单配置对话框 -->
    <el-dialog center :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form
        :model="orderForm"
        :rules="forgetRules"
        ref="orderForm"
        :inline="false"
        label-width="100px"
        :hide-required-asterisk="true"
      >
        <el-form-item label="处理时间" prop="processTime">
          <el-radio-group v-model="orderForm.processTime" prop="processTime">
            <el-radio label="4h">4小时</el-radio>
            <el-radio label="8h">8小时</el-radio>
            <el-radio label="12h">12小时</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="工单所在地区" prop="region">
          <el-select v-model="orderForm.region" placeholder="请选择所在地区">
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
        <el-form-item label="工单类型">
          <el-radio-group v-model="orderForm.ordertype" prop="engineer">
            <el-radio label="计算机"></el-radio>
            <el-radio label="打印机"></el-radio>
            <el-radio label="监控设备"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 对工单进行评价 -->
    <el-dialog
      center
      :title="evaluatetitle"
      :visible.sync="evaluateopen"
      width="600px"
      append-to-body
      @close="handleClose"
    >
      <el-form
        :model="evaluateForm"
        :rules="evaluateRules"
        ref="evaluateForm"
        :inline="false"
        label-width="100px"
        :hide-required-asterisk="true"
      >
        <el-form-item label="评分" prop="orderrate">
          <el-rate
            :disabled="evaluatetitle == '评价' ? false : true"
            v-model="evaluateForm.orderrate"
            show-text
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          >
          </el-rate>
        </el-form-item>
        <el-form-item label="评价" prop="orderdesc">
          <el-input
            :disabled="evaluatetitle == '评价' ? false : true"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="evaluateForm.orderdesc"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="evaluatetitle == '评价'">
        <el-button type="primary" @click="evaluatesubmitForm">确 定</el-button>
        <el-button @click="evaluatecancel">取 消</el-button>
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
      // 选中数组
      options,
      orderlist: null,
      // 弹出层标题
      title: '',
      evaluatetitle: '',
      // 是否显示弹出层
      open: false,
      evaluateopen: false,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      searchForm: {
        orderstate: '',
      },

      // 注册列表
      orderForm: {
        processTime: '', //处理时间
        ordertype: '',
        region: '',
      },
      evaluateForm: {
        orderrate: 0,
        orderdesc: '',
      },
      forgetRules: {
        region: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
        count: [{ required: true, message: '请选择故障等级', trigger: 'change' }],
        engineer: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
      },
      evaluateRules: {
        orderrate: [{ required: true, message: '请选择评分', trigger: 'change' }],
        orderdesc: [{ required: true, message: '请输入评价内容', trigger: 'blur' }],
      },
      //路由参数用户id
      userid: '',
      handleEditid: '',
    };
  },
  created() {
    this.userid = sessionStorage.getItem('userid');
    this.getList();
  },
  // 在Vue组件中定义计算属性
  computed: {
    filteredTableDatax() {
      if (this.searchForm.orderstate) {
        return this.orderlist.filter((item) => item.state == this.searchForm.orderstate);
      } else {
        return this.orderlist;
      }
    },
    formatlevel() {
      return this.$tools.formatlevel;
    },
    orderstatetools() {
      return this.$tools.orderstatetools;
    },
    // formatengineers(){

    // }
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList().then((response) => {
        this.list = response.data.items;
        this.listLoading = false;
      });
    },
    /** 查询用户列表 */
    async getList() {
      this.loading = true;
      const canshu = {
        id: this.userid,
      };
      await this.apijs.findOneorder(canshu).then((response) => {
        console.log(response);
        this.orderlist = response.data;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ishandle: undefined,
        processTime: undefined,
        city: undefined,
        area: undefined,
      };
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '新增工单';
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let city = this.$tools.findGroupByValue(this.orderForm.region, this.options);
          let dengji;
          switch (this.orderForm.processTime) {
            case '4h':
              dengji = 2;
              break;
            case '8h':
              dengji = 1;
              break;
            case '12h':
              dengji = 0;
              break;
          }
          let canshu = {
            type: this.orderForm.ordertype,
            level: dengji,
            time: this.orderForm.processTime,
            city: city,
            area: this.orderForm.region,
            userid: this.userid,
          };
          // console.log(canshu, '提交工单');
          this.apijs
            .addorder(canshu)
            .then((resx) => {
              // console.log(res);
              let res = resx;
              // console.log(res);
              this.$message({
                message: res.data,
                type: 'success',
              });
              this.loading = false;
              this.open = false;
              this.getList();
            })
            .catch(() => {
              this.loading = false;
              this.$message({
                message: res.data,
                type: 'success',
              });
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //撤销
    handleDelete(row) {
      const id = row.id;
      if (row.state == 0) {
        let canshu = {
          id: id,
        };
        this.apijs
          .cancelorders(canshu)
          .then((resx) => {
            // console.log(res);
            let res = resx;
            this.$message({
              message: '撤销成功',
              type: 'success',
            });

            this.getList();
          })
          .catch(() => {
            this.$message({
              message: resx.msg,
              type: 'error',
            });
          });
      } else {
        this.$message({
          message: '当前这条不可撤销',
          type: 'warming',
        });
      }
    },
    //handleEdit评价按钮
    handleEdit(row, type) {
      //评价id
      this.handleEditid = row.id;
      this.evaluateopen = true;
      if (type == 'view') {
        this.apijs.evaluatefindByOrder({ orderid: this.handleEditid }).then((res) => {
          this.evaluateForm.orderrate = res.data[0].grade;
          this.evaluateForm.orderdesc = res.data[0].ms;
        });
        this.evaluatetitle = '查看评价';
      } else {
        this.evaluatetitle = '评价';
      }
    },
    //评价提交
    evaluatesubmitForm() {
      this.$refs.evaluateForm.validate((valid) => {
        if (valid) {
          console.log(this.evaluateForm.orderrate, this.evaluateForm.orderdesc);
          // this.loading = true;

          let canshu = {
            orderid: this.handleEditid,
            grade: this.evaluateForm.orderrate,
            ms: this.evaluateForm.orderdesc,
          };
          this.apijs
            .evaluateupdate(canshu)
            .then((resx) => {
              // console.log(res);
              let res = resx;
              if (res) {
                this.$message({
                  message: '评价成功',
                  type: 'success',
                });
                this.evaluateopen = false;
                this.getList();
                this.evaluateForm = {
                  orderrate: 0,
                  orderdesc: '',
                };
              }
            })
            .catch(() => {
              this.loading = false;
              this.$message({
                message: '评价失败',
                type: 'success',
              });
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //评价取消
    evaluatecancel() {
      this.evaluateopen = false;
      this.evaluateForm = {
        orderrate: 0,
        orderdesc: '',
      };
    },
    handleClose() {
      this.evaluateopen = false;
      this.evaluateForm = {
        orderrate: 0,
        orderdesc: '',
      };
    },
  },
};
</script>
