/*
 * @Author: 谯坤
 * @Date: 2021-06-22 11:36:19
 * @LastEditTime: 2021-06-22 11:36:19
 * @LastEditors: 谯坤
 * @Description: 添加会员等级
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  /**
   * 描述：添加会员等级
   * @param {*} params 添加会员等级的表单对象
   * @returns
   */
  postMemberLevel(params) {
    return axios.post(`${config.memberService}/memberLevels`, params)
  }
}
export default postApi
