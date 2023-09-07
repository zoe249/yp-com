/*
 * @Author: qiaokun
 * @Date: 2020-08-23
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 优惠券活动查询接口
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 分页查询优惠券模板接口
  getSaleCouponActivityList(data) {
    return axios.get(
      `${config.couponService}/couponsActivity?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&code=${data.code}&name=${data.name}&status=${data.status}&beginTime=${data.beginTime}&endTime=${data.endTime}`
    )
  },
  // 活动名称唯一性校验接口
  getCheckName(name, id) {
    return axios.get(`${config.couponService}/couponsActivity/${name}/existName?id=${id}`)
  },
  // 活动编码唯一性校验接口
  getCheckCode(code, id) {
    return axios.get(`${config.couponService}/couponsActivity/${code}/existCode?id=${id}`)
  },
  getSaleCouponActivityById(id) {
    return axios.get(`${config.couponService}/couponsActivity/${id}`)
  }
}
export default getApi
