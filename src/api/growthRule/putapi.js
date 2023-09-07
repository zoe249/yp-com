/*
 * @Author: 谯坤
 * @Date: 2021-06-22 15:50:19
 * @LastEditTime: 2021-06-22 15:50:19
 * @LastEditors: 谯坤
 * @Description: 修改成长值
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  putGrowthRule(id, params) {
    return axios.put(`${config.memberService}/growthRules/${id}`, params)
  },
  putGrowthStatus(id, params) {
    return axios.put(`${config.memberService}/growthRules/${id}/status`, params)
  }
}
export default putApi
