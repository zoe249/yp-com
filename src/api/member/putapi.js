/*
 * @Author: qiaokun
 * @Date: 2020-01-05
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 修改会员接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 获取数据列表信息
  putMember(id, data) {
    return axios.put(`${config.memberService}/members/` + id, data)
  },
  putMemberStatus(id, data) {
    return axios.put(`${config.memberService}/members/${id}/status`, data)
  }
}
export default putApi
