<template>
  <!-- 工单统计页面 -->
  <div class="app-container">
    <!--查询表单-->
    <el-form size="small" :model="searchForm" :inline="true" label-width="90px">
      <el-form-item label="工程师名称" prop="userName">
        <el-select
          v-model="searchForm.username"
          placeholder="请选择工程师"
          clearable
          style="width: 240px"
          @change="findsomepro()"
          ><el-option
            v-for="item in allprooptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option
        ></el-select>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select
          v-model="searchForm.orderstate"
          @change="findsomepro()"
          placeholder="请选择换件处理状态"
          clearable
          style="width: 240px"
        >
          <el-option label="计算机" value="计算机"></el-option>
          <el-option label="打印机" value="打印机"></el-option>
          <el-option label="监控设备" value="监控设备"></el-option>
          <!-- <el-option label="" value="3"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="findsomepro()"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table :data="orderlist">
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column label="工单id" align="center" key="id" prop="id" />
      <el-table-column label="工程师id" align="center" key="engineers" prop="engineers" />
      <el-table-column label="工单维修类型" align="center" key="type" prop="type" />
      <el-table-column label="故障等级" align="center" key="level" prop="level">
        <template slot-scope="scope">
          <el-tag :type="formatlevel(scope.row.level).type">{{
            formatlevel(scope.row.level).label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="工单状态" align="center" key="state" prop="state" width="120">
        <template slot-scope="scope">
          <el-tag :type="orderstatetools(scope.row.state).type">{{
            orderstatetools(scope.row.state).label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="城市" align="center" key="city" prop="city" />
      <el-table-column label="工单所在地区" align="center" key="area" prop="area" />
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
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
      //搜索框参数
      searchForm: {
        username: '',
        orderstate: '',
      },
      //所有工程师选择器
      allprooptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      evaluateopen: false,
      options,
      // 注册列表
      orderForm: {
        processTime: '', //处理时间
        level: '',
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
        orderrate: [{ required: true, message: '请评分', trigger: 'blur' }],
        orderdesc: [{ required: true, message: '请填写评价', trigger: 'blur' }],
      },
      //路由参数用户id
      userid: '',
      canshurow: {},
      ispart: true,
    };
  },
  created() {
    this.getList();
    this.findBypro();
  },
  computed: {
    orderstatetools() {
      return this.$tools.orderstatetools;
    },
    formatlevel() {
      return this.$tools.formatlevel;
    },
  },
  methods: {
    /** 查询工程师列表 */
    async getList() {
      this.loading = true;
      await this.apijs.getallorders().then((response) => {
        this.orderlist = response.data;
        this.loading = false;
      });
    },
    /** 根据工程师id查询工单信息 */
    // async findByEorder() {
    //     let canshu = this.searchForm.username
    //     await this.apijs.findByEorder({ id: canshu }).then((res) => {

    //         this.orderlist = res.data;
    //         this.$message({
    //             message: '根据id查询成功',
    //             type: 'success',
    //         });

    //     }).catch(() => {

    //     });
    // },
    /** 查询所有工程师 */
    async findBypro() {
      await this.apijs
        .findallpro()
        .then((res) => {
          if (res.data.length !== 0) {
            const allpro = res.data.map((ele) => {
              return {
                value: ele.id,
                label: ele.username,
              };
            });
            this.allprooptions = allpro;
          } else {
          }
        })
        .catch(() => {
          console.log('error!!');
        });
    },
    /** 条件查询工单 */
    findsomepro() {
      let canshu = {
        id: this.searchForm.username,
        type: this.searchForm.orderstate,
      };
      this.apijs
        .findBySomtingorder(canshu)
        .then((res) => {
          this.orderlist = res.data;
        })
        .catch(() => {
          console.log('error!!');
        });
    },
    /** 查看评价 */
    handleEdit(row) {
      this.evaluateopen = true;
      this.apijs.evaluatefindByOrder({ orderid: row.id }).then((res) => {
        this.evaluateForm.orderrate = res.data[0].grade;
        this.evaluateForm.orderdesc = res.data[0].ms;
      });
    },
  },
};
</script>
