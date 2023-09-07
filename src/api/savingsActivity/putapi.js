/*
 * @Author: wangdandi
 * @Date: 2020-09-22
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 充值活动put接口
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 撤销充值活动发不接口
  putUnPublishSavingsActivity(id) {
    return axios.put(`${config.memberService}/savingsActivity/${id}/revoke`)
  },
  // 根据id发布活动
  putPublishSavingsActivityId(id) {
    return axios.put(`${config.memberService}/savingsActivity/${id}/release`)
  },
  // 修改充值活动接口
  putAddRechargeDialog(params, id) {
    return axios.put(`${config.memberService}/savingsActivity/${id}`, params)
  }
}
export default putApi
