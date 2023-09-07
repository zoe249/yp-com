/*
 * @Author: your name
 * @Date: 2021-01-05 15:11:10
 * @LastEditTime: 2021-01-07 19:13:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\memberTag\postapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  postMemberTag(params) {
    return axios.post(`${config.memberService}/memberTags`, params)
  },
  postViewMemberTag(params) {
    return axios.post(`${config.memberService}/memberTagMappings`, params)
  },
  // 批量添加会员与会员标签关系
  postMemberTagMappings(data) {
    return axios.post(`${config.memberService}/memberTagMappings`, data)
  }
}
export default postApi
