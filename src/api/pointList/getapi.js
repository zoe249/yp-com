/*
 * @Author: your name
 * @Date: 2021-01-14 11:14:42
 * @LastEditTime: 2021-01-18 10:05:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\pointList\getapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取积分明细表格
  getPointListList(data) {
    return axios.get(
      `${config.pointService}/pointList` +
        '?info=' +
        `${data.info}` +
        '&pointTypeCode=' +
        `${data.pointTypeCode}` +
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
        `${data.memberId}` +
        '&billNum=' +
        `${data.billNum}` +
        '&cardNumber=' +
        `${data.cardNumber}`
    )
  }
}
export default getApi
