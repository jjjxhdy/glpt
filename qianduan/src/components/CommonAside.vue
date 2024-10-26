<template>
  <el-menu default-active="1-4-1" class="el-menu-vertical-demo" mode="horizontal" @open="handleOpen"
    @close="handleClose" :collapse="isCollapse" background-color="#545c64" text-color="#fff"
    active-text-color="#ffd04b">

    <h3>{{ isCollapse ? '管理' : '智能工单管理平台' }}</h3>
    <el-menu-item v-for="item in noChildren" :key="item.name" :index="item.name" @click="clickManu(item)">
      <i :class="`el-icon-${item.icon}`"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu v-for="item in hasChildren" :key="item.label" index="1">
      <template slot="title">
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
        <el-menu-item :index="subItem.path" @click="clickManu(subItem)">{{ subItem.label }} </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>


<script>
import Cookie from 'js-cookie';
export default {
  data() {
    return {

    };
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    clickManu(item) {
      console.log(item)
      if (this.$route.path !== item.path && !(this.$route.path === '/home' && (item.path === '/'))) {
        this.$router.push(item.path)
      }
      this.$store.commit('selectMenu', item)
    },
  },
  computed: {
    //没有子菜单
    noChildren() {
      return this.menuData.filter(item => !item.children)//Array.filter（过滤成新的数组）
    },
    //有子菜单
    hasChildren() {
      return this.menuData.filter(item => item.children)//Array.filter（过滤成新的数组）
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse
    },
    menuData() {
      return JSON.parse(Cookie.get('menu')) || this.$store.state.tab.menu
    },
  }
}
</script>


<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  height: 100vh;
  border-right: none;

  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400px;
    margin: 0;

  }
}
</style>