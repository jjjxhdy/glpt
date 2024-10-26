<template>
  <!-- 维修管理 -->
  <div class="app-container">
    <!--搜索区域-->
    <el-form size="small" :inline="true" label-width="100px">
      <el-form-item label="配件名称" prop="userName">
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
    </el-form>
    <el-table :data="filteredTableDatax">
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column label="配件id" align="center" key="id" prop="id" />
      <el-table-column label="配件名称" align="center" key="name" prop="name" />
      <el-table-column label="修改数量" align="center" key="num" prop="num" />
      <el-table-column label="审核状态" align="center" key="state" prop="functions" width="120">
        <template slot-scope="scope">
          <el-tag :type="statefunctions(scope.row.state).type">{{
            statefunctions(scope.row.state).label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-ishandle="small-padding fixed-width"
      >
        <template slot-scope="scope" >
          <el-popconfirm title="确认同意修改这个配件？" @confirm="handlebutt(scope.row, 1)" v-if="roletype == 2 && scope.row.state == 0">
            <el-button
              type="text"
              style="color: chartreuse"
              icon="el-icon-warning-outline"
              slot="reference"
              >同意</el-button
            >
          </el-popconfirm>
          <el-popconfirm title="确认驳回修改这个配件？" @confirm="handlebutt(scope.row, 2)" v-if="roletype == 2 && scope.row.state == 0">
            <el-button
              type="text"
              style="color: brown"
              icon="el-icon-warning-outline"
              slot="reference"
              >驳回</el-button
            >
          </el-popconfirm>
          <el-popconfirm title="确定撤销这个库存修改申请吗？" @confirm="handleDelete(scope.row)" v-if="roletype == 1 && scope.row.state == 0">
            <el-button type="text" icon="el-icon-delete" slot="reference">撤销</el-button>
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
      //配件选择框选项
      allprooptions: [],
      //配件选择框绑定值
      peijian: '',
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      addopen: false,
      addform: {
        name: '',
        new: 0,
      },
      addrules: {
        name: [{ required: true, message: '请输入配件名称', trigger: 'blur' }],
      },
      updateform: {
        id: '',
        name: '',
        new: '',
      },
      //路由参数用户id
      userid: '',
      roletype: '',
    };
  },
  created() {
    this.roletype = sessionStorage.getItem('roletype');
    // this.userid = sessionStorage.getItem('userid');
    this.getList();
    this.partalllist();
  },
  // 在Vue组件中定义计算属性
  computed: {
    filteredTableDatax() {
      if (this.peijian) {
        return this.orderlist.filter((item) => item.name == this.peijian);
      } else {
        return this.orderlist;
      }
    },
    huanjianstatetools() {
      return this.$tools.huanjianstatetools;
    },
    statefunctions() {
      return this.$tools.statefunctions;
    },
  },
  methods: {
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
    /** 查询用户列表 */
    async getList() {
      this.loading = true;
      await this.apijs.histparts().then((response) => {
        console.log(response);
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
    //删除配件
    async handlebutt(row, state) {
      await this.apijs
        .updatehist({
          id: row.id,
          name: row.name,
          num: row.num,
          state: state,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '处理成功',
              type: 'success',
            });

            this.getList();
            this.open = false;
          }
        })
        .catch((err) => {});
    },
    //撤销
    handleDelete(row) {
      const id = row.id;
      if (row.state == 0) {
        let canshu = {
          id: id,
        };
        this.apijs
          .cancelhist(canshu)
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
  },
};
</script>
