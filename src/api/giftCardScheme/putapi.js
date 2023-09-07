/*
 * @Author: your name
 * @Date: 2021-01-21 09:50:19
 * @LastEditTime: 2021-01-21 17:30:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\giftCardScheme\putapi.js
 */
// 导入 axios
import axios from '../http.js'
// const baseService = '/giftCardScheme/getmembers/'
import { config } from '../config'
const putApi = {
  // 修改礼品卡方案数据
  putGiftCardSchemeList(id, params) {
    return axios.put(`${config.saleService}/giftCardSchemes/` + id, params)
  },
  // 修改礼品卡方案的状态与上下架
  putGiftStatusPublished(id, params) {
    return axios.put(`${config.saleService}/giftCardSchemes/` + id + '/status', params)
  }
}
export default putApi
