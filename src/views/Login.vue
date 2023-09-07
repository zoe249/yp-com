<!--
 * @FileDescription:登录界面
 * @Author: qiaokun
 * @Date: 2020-12-09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-12-24 16:37:56
 -->
<template>
  <div class="container">
    <!-- <div class="login-content"></div> -->
    <div class="top"></div>
    <div class="middle">
      <div class="middle-left"></div>
      <div class="middle-content">
        <!-- 顶部左侧logo区域 -->
        <div class="company-logo">
          <img :src="logo === '' ? 'http://qiaokun.yuepong.com/crm-logo.png' : logo" alt="" />
        </div>
        <!-- 顶部右侧图标区域 -->
        <div class="right-icon">
          <img src="http://qiaokun.yuepong.com/top-right-icon.png" alt="" />
        </div>
        <!-- 中间左侧图片区域 -->
        <div class="middle-icon">
          <!-- <img src="http://qiaokun.yuepong.com/logo-new-left.png" alt="" /> -->
          <img src="https://qiaokun.yuepong.com/comlogo.png" alt="" />
        </div>
        <!-- 表单区域 -->
        <div class="login-box">
          <div class="login-text">
            <span>{{ systemName === '' ? $t('lang.systemName') : systemName }}</span>
          </div>
          <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules">
            <el-form-item prop="username">
              <el-input v-model.trim="loginForm.username" prefix-icon="el-icon-s-custom" :placeholder="$t('lang.userName')" @input="change($event)"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model.trim="loginForm.password"
                prefix-icon="el-icon-unlock"
                :placeholder="$t('lang.password')"
                @input="change($event)"
                type="password"
                auto-complete="new-password"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item prop="validCode">
              <div class="validcode-wrapper">
                <el-input class="validcode-input" v-model.trim="loginForm.validCode" @keyup.enter.native="handleLoginForm" :placeholder="$t('lang.validCode')" @input="change($event)"></el-input>
                <img class="validcode" :src="path + loginForm.deviceId" alt="" />
                <div class="change-btn-wrapper">
                  <div class="change-btn-space"></div>
                  <el-button class="change-btn" type="text" @click="changeCaptcha">{{ $t('lang.changeCaptcha') }}</el-button>
                </div>
              </div>
            </el-form-item> -->
            <!-- <el-form-item class="btns">
              <el-button @click="handleLoginForm" class="login-btn">{{ $t('lang.login') }}</el-button>
            </el-form-item> -->
            <el-form-item class="btns">
              <el-button @click="openVerify" class="login-btn">{{ $t('lang.login') }}</el-button>
            </el-form-item>
            <div class="bottom-opt">
              <div><el-switch v-model="keepPassword" active-color="#8267c4" class="keep-pass" :width="35"></el-switch><span class="keep-pass-text">记住密码</span></div>
              <!-- <el-checkbox v-model="keepPassword" class="keep-pass">{{ $t('lang.keepPass') }}</el-checkbox> -->
              <!-- <div class="forget-pass" @click="goToModifyPassword">忘记密码</div> -->
            </div>
          </el-form>
        </div>
        <el-dialog append-to-body :visible.sync="dialogVisible" :show-close="true" width="280px" title="请完成安全验证" :close-on-click-modal="false" customClass="dialog_class">
          <template slot="title">
            <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
              {{ '请完成安全验证' }}
            </div>
          </template>
          <slideverify
            :l="42"
            ref="dialogopen"
            :r="10"
            :w="sliderWidth"
            :h="sliderHeight"
            :widthlable="widthlable"
            :block_y="block_y"
            :imgurl="imgurl"
            :miniimgurl="miniimgurl"
            @success="onSuccess"
            @refresh="onRefresh(false)"
            :slider-text="slideverifyText"
          ></slideverify>
        </el-dialog>
        <!-- 中间左侧底部 -->
        <div class="middle-left-icon">
          <!-- <img src="http://qiaokun.yuepong.com/foot-left-icon.png" alt="" /> -->
        </div>
        <!-- 中间右侧底部 -->
<!--        <div class="middle-right-icon">-->
<!--          {{ $t('lang.systemRights') }}-->
<!--          &lt;!&ndash; Copyright © 2016-2020 威海市 悦朋智能科技有限公司 All rights reserved &ndash;&gt;-->
<!--        </div>-->
      </div>
      <div class="middle-right"></div>
    </div>
    <div class="footer">
      <div class="footer-space"></div>
      <div class="footer-text">
        <span class="footer-text-style">{{ $t('lang.systemRights') }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import Img1 from '../assets/images/1.png'
import Img2 from '../assets/images/03.png'
import slideverify from '../components/slideVerify/slideVerify.vue'
import { Loading } from 'element-ui'
import qs from 'qs'
import { initDynamicRoutes } from '../router/index.js'
export default {
  components: {
    slideverify
  },
  data() {
    return {
      widthlable: '',
      sliderWidth: 250,
      sliderHeight: 140,
      slideverifyText: '向右滑动',
      // 滑动背景图片
      imgurl: '',
      // 滑块小图片
      miniimgurl: '',
      dialogVisible: false,
      block_y: null,
      puzzleShow: true,
      Img1,
      Img2,
      path: this.$path, // 验证码地址
      systemName: '', // 系统名称
      logo: '', // 图标地址
      keepPassword: false, // 记住密码
      // 登录表单数据对象
      loginForm: {
        grant_type: 'password',
        client_id: 'web_client',
        client_secret: '123',
        user_type: '1',
        username: '',
        password: '',
        validCode: '',
        deviceId: '',
        validType: 'verificationImage',
        xMoved: ''
      },
      // 登录表单的校验对象
      loginFormRules: {
        username: [
          { required: true, message: this.$t('lang.userName') + this.$t('lang.required'), trigger: 'blur' }
          // { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('lang.password') + this.$t('lang.required'), trigger: 'blur' }
          // { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
        // validCode: [
        //   {
        //     required: true,
        //     message: this.$t('lang.validCode') + this.$t('lang.required'),
        //     trigger: 'blur'
        //   }
        // ]
      }
    }
  },
  created() {
    this.getOrganizationsTop()
    sessionStorage.clear()
    this.loginForm.deviceId = this.guid()
  },
  mounted() {
    // 读取cookie
    this.getCookie()
  },
  methods: {
    async openVerify() {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return
        this.onRefresh(true)
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dialogopen.changeSuccess('')
        })
      })
    },
    async getImageVerifyCode() {
      // 获取验证码
      const res = await this.$api.getOauthApi.getSlideImgInfo()
      console.log('滑块验证码信息', res)
      var imgobj = res
      this.loginForm.deviceId = res.id
      this.block_y = imgobj.yheight
      this.imgurl = 'data:image/png;base64,' + imgobj.bigImage
      this.miniimgurl = 'data:image/png;base64,' + imgobj.smallImage
      this.widthlable = 'width:' + this.sliderWidth + 'px'
      if (this.$refs.dialogopen) {
        this.$refs.dialogopen.reset(imgobj.yheight)
      }
    },
    onRefresh(val) {
      if (!val) {
        this.$message.success('刷新成功')
        this.$refs.dialogopen.changeSuccess('')
      }
      this.imgurl = ''
      this.miniimgurl = ''
      this.getImageVerifyCode()
    },
    onSuccess(val) {
      this.loginForm.xMoved = val
      this.login()
    },
    onFail() {},
    // 登录请求接口
    getLogin() {},
    // 点击登录校验-拼图出现
    submitForm(formName) {
      // 表单校验
      this.$refs[formName].validate(valid => {
        // 验证通过
        if (valid) {
          // 拼图出现
          this.puzzleShow = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取顶级组织信息
    getOrganizationsTop() {
      this.$api.getOrganizationManagementApi.getOrganizationsTop().then(res => {
        console.log(res)
        if (res.logo) {
          this.logo = res.logo
        }
        if (res.systemName) {
          this.systemName = res.systemName
        }
      })
    },
    // uuid 生成方法
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    guid() {
      return this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4()
    },
    // 获取验证码的方法
    changeCaptcha() {
      this.loginForm.deviceId = this.guid()
      this.loginForm.validCode = ''
    },
    // 跳转修改密码界面
    goToModifyPassword() {
      this.$router.push('/forgetPassword')
    },
    // 记住密码保存数据
    setCookie(name, pwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie = 'userName' + '=' + name + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie = 'userPwd' + '=' + pwd + ';path=/;expires=' + exdate.toGMTString()
    },
    // 读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        this.keepPassword = true
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === 'userName') {
            this.loginForm.username = arr2[1] // 保存到保存数据的地方
          } else if (arr2[0] === 'userPwd') {
            this.loginForm.password = arr2[1]
          }
        }
      }
    },
    // 清除cookie
    clearCookie: function() {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    },
    // 多层嵌套无法输入解决方法
    change(e) {
      this.$forceUpdate()
    },
    // 表单重置方法
    loginFormReset() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录方法
    login() {
      var loadings
      // 在每次请求获取数据之前都开启loading弹窗
      const option = {
        lock: true,
        background: '#fff'
      }
      this.$refs.loginFormRef.validate(valid => {
        console.log(this.loginForm)
        if (!valid) return
        const loginForm = qs.stringify(this.loginForm)
        this.$api.postOauthApi
          .login(loginForm, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
          })
          .then(res => {
            this.changeCaptcha()
            console.log(res)
            if (res.status === 500) {
              this.$refs.dialogopen.changeSuccess(false)
              this.dialogVisible = false
            }
            if (res.access_token) {
              loadings = Loading.service(option)
              console.log(res)
              setTimeout(() => {
                loadings.close()
              }, 1000)
              window.sessionStorage.setItem('token', res.access_token)
              this.getMenuList()
              if (this.keepPassword) {
                this.setCookie(this.loginForm.username, this.loginForm.password, 7)
              } else {
                this.clearCookie()
              }
            }
          })
      })
    },
    getMenuList() {
      this.$api.getPermissionApi.getPermissionMenuList().then(res => {
        console.log(res)
        // 根据后端返回的数据格式来
        const menus = res
        for (var i = 0; i < menus.length; i++) {
          for (var j = 0; j < menus[i].permissions.length; j++) {
            for (var k = 0; k < menus[i].permissions[j].permissions.length; k++) {
              // 转换格式，处理按钮权限
              menus[i].permissions[j].permissions[k] = menus[i].permissions[j].permissions[k].permissionKey
            }
          }
        }
        const menulist = menus
        // 存储数据进入vuex
        this.$store.commit('setRightList', menulist)
        initDynamicRoutes()
        // 存储数据完成后跳转主页
        this.$router.push('/main')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/common/login.scss';
</style>
