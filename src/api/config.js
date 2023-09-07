/*
 * @Author: your name
 * @Date: 2020-12-21 09:26:59
 * @LastEditTime: 2021-01-21 08:45:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\config.js
 */

const path = window.location.pathname
let baseUrl = ''
if (path.indexOf('huanghe') > 0) {
  baseUrl = '/api-gateway/hh-com'
} else if (path.indexOf('dev') > 0) {
  baseUrl = '/dev/com/api-gateway'
} else if (path.indexOf('test') > 0) {
  baseUrl = '/test/com/api-gateway'
} else {
  baseUrl = '/com/api-gateway'
}
const config = {
  baseUrl,
  // 控制会员打标签的接口版本号，统一配置
  version: '/api/v3.0.1',
  // 后台服务 api 版本号配置
  // 组织服务 api 版本号
  organService: '/organ-service/api/v3.0.1',
  // 认证服务 api 版本号(登录、验证码)
  authServer: '/auth-server/api/v3.0.2',
  // 用户服务 api 版本号
  userService: '/user-service/api/v3.0.1',
  // 文件服务 api 版本号
  fileService: '/file-service/api/v3.0.1',
  // 管理服务 api 版本号
  managementService: '/management-service/api/v3.0.1',
  // 会员服务 api 版本号
  memberService: '/member-service/api/v3.0.3',
  // 积分服务 api 版本号
  pointService: '/point-service/api/v3.0.3',
  // 销售服务 api 版本号
  saleService: '/sale-service/api/v3.0.3',
  // 微信域
  wechatService: '/wechat-service/api/v3.0.1',
  // 优惠券域
  couponService: '/coupon-service/api/v3.0.3',
  // 订单管理域
  orderService: 'order-service/api/v3.0.3'
}
export { config }
