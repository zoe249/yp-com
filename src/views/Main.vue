<template>
  <div class="container">
    <div class="top-header" :style="{ background: this.$store.state.header.themeColor }">
      <div class="header-info" :style="{ background: this.$store.state.header.themeColor }">
        <div class="info-wrapper">
          <img :src="logo" alt="" class="logo" @click="goToHome" />
          <div class="info-text">
            <span class="system-name">{{ systemName === '' ? $t('lang.systemName') : systemName }}</span>
            <span class="tag-line">{{ tagline }}</span>
          </div>
          <div class="cell-wrapper" @click="collapseMenu"><i :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i></div>
        </div>
      </div>
      <common-header></common-header>
    </div>
    <el-container>
      <el-aside width="auto" :style="{ height: height }">
        <!-- 左侧导航栏组件 -->
        <common-aside></common-aside>
      </el-aside>
      <el-main>
        <common-tab class="tab-wrapper"></common-tab>
        <el-main :style="{ height: mainHeight, width: '100%', padding: '0 10px' }" class="scoll">
          <router-view class="back"></router-view>
        </el-main>
      </el-main>
    </el-container>
    <div class="header-info" :style="{ background: this.$store.state.header.themeColor }">
      <div class="info-wrapper">
        <img :src="logo" alt="" class="logo" @click="goToHome" />
        <div class="info-text">
          <span class="system-name">{{ systemName === '' ? $t('lang.systemName') : systemName }}</span>
          <span class="tag-line">{{ tagline }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入导航栏组件
import CommonAside from '@/components/common/CommonAside.vue'
// 导入首页头部组件
import CommonHeader from '@/components/common/CommonHeader.vue'
// 导入tabs组件
import CommonTab from '@/components/common/CommonTab.vue'
export default {
  // 组件注册
  components: {
    CommonAside,
    CommonHeader,
    CommonTab
  },
  data() {
    return {
      systemName: '',
      logo: 'http://qiaokun.yuepong.com/crm-logo.png',
      tagline: '',
      height: '',
      mainHeight: ''
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
  created() {
    this.getOrganizationsTop()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight + 'px'
      this.mainHeight = window.innerHeight - 120 + 'px'
    },
    goToHome() {
      this.$router.push('/home')
    },
    // 获取顶级组织信息
    getOrganizationsTop() {
      this.$api.getOrganizationManagementApi.getOrganizationsTop().then(res => {
        // console.log(res)
        if (res.logo) {
          this.logo = res.logo
        }
        if (res.systemName) {
          this.systemName = res.systemName
        }
        if (res.tagline) {
          this.tagline = res.tagline
        }
      })
    },
    // 控制左侧导航栏开启/关闭事件
    collapseMenu() {
      this.$store.commit('collapseMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
}
.back {
  margin-top: 10px;
  padding: 10px 10px;
  background: #fff;
}
.container {
  width: 100%;
  height: 100vh;
  background: #f7f6fb;
}
.el-main {
  position: relative;
  padding: 60px 0px 0px 0px;
  margin: 0;
}
.tab-wrapper {
  width: 100%;
  top: 0;
  left: 0;
}
.top-header {
  width: 100%;
  height: 60px;
  background: chartreuse;
  position: fixed;
  z-index: 1000;
}
.el-aside {
  // height: 100vh - 60px;
  // background: red;
  padding-top: 60px;
  // margin-top: 60px;
}
.main-wrapper {
  // margin-top: 60px;
  // padding-top: 60px;
  // overflow: hidden;
  // width: 100%;
  // background: #6699ff;
  padding: 60px 0px 0px 0px;
}
.header-info {
  background-color: $theme-color;
  height: 60px;
  width: 500px;
  position: fixed;
  z-index: 9;
}
.info-wrapper {
  display: flex;
  align-items: center;
  width: 90%;
  height: 100%;
  color: #fff;
  // background: red;
}
.logo {
  width: 50px;
  height: 35px;
  margin-left: 20px;
  margin-right: 20px;
  cursor: pointer;
}
.info-text {
  display: flex;
  flex-direction: column;
}
.system-name {
  font-size: 18px;
  font-family: MicrosoftYaHei-Bold;
}
.tag-line {
  font-size: 14px;
}
.cell-wrapper {
  margin-left: 20px;
  width: 60px;
  height: 100%;
  line-height: 60px;
  font-size: 24px;
  cursor: pointer;
}
// @import '~@/assets/scss/common/main.scss';
</style>
