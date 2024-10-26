<template>
  <!-- 用户管理页面 -->
  <div class="app-container">
    <!--用户数据-->
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
      <!-- <el-table-column label="有无工程师处理" align="center" key="engineers" prop="engineers" /> -->
      <el-table-column label="工单状态" align="center" key="state" prop="state" width="120">
        <template slot-scope="scope">
          <el-tag :type="orderstatetools(scope.row.state).type">{{
            orderstatetools(scope.row.state).label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="城市" align="center" key="city" prop="city" />
      <el-table-column label="工单所在地区" align="center" key="area" prop="area" />
      <el-table-column label="用户电话号码" align="center" key="user_phone" prop="user_phone" />
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-ishandle="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.state !== 2 && scope.row.enable == 1 && scope.row.state !== 5"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >去维修</el-button
          >
          <el-button
            type="text"
            icon="el-icon-view"
            v-if="scope.row.state == 5"
            @click="handleEdit(scope.row)"
            >查看评价</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改工单配置对话框 -->
    <el-dialog
      center
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      style="flex: 1"
    >
      <el-alert title="提示：请选择：“自行维修”或“ 申请换件”" type="warning"> </el-alert>
      <el-alert title="是否确定维修已经结束" type="warning" v-show="selectradio == 3"> </el-alert>
      <el-form label-width="80px" style="margin-top: 10px">
        <el-form-item label="维修方式">
          <el-radio-group v-model="selectradio" size="small">
            <el-radio-button label="0">自行维修</el-radio-button>
            <el-radio-button label="1">申请换件</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配件更换" v-show="selectradio == '1'">
          <el-select v-model="peijian" placeholder="请选择更换的配件" clearable>
            <el-option
              v-for="item in allprooptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="换件理由" v-show="selectradio == '1'">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入申请换件理由,例：计算机cpu故障"
            v-model="textarea"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="维修进展" v-show="selectradio == '0'">
          <el-radio-group v-model="selectradio1">
            <el-radio label="1">维修中</el-radio>
            <el-radio label="2">维修成功</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      center
      title="对此工单的评价"
      :visible.sync="evaluateopen"
      width="600px"
      append-to-body
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
            v-model="evaluateForm.orderrate"
            show-text
            disabled
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          >
          </el-rate>
        </el-form-item>
        <el-form-item label="评价" prop="orderdesc">
          <el-input
            type="textarea"
            :rows="2"
            disabled
            placeholder="请输入内容"
            v-model="evaluateForm.orderdesc"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import options from '../utils/selectdata.js';

export default {
  data() {
    return {
      textarea: '',
      selectradio: '0',
      selectradio1: '1',
      // 遮罩层
      loading: true,
      // 用户表格数据
      orderlist: null,
      //配件选择框选项
      allprooptions: [],
      //配件选择框绑定值
      peijian: '',
      //搜索框参数
      searchForm: {
        orderstate: '',
      },
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示评价弹出层
      evaluateopen: false,
      // 评价表单
      evaluateForm: {
        orderrate: 0,
        orderdesc: '',
      },
      // 评价表单验证规则
      evaluateRules: {
        orderrate: [{ required: true, message: '请选择评分', trigger: 'blur' }],
        orderdesc: [{ required: true, message: '请输入评价内容', trigger: 'blur' }],
      },
      options,
      // 注册列表
      orderForm: {
        processTime: '', //处理时间
        level: '',
        ordertype: '',
        region: '',
      },
      forgetRules: {
        region: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
        count: [{ required: true, message: '请选择故障等级', trigger: 'change' }],
        engineer: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
      },
      //路由参数用户id
      userid: '',
      canshurow: {},
      ispart: true,
    };
  },
  created() {
    this.userid = sessionStorage.getItem('userid');
    this.getList();
  },
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
  },
  methods: {
    /** 查询用户列表 */
    async getList() {
      this.loading = true;
      const canshu = {
        id: this.userid,
      };
      await this.apijs.findOneorder(canshu).then((response) => {
        console.log(response);
        //过滤撤销的工单
        this.orderlist = response.data.filter((item) => item.enable == 1);
        // this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    // 获取配件所有库存记录
    async partalllist() {
      await this.apijs.partalllist().then((res) => {
        console.log(res.data, '配件所有库存记录');
        const allpro = res.data.map((ele) => {
          return {
            value: ele.id,
            label: ele.name,
          };
        });
        this.allprooptions = allpro;
      });
    },
    /** 去维修按钮操作 */
    async handleUpdate(row) {
      if (row.state !== 0) {
        this.ispart = true;
        await this.apijs
          .findByOrIdparts({ id: row.id })
          .then((resx) => {
            // console.log(res);
            let res = resx;
            if (res.data.length > 0) {
              res.data.forEach((element) => {
                if (element.state !== 4) {
                  this.ispart = false;
                }
              });
            }
            this.loading = false;
            // console.log(this.ispart);
          })
          .catch(() => {
            this.loading = false;
          });
      }
      this.open = true;
      this.partalllist();
      this.title = '维修工单信息状态';
      this.canshurow = row;
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.selectradio == 1 && this.ispart == true) {
        //新增换件
        let canshu = {
          orderid: this.canshurow.id,
          engineersid: this.canshurow.engineers,
          name: this.peijian,
          ms: this.textarea,
        };
        console.log(canshu.name);
        if (canshu.name == '' || canshu.name == undefined) {
          this.$message({
            message: '请选择一个配件',
            type: 'error',
          });
        } else {
          this.apijs
            .addparts(canshu)
            .then((resx) => {
              // console.log(res);
              let res = resx;
              // console.log(res);
              this.$message({
                message: '新增换件成功',
                type: 'success',
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
          // 修改工单状态
          this.apijs
            .updateorder({
              id: this.canshurow.id,
              state: 1,
            })
            .then((res) => {
              if (res.code == 200) {
                this.getList();
                this.open = false;
              }
            })
            .catch(() => {
              this.loading = false;
              this.$message({
                message: '处理失败',
                type: 'error',
              });
            });
        }
      } else if (this.selectradio == 0 && this.ispart == true) {
        // 修改工单状态
        this.apijs
          .updateorder({
            id: this.canshurow.id,
            state: this.selectradio1,
          })
          .then((res) => {
            if (res.code == 200) {
              this.getList();
              this.open = false;
            }
          })
          .catch(() => {
            this.loading = false;
            this.$message({
              message: '处理失败',
              type: 'error',
            });
          });
      } else {
        this.$message({
          message: '您已提交换件申请,请勿重复提交！',
          type: 'error',
        });
        this.$router.push({ path: '/partmanage' });
      }
    },
    //查看评价按钮
    handleEdit(row) {
      // this.evaluateForm = row;
      this.evaluateopen = true;
      this.apijs.evaluatefindByOrder({ orderid: row.id }).then((res) => {
        this.evaluateForm.orderrate = res.data[0].grade;
        this.evaluateForm.orderdesc = res.data[0].ms;
      });
    },
  },
};
</script>
