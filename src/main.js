/*
 * @Author: your name
 * @Date: 2020-12-14 10:16:03
 * @LastEditTime: 2021-01-25 10:53:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'

// 导入字体图标库
import './assets/fonts/iconfont.css'
import './assets/fonts/iconfont_giftCardSell.css'
import './plugins/element.js'
import ElementUI from 'element-ui'
import './assets/scss/global.scss'
import '../theme/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import './util/flexible'
import router from './router'
import store from './store'
// 导入全局样式表

// 导入全局接口入口文件
import api from './api/index'
// 导入国际化i18n
import VueI18n from 'vue-i18n'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入全局mock
// import './mock'
// 导入自定义指令-拖拽
import './directive/drafting.js'
// 导入自定义指令-权限
import './directive/permission.js'
// 导入rem样式
// import 'lib-flexible/flexible'
// import './util/rem'

// 函数防抖处理 start
const on = Vue.prototype.$on
Vue.prototype.$on = function(event, func) {
  let timer
  let newFunc = func
  if (event === 'click') {
    newFunc = function() {
      clearTimeout(timer)
      timer = setTimeout(function() {
        func.apply(this, arguments)
      }, 300)
    }
  }
  on.call(this, event, newFunc)
}
console.log('process', process.env.NODE_ENV)
// 函数防抖处理 end
Vue.config.productionTip = false
Vue.use(VueI18n) // 通过插件的形式挂载
Vue.use(VueQuillEditor) // 导入富文本编辑器
Vue.use(ElementUI)
const i18n = new VueI18n({
  locale: 'zh-CN', // 语言标识
  // this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh-CN': require('./assets/lang/zh'), // 中文语言包
    'en-US': require('./assets/lang/en') // 英文语言包
  }
})
// 将导入的接口文件全局挂载在vue全局上
Vue.prototype.$api = api
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
