/*
 * @Author: 谯坤
 * @Date: 2021-06-22 15:54:42
 * @LastEditTime: 2021-06-22 15:54:34
 * @LastEditors: null
 * @Description: 成长值明细
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取积分明细表格
  getGrowthListList(data) {
    return axios.get(
      `${config.memberService}/growthLists` +
        '?info=' +
        `${data.info}` +
        '&pageIndex=' +
        `${data.pageIndex}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&organizationCode=' +
        `${data.organizationCode}` +
        '&channelsCode=' +
        `${data.channelsCode}` +
        '&beginTime=' +
        `${data.beginTime}` +
        '&endTime=' +
        `${data.endTime}` +
        '&memberId=' +
        `${data.memberId}`
    )
  }
}
export default getApi
