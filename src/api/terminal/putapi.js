/*
 * @Author: your name
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-23 17:18:18
 * @LastEditors: qiaokun
 * @Description: 修改终端接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 编辑终端数据
  putTerminal(params) {
    return axios.put(`${config.organService}/terminals/` + `${params.id}`, params)
  },
  // 修改组织类型的状态   add by qiaokun 2020-12-27
  putTerminalStatus(id, params) {
    return axios.put(`${config.organService}/terminals/` + id, params)
  }
}

export default putApi
