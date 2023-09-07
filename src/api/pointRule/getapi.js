/*
 * @Author: qiaokun
 * @Date: 2021-06-02 09:29:00
 * @LastEditTime: null
 * @LastEditors: null
 * @Description: null
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 查询积分规则列表数据
  getPointRuleList(data) {
    return axios.get(
      `${config.pointService}/pointRules` +
        '?pointTypeCode=' +
        `${data.pointTypeCode}` +
        '&organizationCode=' +
        `${data.organizationCode}` +
        '&pageIndex=' +
        `${data.pageIndex}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&channelsCode=' +
        `${data.channelsCode}`
    )
  },
  // 根据 id 查询积分规则数据
  getPointRuleById(id) {
    return axios.get(`${config.pointService}/pointRules/${id}`)
  }
}
export default getApi
