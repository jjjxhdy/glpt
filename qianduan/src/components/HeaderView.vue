<template>
  <div class="header-content">
    <div class="l-content">
      <!-- 左侧 -->
      <!-- <el-button @click="handleMenu" icon="el-icon-menu" size="mini"></el-button> -->
      <!-- 面包屑 -->

      <el-menu default-active="1-4-1" class="el-menu-vertical-demo" mode="horizontal" @open="handleOpen"
        @close="handleClose" :collapse="isCollapse" background-color="#857169" text-color="#000000"
        active-text-color="#ffffff">
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

      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in tags" :key="item.path"  :to="{ path:item.path }">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb> -->
    </div>
    <span style="color: #000000;font-size: 24px;margin-right: 150px;">智慧客服系统</span>
    <div class="r-content">
      <!-- 右侧 。。。。-->
      <el-dropdown @command="handClick">
        <span class="el-dropdown-link">
          <img class="user" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="">
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
//vuex辅助函数
import { mapState } from 'vuex';
import Cookie from 'js-cookie';
export default {
  methods: {
    handleMenu() {
      this.$store.commit('collapseMenu')
    },
    handClick(command) {
      if (command === 'logout') {
        Cookie.remove('token')
        this.$router.push('login')
      }
    },
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
    ...mapState({//...扩展运算符。作用是遍历当前使用的对象能够访问到的所有属性，并将属性放入当前对象中。
      tags: state => state.tab.tabsList
    })
  },
  mounted() {
    // console.log(this.tags,'tags')
  }
}
</script>

<style lang="less" scoped>
.header-content {
  padding: 0 20px;
  background-color: #857169;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-menu-item {
    height: 60px;
    // line-height: 38px;
    border-right: none;
  }

  .text {
    color: #fff;
    font-size: 14px;
    margin-left: 10px;
  }

  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .l-content {
    display: flex;
    align-items: center;

  }
}
</style>