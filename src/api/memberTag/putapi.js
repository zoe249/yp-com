/*
 * @Author: your name
 * @Date: 2021-01-05 15:11:17
 * @LastEditTime: 2021-01-07 11:16:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\memberTag\putapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 编辑会员标签
  putMemberTag(params, id) {
    return axios.put(`${config.memberService}/memberTags/` + id, params)
  }
  // 编辑会员标签表格中的状态
  // putMemberTagStatus(id, params) {
  //   return axios.put(`${config.memberService}/memberTags/` + id, params)
  // }
}
export default putApi
