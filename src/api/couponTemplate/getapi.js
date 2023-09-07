/*
 * @Author: qiaokun
 * @Date: 2020-08-20
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 优惠券模板查询接口
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 分页查询优惠券模板接口
  getCouponTemplateList(data) {
    return axios.get(`${config.couponService}/couponsTemplate?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&code=${data.code}&name=${data.name}&type=${data.type}&status=${data.status}`)
  },
  // 根据id查询优惠券模板接口
  getCouponTemplateById(id) {
    return axios.get(`${config.couponService}/couponsTemplate/${id}`)
  },
  // 券名称唯一性校验
  getCheckName(name, id) {
    return axios.get(`${config.couponService}/couponsTemplate/nameUnique?name=${name}&id=${id}`)
  }
}
export default getApi
