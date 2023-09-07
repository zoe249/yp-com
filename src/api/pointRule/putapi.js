/*
 * @Author: 谯坤
 * @Date: 2021-06-07 08:50:02
 * @LastEditTime: null
 * @LastEditors: null
 * @Description: null
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  /**
   * 描述：根据积分规则id 修改积分规则数据
   * @param {*} params
   * @returns
   */
  putPointRule(params) {
    return axios.put(`${config.pointService}/pointRules/` + `${params.id}`, params)
  },
  /**
   * 描述：根据积分规则id 修改积分规则状态
   * @param {*} id 当前积分规则
   * @param {*} params  状态
   * @returns
   */
  putPointRuleStatus(id, params) {
    return axios.put(`${config.pointService}/pointRules/` + id, params)
  }
}
export default putApi
