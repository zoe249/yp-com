/*
 * @Author: liupenghui
 * @Date: 2020-12-14 09:48:05
 * @LastEditTime: 2021-01-15 09:15:32
 * @LastEditors: Please set LastEditors
 * @Description: 查询渠道接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取渠道列表（包含搜索）
  getChannelList(data) {
    return axios.get(`${config.organService}/channels` + '?name=' + `${data.name}` + '&status=' + `${data.status}` + '&userCode=' + data.userCode)
  },
  // 根据渠道编码获取渠道信息
  getChannelByCode(code) {
    return axios.get(`${config.organService}/channels` + '?name=' + `${code}` + '&status=' + '' + '&userCode=' + '')
  },
  // 名称唯一性校验
  getCheckName(value, id) {
    return axios.get(`${config.organService}/channels/exist` + '?name=' + `${value}` + '&id=' + id)
  },
  // 数据权限获取渠道列表
  getDataChannelsList() {
    return axios.get(`${config.organService}/channels` + '?status=' + true)
  },
  // 积分有效期获取渠道列表
  getDataChannelsListIsPonit() {
    return axios.get(`${config.organService}/channels` + '?status=' + true + '&isPoint=' + true)
  },
  // 根据 id 获取数据
  getChannelById(id) {
    return axios.get(`${config.organService}/channels/` + `${id}`)
  }
}
export default getApi
