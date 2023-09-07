<template>
  <div class="common-tab">
    <div class="tab-menu">
      <!-- <div class="tab-menu el-tabs__nav-wrap is-scrollable is-top"> -->
      <!-- <span class="el-tabs__nav-prev ::before">
        <i class="el-icon-arrow-left"></i>
      </span>
      <span class="el-tabs__nav-next">
        <i class="el-icon-arrow-right"></i>
      </span> -->
      <!-- <div class="el-tabs__nav-scroll"> -->
      <div>
        <el-tag
          :key="tag.url"
          v-for="tag in tags"
          :closable="tag.url !== 'home'"
          :disable-transitions="false"
          @click="changeMenu(tag)"
          @close="handleClose(tag)"
          :effect="$route.name === tag.url ? 'dark' : 'plain'"
        >
          <i v-if="tag.url === 'home'" :class="tag.logo"></i>
          {{ tag.name }}
        </el-tag>
      </div>
    </div>

    <div class="refresh-btn">
      <!-- <i class="el-icon-refresh">刷新</i> -->
      <el-dropdown size="small" @command="handleCommand">
        <span class="el-dropdown-link">快速关闭<i class="el-icon-arrow-down"></i> </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item command="closeUpPage">关闭左侧 <i class="el-icon-close"></i></el-dropdown-item>
          <el-dropdown-item command="closeDownPage">关闭右侧 <i class="el-icon-close"></i></el-dropdown-item> -->
          <el-dropdown-item command="closeOtherPage">关闭其他 <i class="el-icon-close"></i></el-dropdown-item>
          <el-dropdown-item command="closeAllPage">关闭所有 <i class="el-icon-close"></i></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="text" icon="el-icon-refresh" class="refresh" @click="refresh">刷新</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  created() {
    // 获取刷新之前获取路由的信息
    const sessionTabs = JSON.parse(sessionStorage.getItem('tabs'))
    if (sessionTabs !== null) {
      // 获取到存储的路由列表之后，将信息利用vuex进行存储
      this.$store.commit('changeSetTabs', sessionTabs.tabList)
    }
  },
  mounted() {
    // 刷新之前存储路由信息
    window.addEventListener('beforeunload', e => {
      sessionStorage.setItem(
        'tabs',
        JSON.stringify({
          tabList: this.tags,
          activeTab: this.$route.name
        })
      )
    })
  },
  computed: {
    ...mapState({
      tags: state => state.tab.tabList
    })
  },
  methods: {
    // 快速关闭
    handleCommand(command) {
      // 关闭左侧
      if (command === 'closeUpPage') {
        if (this.$route.name !== 'home') {
          this.tags.forEach((item, index) => {
            if (item.url === this.$route.name && this.tags[index - 1].url !== 'home') {
              const nextTab = this.tags[index]
              this.$store.commit('selectMenu', nextTab)
              this.$router.push({ name: nextTab.url })
              this.$store.commit('closeTab', this.tags[index - 1])
            }
          })
        }
      }
      // 关闭右侧
      if (command === 'closeDownPage') {
        this.tags.forEach((item, index) => {
          if (item.url === this.$route.name && this.tags[index + 1] !== undefined) {
            const nextTab = this.tags[index]
            this.$store.commit('selectMenu', nextTab)
            this.$router.push({ name: nextTab.url })
            this.$store.commit('closeTab', this.tags[index + 1])
          }
        })
      }
      // 关闭其他
      if (command === 'closeOtherPage') {
        this.tags.forEach((item, index) => {
          if (item.url === this.$route.name) {
            const nextTab = this.tags[index]
            this.$store.commit('colseAllTab', 'closeAll')
            this.$store.commit('selectMenu', nextTab)
            this.$router.push({ name: nextTab.url })
          }
        })
      }
      // 关闭所有
      if (command === 'closeAllPage') {
        this.$store.commit('colseAllTab', 'closeAll')
        this.$router.push({ name: 'home' })
      }
    },
    // 点击切换页面方法
    changeMenu(item) {
      console.log(item)
      console.log(item.url)
      this.$router.push('/' + item.url)
      this.$store.commit('selectMenu', item)
    },
    // 关闭界面的方法
    handleClose(tag) {
      this.tags.forEach((item, index) => {
        if (item.url === tag.url && tag.url === this.$route.name) {
          const nextTab = this.tags[index + 1] || this.tags[index - 1]
          if (nextTab) {
            this.$store.commit('selectMenu', nextTab)
            this.$router.push({ name: nextTab.url })
          }
        } else {
          this.$router.push({ name: this.$route.name })
        }
      })
      this.$store.commit('closeTab', tag)
    },
    // 刷新方法
    refresh() {
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/common/tab.scss';
</style>
