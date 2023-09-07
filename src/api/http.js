// 导入  axios
import axios from 'axios'
import { Message, Notification } from 'element-ui'
import Vue from 'vue'

import { config } from './config'

// switch (process.env.NODE_ENV) {
//   case 'production':
//     // 发布上线、生产环境的请求地址
//     // axios.defaults.baseURL = 'https://o2o.yuepong.com/api-gateway/hh-com' // 黄河
// axios.defaults.baseURL = 'https://www.smhwed.cn/com/api-gateway' // 温尔登
axios.defaults.baseURL = 'https://www.yuepong.cn/test/com/api-gateway' // 测试环境
//     // axios.defaults.baseURL = 'https://www.yuepong.cn/dev/com/api-gateway' // 开发环境
//     break
//   case 'test':
//     // 测试环境的请求地址
//     // axios.defaults.baseURL = 'http://dev.yuepong.com:9091'
//     // axios.defaults.baseURL = 'https://dev.yuepong.com:9093/api-gateway' // 开发环境
//     break
//   default:
//     // axios.defaults.baseURL = 'https://dev.yuepong.com:9093/api-gateway'
//     // 除了生产环境、测试环境，剩下的环境，比如开发环境"development"
//     // axios.defaults.baseURL = 'https://o2o.yuepong.com/api-gateway/hh-com' // 黄河
//     axios.defaults.baseURL = '/com/api-gateway' // 线上 测试环境
//     // axios.defaults.baseURL = 'https://www.yuepong.cn/dev/com/api-gateway' // 开发环境
//   // axios.defaults.baseURL = 'http://localhost:8080'
// }
// axios.defaults.baseURL = config.baseUrl

// 获取验证码地址设置
Vue.prototype.$path = axios.defaults.baseURL + `${config.authServer}/verificationCodes/captcha/`
// 设置七牛云的上传域名
// Vue.prototype.$domain = 'https://upload-z1.qiniup.com' // 线上
// 新客户 0220706  温尔登
Vue.prototype.$domain = 'https://upload-z2.qiniup.com'
// Vue.prototype.$domain = 'http://up-z1.qiniu.com' // 线下
Vue.prototype.$notify = Notification
/*
 * 设置超时时间和跨域，是否允许携带凭证
 */
axios.defaults.timeout = 50000
// axios.defaults.withCredentials = true

/*
 * 设置请求传递数据的格式（具体要看服务器要求什么格式，一般情况不用）
 * 比如 x-www-form-urlencoded
 */

// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.transformRequest = data => qs.stringify(data)

// 定义一个变量，用来控制请求时加载提示样式，前提是要全局安装了element-ui
// var loadings

/*
 * 设置请求拦截器 客户端发送请求->[ 请求拦截器 ] -> 服务器
 * TOEKN 校验（JWT）, 接收服务器返回的token，存储到vue/本地存储
 */
axios.interceptors.request.use(
  config => {
    // 携带上token
    const token = window.sessionStorage.getItem('token')
    // 在每次发起请求在请求头上加上token值
    token && (config.headers.Authorization = 'bearer ' + token)
    config.headers.isAjax = 'true'
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/*
 * 响应拦截器
 * 服务器返回信息 -> [拦截器的统一处理] ->客户端js获取到信息
 */
axios.defaults.validateStatus = status => {
  // 自定义响应成功的HTTP状态码
  return /^(2|3)\d{2}$/.test(status)
}
// axios.defaults.validateStatus = status => {
//   // 自定义响应成功的HTTP状态码
//   return /^(2|3)\d{2}$/.test(status)
// }
axios.interceptors.response.use(
  response => {
    // 没法统一处理，接口返回code不统一，目前发现20000和1001都是成功code，不知道还会不会有其他情况
    // if (response.data.code && response.data.code !== '200000') {
    //   return Message.error(response.data.message || '接口返回异常')
    // }
    return response.data
  },
  error => {
    // loadings.close()
    const { response } = error
    if (response) {
      // 服务器返回了，最起码有结果
      switch (response.status) {
        case 401:
          // 当前请求需要用户验证（一般是未登录）
          // 下次有时间查资料整理此处跳转登录页面
          window.open('/com/#/login/', '_top')
          break
        case 403:
          // 服务器已经理解请求，但是拒绝执行它（一般是token过期）
          // 有时间补充资料来跳转登录界面
          localStorage.removeItem('token')
          window.open('/com/#/login/', '_top')
          break
        case 404:
          // 请求失败，请求所希望得到的资源未被在服务器上发现

          // 可强制跳转到404页面
          Message.error('404,请求资源不存在！')
          break
        // case 500:
        //   // alert('提示:' + response.data.detail)
        //   Notification.error({
        //     title: '业务提示',
        //     message: response.data.detail + ',请点击刷新重试',
        //     duration: 2000
        //   })
        //   break
        default:
          Notification.error({
            title: '业务提示',
            message: response.data.detail + ',请点击刷新重试',
            duration: 2000
          })
          break
        // setTimeout(() => {
        //   window.location.reload()
        // }, 1000)
        // Message.error('提示:' + response.data.detail)
        // 服务器异常（一般是业务报的错）
        // break
      }
    } else {
      // 服务器连结果都没有返回
      if (!window.navigator.onLine) {
        // 断网处理：可以跳转到断网页面
        return
      }
      return Promise.reject(error)
    }
  }
)
// 导出封装的axios
export default axios
