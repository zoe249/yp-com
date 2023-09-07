/*
 * @Author: qiaokun
 * @Date: 2020-08-2
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 修改优惠券
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 根据id修改券模板
  putCouponTemplate(id, data) {
    return axios.put(`${config.couponService}/couponsTemplate/${id}/ruleexplain`, data)
  },
  // 根据id作废优惠券
  putCouponTemplateCancel(id) {
    return axios.put(`${config.couponService}/couponsTemplate/${id}/abandon`)
  },
  // 根据id延期优惠券天数
  putCouponTemplateDelay(id, data) {
    return axios.put(`${config.couponService}/couponsTemplate/${id}/deferdays`, data)
  }
}
export default putApi
