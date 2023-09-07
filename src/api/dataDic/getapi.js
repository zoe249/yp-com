/*
 * @Author: qiaokun
 * @Date: 2021-01-04
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 查询数据字典接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取数据列表信息
  getDataDicList(data) {
    return axios.get(`${config.managementService}/dataDics` + '?code=' + `${data.code}` + '&name=' + `${data.name}` + '&pageIndex=' + `${data.pageIndex}` + '&pageSize=' + `${data.pageSize}`)
  },
  // 通过ddCode查询数据
  getDataDicItemListByddCode(data) {
    return axios.get(`${config.managementService}/dataDics/itemValues` + '?ddCode=' + `${data.ddCode}` + '&status=' + `${data.status}`)
  },
  // 检查名称或者编码存在
  checkNameOrCode(data) {
    return axios.get(`${config.managementService}/dataDics/exist?id=` + `${data.id}` + '&code=' + `${data.code}` + '&name=' + `${data.name}`)
  },
  // 检查字典项值名称或者编码存在
  checkItemNameOrCode(data) {
    return axios.get(`${config.managementService}/dataDics/${data.ddId}/itemValues/exist?id=` + `${data.id}` + '&code=' + `${data.code}` + '&name=' + `${data.name}`)
  }
}
export default getApi
