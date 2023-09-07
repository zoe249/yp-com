/*
 * @Author: qiaokun
 * @Date: 2020-08-2
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 优惠券模板提交
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 分页查询优惠券模板接口
  postCouponTemplate(data) {
    return axios.post(`${config.couponService}/couponsTemplate`, data)
  }
}
export default postApi
