/*
 * @Author: liupenghui
 * @Date: 2020-12-14 11:20:30
 * @LastEditTime: 2020-12-26 17:56:48
 * @LastEditors: qiaokun
 * @Description: 查询渠道终端关系接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取渠道数据
  getChannelsList() {
    return axios.get(`${config.organService}/channels` + '?status=' + true)
  },
  // 获取终端数据
  getTerminalList() {
    return axios.get(`${config.organService}/terminals` + '?status=' + true)
  },
  // 获取渠道与终端数据
  getChannelTerminalList(data) {
    return axios.get(`${config.organService}/channelsTerminalsMappings` + '?channelsId=' + `${data.channelsId}` + '&terminalsId=' + `${data.terminalsId}`)
  }
}
export default getApi
