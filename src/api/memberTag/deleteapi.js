/*
 * @Author: your name
 * @Date: 2021-01-05 15:11:27
 * @LastEditTime: 2021-01-08 10:52:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\memberTag\deleteapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const deleteApi = {
  deleteMemberTag(id) {
    return axios.delete(`${config.memberService}/memberTags/` + `${id}`)
  },
  // 批量删除会员底下的标签id集合
  deleteMemberTagByIds(id, data) {
    return axios.delete(`${config.memberService}/memberTagMappings/` + `${id}`, { data: data })
  }
}
export default deleteApi
