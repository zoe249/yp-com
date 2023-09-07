/*
 * @Author: your name
 * @Date: 2021-01-05 11:18:38
 * @LastEditTime: 2021-01-08 09:10:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\memberTag\getapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取会员标签列表数据（包含分页与搜索）
  getMemberTagList(data) {
    return axios.get(
      `${config.memberService}/memberTags` +
        '?name=' +
        `${data.name}` +
        '&level=' +
        `${data.level}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&pageIndex=' +
        `${data.pageIndex}` +
        '&memberId=' +
        `${data.memberId}` +
        '&handmade=' +
        `${data.handmade}`
    )
  },
  // 根据 id 获取某一行数据
  getMemberTagById(id) {
    return axios.get(`${config.memberService}/memberTags/` + `${id}`)
  },
  // 名称唯一性校验
  getCheckName(value, id) {
    return axios.get(`${config.memberService}/memberTags/exist` + '?name=' + value + '&id=' + id)
  },
  getMemberThreeTagsByParentId(parentId) {
    return axios.get(`${config.memberService}/memberTags?parentId=` + `${parentId}` + '&pageIndex=1' + '&pageSize=999')
  }
}
export default getApi
