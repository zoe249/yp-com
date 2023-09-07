/*
 * @Author: your name
 * @Date: 2021-01-16 13:38:58
 * @LastEditTime: 2021-01-21 09:44:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\giftCardScheme\postapi.js
 */
// 导入 axios
import axios from '../http.js'
// const baseService = '/giftCardScheme/getmembers/'
import { config } from '../config'
const postApi = {
  postGiftCardSchemeList(params) {
    return axios.post(`${config.saleService}/giftCardSchemes`, params)
  }
}
export default postApi
