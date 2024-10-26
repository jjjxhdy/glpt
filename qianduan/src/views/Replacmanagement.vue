<template>
  <!-- 换件管理页面 -->
  <div class="app-container">
    <!--搜索区域-->
    <el-form size="small" :inline="true" label-width="100px">
      <el-form-item label="换件处理状态">
        <el-select
          v-model="searchForm.huanjianstate"
          placeholder="请选择换件处理状态"
          clearable
          style="width: 240px"
        >
          <el-option label="未审核" value="0"></el-option>
          <el-option label="待出库" value="1"></el-option>
          <el-option label="待入库" value="2"></el-option>
          <el-option label="结束" value="3"></el-option>
          <el-option label="驳回" value="4"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="filteredTableDatax">
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column label="换件id" align="center" key="id" prop="id" />
      <el-table-column label="工单id" align="center" key="orderid" prop="orderid" />
      <el-table-column label="工程师id" align="center" key="engineersid" prop="engineersid" />
      <!-- <el-table-column label="有无工程师处理" align="center" key="engineers" prop="engineers" /> -->
      <el-table-column label="换件状态" align="center" key="state" prop="state">
        <template slot-scope="scope">
          <el-tag :type="huanjianstatetools(scope.row.state).type">{{
            huanjianstatetools(scope.row.state).label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="换件名称" align="center" key="name" prop="name" />
      <el-table-column
        label="换件理由"
        :show-overflow-tooltip="true"
        align="center"
        key="ms"
        prop="ms"
      />
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-ishandle="small-padding fixed-width"
      >
        <template slot-scope="scope" v-if="scope.row.state == 0">
          <el-popconfirm
            title="确定驳回换件吗？"
            @confirm="handlebutt(scope.row.id, scope.row.orderid, 0)"
          >
            <el-button
              type="text"
              style="color: brown"
              icon="el-icon-warning-outline"
              slot="reference"
              >驳回</el-button
            >
          </el-popconfirm>
          <el-popconfirm
            title="确定同意换件吗？"
            @confirm="handlebutt(scope.row.id, scope.row.orderid, 1)"
          >
            <el-button icon="el-icon-check" type="text" slot="reference">同意</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
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
      orderlist: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      searchForm: {
        huanjianstate: '',
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
    };
  },
  created() {
    // this.userid = sessionStorage.getItem('userid');
    this.getList();
  },
  // 在Vue组件中定义计算属性
  computed: {
    filteredTableDatax() {
      if (this.searchForm.huanjianstate) {
        return this.orderlist.filter((item) => item.state == this.searchForm.huanjianstate);
      } else {
        return this.orderlist;
      }
    },
    huanjianstatetools() {
      return this.$tools.huanjianstatetools;
    },
  },
  methods: {
    /** 查询用户列表 */
    async getList() {
      this.loading = true;
      await this.apijs.allparts().then((response) => {
        // console.log(response);
        this.orderlist = response.data;
        this.loading = false;
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
    /** 去维修按钮操作 */
    handleUpdate(row) {
      this.open = true;
      this.title = '维修工单信息状态';
    },
    async handlebutt(id, orderid, val) {
      let orderstate;
      let huanjianstate;
      if (val == 0) {
        orderstate = 3;
        huanjianstate = 4;
      } else {
        orderstate = 1;
        huanjianstate = 1;
      }
      await this.apijs
        .updateparts({
          id: id,
          state: huanjianstate,
        })
        .then((res) => {
          if (res.code == 200) {
          }
        })
        .catch((err) => {});
      await this.apijs
        .updateorder({
          id: orderid,
          state: orderstate,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '处理成功！',
              type: 'success',
            });
            this.getList();
          }
        })
        .catch((err) => {});
    },
  },
};
</script>
