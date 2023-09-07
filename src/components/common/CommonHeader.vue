<template>
  <div class="header" :style="{ background: this.$store.state.header.themeColor }">
    <!-- 头部左侧导航折叠按钮 -->
    <div>
      <!-- <i class="el-icon-s-fold" v-show="!isCollapse" @click="collapseMenu"></i>
      <i class="el-icon-s-unfold" v-show="isCollapse" @click="collapseMenu"></i> -->
    </div>
    <!-- 右侧工具栏部分 -->
    <div class="opt-wrapper">
      <div class="lang">
        <span style="color:blue;fontSize:14px;">版本号：<i>v4.0.2</i></span>
      </div>
      <!-- 主题选择 -->
      <div class="theme-picker">
        <theme-picker :default="currentThemeColor"></theme-picker>
      </div>
      <!-- 语言切换 -->
      <div class="lang">
        <el-dropdown :hide-on-click="false" @command="changeLang">
          <span class="el-dropdown-link">{{ lang }}<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh-CN">{{ $t('lang.chinese') }}</el-dropdown-item>
            <el-dropdown-item command="en-US">{{ $t('lang.engLish') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 是否全屏 -->
      <div class="fullScreen">
        <i class="iconfont icon-caozuo-quanping-shousuo" v-show="isFullscreen" @click="screen"></i>
        <i class="iconfont icon-icon-GIS_quanping" v-show="!isFullscreen" @click="screen"></i>
      </div>
      <div class="lang">{{ $t('lang.welcome') }}，{{ currentUser.realName }}</div>
      <!-- 用户信息、退出登录 -->
      <div class="lang">
        <el-dropdown :hide-on-click="false" @command="handleCommand">
          <span class="el-dropdown-link"> <img :src="currentUser.avatar ? currentUser.avatar : avatar" alt="" class="avatar"/></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo"><i class="el-icon-info"></i>{{ $t('lang.personal') }}</el-dropdown-item>
            <el-dropdown-item command="modifyPassword"><i class="el-icon-lock"></i>{{ $t('lang.modifyPassWord') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="logout">
        <el-popconfirm confirm-button-text="确定" @confirm="logout" cancel-button-text="取消" icon="el-icon-info" icon-color="orange" title="您确定要退出吗？">
          <i class="iconfont icon-tuichu" slot="reference"></i>
          <!-- <el-button >退出</el-button> -->
          <!-- @click="logout" -->
        </el-popconfirm>
      </div>
    </div>

    <el-drawer :visible.sync="drawer" :with-header="false" style="color:#000;zIndex:999;" size="20%" :append-to-body="true">
      <yp-user-info :currentUser="currentUser" @closeDrawer="closeDrawer"></yp-user-info>
    </el-drawer>
    <el-dialog :title="$t('lang.modifyPassWord')" :append-to-body="true" :visible.sync="dialogVisible" width="30%" @close="clearDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ $t('lang.modifyPassWord') }}
        </div>
      </template>
      <el-form :model="modifyPassForm" :rules="modifyPassFormRules" label-width="100px" ref="modifyPassFormRef" label-position="right">
        <el-form-item label="账户:" prop="code">
          <el-input v-model="modifyPassForm.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="旧密码:" prop="oldPassword">
          <el-input type="password" v-model="modifyPassForm.oldPassword" :show-password="true"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input type="password" v-model="modifyPassForm.newPassword" :show-password="true"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop="confirmNewPassword">
          <el-input type="password" v-model="modifyPassForm.confirmNewPassword" :show-password="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="confirmModify">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入选择主题组件
import ThemePicker from '@/components/ThemePicker/ThemePicker'
import YpUserInfo from '@/components/userInfo/YpUserInfo.vue'
import { mapState } from 'vuex'
import screenfull from 'screenfull'
export default {
  components: {
    ThemePicker,
    YpUserInfo
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认新密码'))
      } else if (value !== this.modifyPassForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      modifyPassForm: {
        code: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      modifyPassFormRules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmNewPassword: [
          { required: true, message: '请输入确认新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      currentThemeColor: '', //
      currentUser: {}, // 当前用户信息
      realName: '',
      drawer: false, // 默认抽屉是关闭的
      isFullscreen: false, // 是否是全屏
      avatar: require('@/assets/images/admin-logo.jpg')
    }
  },
  computed: {
    ...mapState({
      isCollapse: state => state.tab.isCollapse,
      lang: state => state.header.lang
    }),
    modifyPassFormLabel() {
      return [
        {
          label: '账户:',
          prop: 'code',
          disabled: 'true'
        },
        {
          label: '旧密码:',
          prop: 'oldPassword'
        },
        {
          label: '新密码:',
          prop: 'newPassword'
        },
        {
          label: '确认新密码:',
          prop: 'confirmNewPassword'
        }
      ]
    }
  },
  created() {
    this.getCurrentUserInfo()
    if (this.$store.state.header.themeColor) {
      this.currentThemeColor = this.$store.state.header.themeColor
    } else {
      this.currentThemeColor = '#409EFF'
    }
    // 获取刷新之前的语言信息
    const sessionLang = JSON.parse(sessionStorage.getItem('currentLang'))
    if (sessionLang !== null) {
      this.currentThemeColor = sessionLang.currentThemeColor
      // 获取到存储的路由列表之后，将信息利用vuex进行存储
      if (sessionLang.currentLang === 'EngLish') {
        this.$i18n.locale = 'en-US'
        this.$store.commit('changeLang', 'en-US')
      }
      if (sessionLang.currentLang === '中文') {
        this.$i18n.locale = 'zh-CN'
        this.$store.commit('changeLang', 'zh-CN')
      }
    }
  },
  mounted() {
    // 刷新之前存储当前语言信息
    window.addEventListener('beforeunload', e => {
      sessionStorage.setItem(
        'currentLang',
        JSON.stringify({
          currentLang: this.lang,
          currentThemeColor: this.$store.state.header.themeColor
        })
      )
    })
  },
  methods: {
    closeDrawer(val) {
      this.drawer = val
    },
    // 退出方法
    handleCommand(command) {
      if (command === 'logout') {
        sessionStorage.clear()
        sessionStorage.removeItem('tabs')
        this.logout()
      }
      if (command === 'userinfo') {
        this.drawer = true
      }
      if (command === 'modifyPassword') {
        this.$api.getUserApi.getCurrentUser().then(res => {
          if (res) {
            this.modifyPassForm.code = res.code
            this.dialogVisible = true
          }
        })
      }
    },
    clearDialog() {
      this.$refs.modifyPassFormRef.resetFields()
    },
    // 确认修改密码
    confirmModify() {
      this.$refs.modifyPassFormRef.validate(valid => {
        if (!valid) return
        delete this.modifyPassForm.confirmNewPassword
        this.$api.putUserApi.putUserPassword(this.modifyPassForm).then(res => {
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.dialogVisible = false
          }
        })
      })
    },
    logout() {
      this.$router.push('/login')
      window.location.reload()
    },
    getCurrentUserInfo() {
      this.$api.getUserApi.getCurrentUser().then(res => {
        this.currentUser = res
      })
    },
    // 控制左侧导航栏开启/关闭事件
    collapseMenu() {
      this.$store.commit('collapseMenu')
    },
    // 切换语言
    changeLang(command) {
      if (command === 'zh-CN') {
        this.$i18n.locale = 'zh-CN'
      }
      if (command === 'en-US') {
        this.$i18n.locale = 'en-US'
      }
      this.$store.commit('changeLang', command)
    },
    // 控制是否是全屏还是非全屏
    screen() {
      // 如果不允许进入全屏，发出不允许提示
      // if (!screenfull.enabled) {
      //   this.$message('您的浏览器不能全屏')
      //   return false
      // }
      screenfull.toggle()
      this.isFullscreen = !screenfull.isFullscreen
      // console.log(screenfull.isFullscreen)
      // this.$message.success('全屏啦')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/common/header.scss';
</style>
