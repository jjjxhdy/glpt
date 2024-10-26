<template>
  <div class="tabs">
    <el-tag v-for="(item, index) in tags" :key="item.path" :closable="item.name !== 'home'"
      :effect="$route.name === item.name ? 'dark' : 'plain'" @click="changeMenu(item)" @close="handleClose(item, index)">
      {{ item.label }}</el-tag>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { mapMutations } from 'vuex';
export default {
  name: 'tagView',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      tags: state => state.tab.tabsList
    })
  },
  methods: {
    ...mapMutations(['closeTag']),
    //点击tag跳转得功能
    changeMenu(item) {
      // console.log(item)
      this.$router.push({ name: item.name })//这里面是小写，但是你的路由里面没有小写得name哦
    },
    //点击tag删除得功能
    handleClose(item, index) {
      //调用store中得mutation
      this.closeTag(item)
      const length = this.tags.length
      //删除之后得跳转逻辑
      if (item.name !== this.$route.name) {
        return
      }
      //表示得是删除得是最后一项
      if (index === length) {
        this.$router.push({
          name: this.tags[index - 1].name
        })
      } else {
        this.$router.push({
          name: this.tags[index].name
        })
      }
    }
  },
  mounted() {
    // console.log(this.tags)
  }
}
</script>

<style lang="less" scoped>
.tabs {
  padding: 20px;


  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>