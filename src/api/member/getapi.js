/*
 * @Author: qiaokun
 * @Date: 2020-01-05
 * @LastEditTime: 2021-01-14 18:28:05
 * @LastEditors: Please set LastEditors
 * @Description: 查询会员接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取数据列表信息
  getMemberList(data) {
    return axios.get(
      `${config.memberService}/members` +
        '?cardInfo=' +
        `${data.cardInfo}` +
        '&cardLevelCode=' +
        `${data.cardLevelCode}` +
        '&oldCardNumberCondition=' +
        `${data.oldCardNumberCondition}` +
        '&oldCardNumber=' +
        `${data.oldCardNumber}` +
        '&pageIndex=' +
        `${data.pageIndex}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&phone=' +
        `${data.phone}` +
        '&beginTime=' +
        `${data.beginTime}` +
        '&endTime=' +
        `${data.endTime}` +
        '&memberTagIds=' +
        `${data.memberTagId}` +
        '&status=' +
        `${data.status}` +
        '&filterMemberTagId=' +
        `${data.filterMemberTagId}` +
        '&info=' +
        `${data.info}` +
        '&pointFrom=' +
        `${data.pointFrom}` +
        '&pointTo=' +
        `${data.pointTo}` +
        '&storedValueFrom=' +
        `${data.storedValueFrom}` +
        '&storedValueTo=' +
        `${data.storedValueTo}`
    )
  },
  // 用于会员标签中查看详情中的新增
  getMemberListInMemberTag(data) {
    return axios.get(
      `${config.memberService}/members` + '?info=' + `${data.info}` + '&pageIndex=' + `${data.pageIndex}` + '&pageSize=' + `${data.pageSize}` + '&filterMemberTagId=' + `${data.filterMemberTagId}`
    )
  },
  // 通过id查询会员信息
  getMemberById(id) {
    return axios.get(`${config.memberService}/members/` + id)
  },
  // 通过id查询会员地址
  getMemberAddressById(id) {
    return axios.get(`${config.memberService}/members/` + id + '/memberAddress')
  },
  // 根据 id 查询账户信息/members/{id}/memberAccount
  getMemberAccountById(id) {
    return axios.get(`${config.memberService}/members/` + id + '/memberAccount')
  },
  // 查询会员属性列表数据
  getMemberAttibutesList() {
    return axios.get(`${config.memberService}/memberAttibutes`)
  },
  // 会员打标签已选条件动态拼接参数
  getSelectMemberList(data, params, memberTagId) {
    return axios.get(`${config.memberService}/members?pageIndex=` + `${data.pageIndex}` + '&pageSize=' + `${data.pageSize}` + params + '&memberTagId=' + memberTagId)
  }
}
export default getApi
