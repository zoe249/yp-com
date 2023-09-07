<template>
  <div style="background:#252C59;height:100%;zIndex:999;">
    <el-menu
      :unique-opened="true"
      :collapse-transition="false"
      class="el-menu-vertical-demo"
      background-color="#252C59"
      text-color="#fff"
      active-text-color="#66b1ff"
      :default-active="String(activeNav)"
      :collapse="isCollapse"
    >
      <!-- :background-color="this.$store.state.header.themeColor" -->
      <!-- <template slot="title">
      <span>123456</span>
    </template> -->
      <!-- 没有儿子的导航栏 -->
      <el-menu-item :index="'/' + item.url" v-for="item in noChildren" :key="item.url" @click="clickMenu('notfound', item.url)">
        <i :class="item.logo"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
      <!-- 有儿子的导航栏 -->
      <el-submenu :index="index + ''" v-for="(item, index) in hasChildren" :key="index">
        <template slot="title">
          <i :class="item.logo"></i>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item :index="'/' + subItem.url" v-for="(subItem, subIndex) in item.permissions" :key="subIndex" @click="clickMenu(subItem)">
          <i :class="subItem.logo"></i>
          <span slot="title">{{ subItem.name }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  data() {
    return {
      asideMenu: []
    }
  },
  created() {
    this.asideMenu = this.$store.state.aside.rightList
  },
  mounted() {},
  computed: {
    // 设置当前激活的导航
    activeNav() {
      return this.$route.path
    },
    // 左侧导航栏无子节点
    noChildren() {
      return this.asideMenu.filter(item => !item.permissions || item.permissions.length === 0)
    },
    // 左侧导航栏有子节点
    hasChildren() {
      return this.asideMenu.filter(item => item.permissions && item.permissions.length !== 0)
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
  methods: {
    // 控制左侧导航栏开启/关闭事件
    collapseMenu() {
      this.$store.commit('collapseMenu')
    },
    // 点击跳转相关路由并且将路由存储在tabList列表中
    clickMenu(item, url) {
      /**
       * 修改人：wangdandi
       * 修改内容：跳转o2o页面
       * 修改时间：2021-09-29
       * start
       */
      if (url === 'o2o') {
        var urls = 'https://www.smhwed.cn/o2o/#/login'
        window.open(urls)
      }
      /**
       * 修改人：wangdandi
       * 修改内容：跳转o2o页面
       * 修改时间：2021-09-29
       * end
       */
      if (item === 'notfound') {
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.doNotOperate'),
          type: 'warning'
        })
      } else {
        this.$router.push('/' + item.url)
        this.$store.commit('selectMenu', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/common/aside.scss';
</style>
