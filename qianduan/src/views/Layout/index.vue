<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"
        default-active="1"
        @select="changeSidebar"
        background-color="#314157"
        text-color="#fff"
        active-text-color="#4582C8"
      >
        <h1 style="text-align: center; color: #fff; font-size: medium" v-if="roletype == 0">
          {{ isCollapse ? '客户' : '客户功能导航' }}
        </h1>
        <h1 style="text-align: center; color: #fff; font-size: medium" v-if="roletype == 1">
          {{ isCollapse ? '工程师' : '工程师功能导航' }}
        </h1>
        <h1 style="text-align: center; color: #fff; font-size: medium" v-if="roletype == 2">
          {{ isCollapse ? '管理员' : '管理员功能导航' }}
        </h1>
        <!-- v-if="roletype == 2"为路由权限管理 -->
        <el-menu-item index="home" v-if="roletype == 2">
          <i class="el-icon-data-line"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="order" v-if="roletype == 1">
          <i class="el-icon-tickets"></i>
          <span slot="title">工单管理</span>
        </el-menu-item>
        <el-menu-item index="transaction" v-if="roletype == 0">
          <i class="el-icon-document-checked"></i>
          <span slot="title">受理中心</span>
        </el-menu-item>
        <el-menu-item index="Usermanagement" v-if="roletype == 2">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="Replacmanagement" v-if="roletype == 2">
          <i class="el-icon-setting"></i>
          <span slot="title">换件管理</span>
        </el-menu-item>
        <el-menu-item index="partmanage" v-if="roletype == 1">
          <i class="el-icon-brush"></i>
          <span slot="title">换件管理</span>
        </el-menu-item>
        <el-menu-item index="allordernum" v-if="roletype == 2">
          <i class="el-icon-s-data"></i>
          <span slot="title">工单统计</span>
        </el-menu-item>
        <el-menu-item index="inventoryparts" v-if="roletype == 2 || roletype == 1">
          <i class="el-icon-s-data"></i>
          <span slot="title">配件库存</span>
        </el-menu-item>
        <el-menu-item index="histparts" v-if="roletype == 2 || roletype == 1">
          <i class="el-icon-s-data"></i>
          <span slot="title">维修管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="height: 50px">
        <i
          style="float: left; margin-top: 18px"
          @click="toggleCollapse"
          :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        ></i>
        <span style="float: left; margin: 15px 0 0 10px">{{ itemname }}</span>
        <el-popconfirm title="确定退出登录吗？" @confirm="logout()">
          <img
            slot="reference"
            style="height: 40px; margin-top: 5px; float: right"
            src="../../assets/img/logo.jpg"
            alt=""
          />
        </el-popconfirm>
        <p style="float: right; margin-top: 18px; color: firebrick">
          欢迎使用海南好思达运维服务支撑系统：{{ usernamelayout }} ！
        </p>
      </el-header>
      <el-main>
        <!-- 仔细看，核心在这，这里是路由的出口-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      nowDate: '',
      roletype: '',
      itemname: 'home',
      usernamelayout: '',
    };
  },
  created() {
    this.roletype = sessionStorage.getItem('roletype');
    this.usernamelayout = sessionStorage.getItem('username');
  },
  mounted() {
    this.sidebarItem = this.$route.name;
    // this.currentTime();
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse; //点击折叠按钮后，对isCollapse进行取反
    },
    changeSidebar(path) {
      this.$router.push(path);
      this.itemname = path;
    },
    logout() {
      this.$router.push('./');
    },
  },
};
</script>

<style scoped>
.el-container {
  height: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
}

.el-menu {
  height: 100%;
  background-color: #314157;
}

.el-header {
  background-color: #fff;
  color: #313131;
  font-size: 16px;
  text-align: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  height: 40px;
  z-index: 2000;
  /* 水平偏移量 | 垂直偏移量 | 模糊半径 | 阴影颜色 */
}
</style>
