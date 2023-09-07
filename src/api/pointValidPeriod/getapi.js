/*
 * @Author: your name
 * @Date: 2021-01-12 10:23:10
 * @LastEditTime: 2021-01-14 10:58:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\pointValidPeriod\getapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取积分有效期表格数据
  getPointValidPeriodList(data) {
    return axios.get(
      `${config.pointService}/pointValidPeriods` +
        '?organizationCode=' +
        `${data.organizationCode}` +
        '&pointTypeCode=' +
        `${data.pointTypeCode}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&pageIndex=' +
        `${data.pageIndex}`
    )
  },
  getPointValidPeriodListById(id) {
    return axios.get(`${config.pointService}/pointValidPeriods/` + `${id}`)
  }
}
export default getApi
