/*
 * @Author: your name
 * @Date: 2020-12-26 17:30:18
 * @LastEditTime: 2020-12-26 17:53:50
 * @LastEditors: qiaokun
 * @Description: 修改渠道终端关系接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  putChannelTerminalStatus(id, params) {
    return axios.put(`${config.organService}/channelsTerminalsMappings/` + `${id}`, params)
  }
}

export default putApi
