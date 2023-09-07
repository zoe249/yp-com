/*
 * @Author: your name
 * @Date: 2021-01-14 16:35:48
 * @LastEditTime: 2021-01-22 08:58:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\giftCardScheme\getapi.js
 */
// 导入 axios
import axios from '../http.js'
// const baseService = '/giftCardScheme/getmembers/'
import { config } from '../config'
const getApi = {
  // 获取礼品卡方案主表格表格数据
  getGiftCardSchemeList(data) {
    return axios.get(
      `${config.saleService}/giftCardSchemes` +
        '?info=' +
        `${data.info}` +
        '&status=' +
        `${data.status}` +
        '&published=' +
        `${data.published}` +
        '&cardType=' +
        `${data.cardType}` +
        '&pageIndex=' +
        `${data.pageIndex}` +
        '&pageSize=' +
        `${data.pageSize}`
    )
  },
  // 根据 Id 获取某一条数据
  getGiftCardSchemeListById(id) {
    return axios.get(`${config.saleService}/giftCardSchemes/` + `${id}`)
  },
  // 商品编码的唯一性
  getCheckProductCode(value, id) {
    return axios.get(`${config.saleService}/giftCardSchemes/getProductCodeExist` + '?productCode=' + value + '&id=' + id)
  },
  // 商品名称的唯一性
  getCheckProductName(value, id) {
    return axios.get(`${config.saleService}/giftCardSchemes/getProductNameExist` + '?productName=' + value + '&id=' + id)
  },
  // 获取已经生效的所选组织表格数据
  getCheckedOrganizationTable(id) {
    return axios.get(`${config.saleService}/giftCardSchemes/` + id + '/getOrganizationScopes')
  },
  // 获取已经生效的所选渠道表格数据
  getCheckedTerminalTable(id) {
    return axios.get(`${config.saleService}/giftCardSchemes/` + id + '/getChannelsScopes')
  }
}
export default getApi
