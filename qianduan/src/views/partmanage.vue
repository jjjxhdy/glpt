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
      <el-table-column label="换件状态" align="center" key="state" prop="state">
        <template slot-scope="scope">
          <el-tag>{{ huanjianstatetools(scope.row.state).label }}</el-tag>
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
        <template slot-scope="scope">
          <el-popconfirm
            v-if="scope.row.state == 1"
            title="确认出库？"
            @confirm="handlebutt(scope.row.id, scope.row.orderid, scope.row.name, 2)"
          >
            <el-button
              type="text"
              style="color: brown"
              icon="el-icon-warning-outline"
              slot="reference"
              >出库</el-button
            >
          </el-popconfirm>
          <el-popconfirm
            v-if="scope.row.state == 2"
            title="确认入库？"
            @confirm="handlebutt(scope.row.id, scope.row.orderid, scope.row.name, 3)"
          >
            <el-button
              type="text"
              style="color: brown"
              icon="el-icon-warning-outline"
              slot="reference"
              >入库</el-button
            >
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
    this.userid = sessionStorage.getItem('userid');
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
      const canshu = {
        id: this.userid,
      };
      await this.apijs.findByEnIdparts(canshu).then((response) => {
        // console.log(response);
        this.orderlist = response.data;
        this.loading = false;
      });
    },
    async handlebutt(id, orderid, name, val) {
      let orderstate;
      if (val == 2) {
        orderstate = 1;
      } else {
        orderstate = 2;
      }
      await this.apijs
        .updateparts({
          id: id,
          name: name,
          state: val,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '处理成功',
              type: 'success',
            });
            // this.getList();
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
              message: '处理成功',
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
