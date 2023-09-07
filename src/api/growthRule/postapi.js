/*
 * @Author: 谯坤
 * @Date: 2021-06-22 15:36:19
 * @LastEditTime: 2021-06-22 15:36:19
 * @LastEditors: 谯坤
 * @Description: 添加成长值规则
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  /**
   * 描述：添加成长值规则
   * @param {*} params 添加成长值规则表单对象
   * @returns
   */
  postGrowthRule(params) {
    return axios.post(`${config.memberService}/growthRules`, params)
  }
}
export default postApi
