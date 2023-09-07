/*
 * @Author: qiaokun
 * @Date: 2020-08-23
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 优惠券put接口
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 更新券活动
  putSaleCouponActivity(id, data) {
    return axios.put(`${config.couponService}/couponsActivity/${id}`, data)
  },
  // 发布优惠券活动
  putSaleCouponActivityRelease(id) {
    return axios.put(`${config.couponService}/couponsActivity/${id}/release`)
  },
  // 撤销发布优惠券
  putSaleCouponActivityRevoke(id) {
    return axios.put(`${config.couponService}/couponsActivity/${id}/revoke`)
  },
  putSaleCouponActivityChangeStock(id, data) {
    return axios.put(`${config.couponService}/couponsActivity/${id}/changeStock`, data)
  }
}
export default putApi
