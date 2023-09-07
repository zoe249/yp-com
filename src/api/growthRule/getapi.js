/*
 * @Author: 谯坤
 * @Date: 2021-06-22 14:00:19
 * @LastEditTime: 2021-06-22 14:00:19
 * @LastEditors: 谯坤
 * @Description: 查询成长值规则接口
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  /**
   * 描述：获取成长值规则列表
   * @param {*} params
   * @returns
   */
  getGrowthRuleList(params) {
    return axios.get(
      `${config.memberService}/growthRules?growthRule=${params.growthRule}&organizationCode=${params.organizationCode}&channelsCode=${params.channelsCode}&pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`
    )
  },
  /**
   * 描述：根据 id 查询会员成长值规则
   * @param {*} id  会员成长值规则id
   * @returns
   */
  getPointRuleById(id) {
    return axios.get(`${config.memberService}/growthRules/${id}`)
  }
}
export default getApi
