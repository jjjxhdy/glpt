<template>
  <!-- 配件库存管理 -->
  <div class="app-container">
    <!--搜索区域-->
    <el-form size="small" :inline="true" label-width="100px">
      <el-form-item label="配件名称" prop="userName">
        <el-input
          v-model="inputvalue"
          placeholder="请输入配件名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8" v-if="roletype == 1">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addopen = true"
          >新增配件种类</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="filteredTableDatax">
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column label="配件id" align="center" key="id" prop="id" />
      <el-table-column label="配件名称" align="center" key="name" prop="name" />
      <el-table-column label="新配件数量" align="center" key="new" prop="new" />
      <el-table-column label="旧配件数量" align="center" key="old" prop="old" />
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-ishandle="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="roletype == 1"
            >修改</el-button
          >
          <el-popconfirm
            title="确认删除这个配件？"
            @confirm="handlebutt(scope.row.id)"
            v-if="roletype == 2"
          >
            <el-button
              type="text"
              style="color: brown"
              icon="el-icon-warning-outline"
              slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加库存对话框 -->
    <el-dialog
      center
      title="添加库存"
      :visible.sync="addopen"
      width="600px"
      append-to-body
      style="flex: 1"
    >
      <el-alert title="提示：请谨慎添加配件库存" type="warning"> </el-alert>
      <el-form
        label-width="80px"
        ref="addform"
        :model="addform"
        :rules="addrules"
        style="margin-top: 10px"
      >
        <el-form-item label="配件名称">
          <el-input placeholder="配件名称" v-model="addform.name"> </el-input>
        </el-form-item>
        <el-form-item label="新件数量">
          <el-input-number
            v-model="addform.num"
            :precision="0"
            :step="10"
            :min="0"
          ></el-input-number>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addsubmitForm()">确 定</el-button>
        <el-button @click="addopen = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改库存对话框 -->
    <el-dialog
      center
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      style="flex: 1"
    >
      <el-alert title="提示：请谨慎修改配件库存" type="warning"> </el-alert>
      <el-form label-width="80px" style="margin-top: 10px">
        <el-form-item label="配件名称">
          <el-input placeholder="配件名称" v-model="updateform.name" :disabled="true"> </el-input>
        </el-form-item>
        <el-form-item label="新件数量">
          <el-input-number
            v-model="updateform.new"
            :precision="0"
            :step="10"
            :min="0"
          ></el-input-number>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
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
      orderlist: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      addopen: false,
      inputvalue: '',
      addform: {
        name: '',
        num: 0,
      },
      addrules: {
        name: [{ required: true, message: '请输入配件名称', trigger: 'blur' }],
      },
      updateform: {
        id: '',
        name: '',
        new: '',
        old: '',
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
  },
  // 在Vue组件中定义计算属性
  computed: {
    huanjianstatetools() {
      return this.$tools.huanjianstatetools;
    },
    formatlevel() {
      return this.$tools.formatlevel;
    },
    filteredTableDatax() {
      // console.log(this.searchForm.functions);
      if (this.inputvalue) {
        // 将输入值转换为小写以进行不区分大小写的比较
        const inputLower = this.inputvalue.toLowerCase();
        // 使用 filter 方法过滤订单列表
        const filteredOrders = this.orderlist.filter((order) => {
          // 将订单名称转换为小写以进行不区分大小写的比较
          const nameLower = order.name.toLowerCase();
          // 使用 includes 方法检查订单名称是否包含输入值
          return nameLower.includes(this.inputvalue);
        });
        return filteredOrders;
      } else {
        return this.orderlist;
      }
    },
  },
  methods: {
    /** 查询用户列表 */
    async getList() {
      this.loading = true;
      await this.apijs.partalllist().then((response) => {
        console.log(response);
        this.orderlist = response.data;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    //添加库存
    async addsubmitForm() {
      this.$refs.addform.validate((valid) => {
        if (valid) {
          this.apijs
            .addhist(this.addform)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                });

                this.getList();
                this.addopen = false;
              }
            })
            .catch((err) => {});
        } else {
          this.$message({
            message: 'error submit!!',
            type: 'error',
          });
          //   console.log('error submit!!');
          return false;
        }
      });
    },
    /** 去维修按钮操作 */
    handleUpdate(row) {
      this.open = true;
      this.title = '修改库存';
      this.updateform = {
        id: row.id,
        name: row.name,
        new: row.new,
        old: row.new,
      };
      console.log(this.updateform);
    },
    //修改库存
    async submitForm() {
      await this.apijs
        .addhist({
          name: this.updateform.name,
          num: this.updateform.new - this.updateform.old,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '申请成功',
              type: 'success',
            });

            this.getList();
            this.open = false;
          }
        })
        .catch((err) => {});
    },
    //删除配件
    async handlebutt(id) {
      await this.apijs
        .deletepartlist({
          id: id,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success',
            });

            this.getList();
            this.open = false;
          }
        })
        .catch((err) => {});
    },
  },
};
</script>
