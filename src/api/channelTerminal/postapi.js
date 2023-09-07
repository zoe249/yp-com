/*
 * @Author: your name
 * @Date: 2020-12-26 10:37:43
 * @LastEditTime: 2020-12-26 17:24:07
 * @LastEditors: qiaokun
 * @Description: 新增渠道终端关系接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  postChannelTerminal(params) {
    return axios.post(`${config.organService}/channelsTerminalsMappings`, params)
  }
}
export default postApi
