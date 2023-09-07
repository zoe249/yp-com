/*
 * @Author: 谯坤
 * @Date: 2021-06-22 11:36:19
 * @LastEditTime: 2021-06-22 11:36:19
 * @LastEditors: 谯坤
 * @Description: 修改会员等级
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  /**
   * 描述：修改会员信息
   * @param {*} id 当前会员id
   * @param {*} params 当前修改会员信息
   * @returns
   */
  putMemberLevel(id, params) {
    return axios.put(`${config.memberService}/memberLevels/${id}`, params)
  },
  putRuleFlag(id, params) {
    return axios.put(`${config.memberService}/memberLevels/${id}/ruleFlag`, params)
  },
  putEquitiesFlag(id, params) {
    return axios.put(`${config.memberService}/memberLevels/${id}/equitiesFlag`, params)
  }
}
export default putApi
