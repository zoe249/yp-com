/*
 * @Author: qiaokun
 * @Date: 2020-01-05
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 添加会员接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 获取数据列表信息
  postMember(data) {
    return axios.post(`${config.memberService}/members`, data)
  }
}
export default postApi
