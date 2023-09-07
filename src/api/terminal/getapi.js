/*
 * @Author: your name
 * @Date: 2020-12-14 10:57:32
 * @LastEditTime: 2021-01-15 09:17:17
 * @LastEditors: Please set LastEditors
 * @Description: 查询终端接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取终端数据列表
  getTerminalList(data) {
    return axios.get(`${config.organService}/terminals` + '?name=' + `${data.name}` + '&status=' + `${data.status}`)
  },
  // 根据code 获取终端数据
  getTerminalByCode(code) {
    return axios.get(`${config.organService}/terminals` + '?name=' + `${code}` + '&status=' + '')
  },

  // 获取终端为true 的，用于平台
  getTerminalListinPlat(id) {
    return axios.get(`${config.organService}/terminals` + '?status=' + true + '&channelId=' + id)
  },
  // 获取终端为true 的，用于平台
  getTerminalListinPlatByCode(code) {
    return axios.get(`${config.organService}/terminals` + '?status=' + true + '&channelCode=' + code)
  },
  // 获取终端为true 的，用于积分有效期
  getTerminalListinPlatIsPoint(id) {
    return axios.get(`${config.organService}/terminals` + '?status=' + true + '&channelId=' + id + '&isPoint=' + true)
  },

  // 根据 id 获取数据
  getTerminalById(id) {
    return axios.get(`${config.organService}/terminals/` + `${id}`)
  },
  // 名称唯一性校验
  getCheckName(value, id) {
    return axios.get(`${config.organService}/terminals/exist` + '?name=' + `${value}` + '&id=' + id)
  }
}
export default getApi
