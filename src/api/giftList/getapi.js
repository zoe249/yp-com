/*
 * @Author: your name
 * @Date: 2021-01-15 15:43:02
 * @LastEditTime: 2021-01-26 19:52:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\giftList\getapi.js
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  getGiftListList(data) {
    return axios.get(
      `${config.saleService}/giftCards` +
        '?cardNumber=' +
        `${data.cardNumber}` +
        '&schemeId=' +
        `${data.schemeId}` +
        '&status=' +
        data.status +
        '&cardType=' +
        `${data.cardType}` +
        '&pageIndex=' +
        `${data.pageIndex}` +
        '&pageSize=' +
        data.pageSize
    )
  }
}
export default getApi
