/*
 * @Author: qiaokun
 * @Date: 2020-08-23
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 优惠券post接口
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 创建券活动
  postSaleCouponActivity(data) {
    return axios.post(`${config.couponService}/couponsActivity`, data)
  }
}
export default postApi
