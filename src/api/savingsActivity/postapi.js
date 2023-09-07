/*
 * @Author: wangdandi
 * @Date: 2020-09-23
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 充值活动post接口
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 创建活动
  postAddRechargeDialog(params) {
    return axios.post(`${config.memberService}/savingsActivity`, params)
  }
}
export default postApi
