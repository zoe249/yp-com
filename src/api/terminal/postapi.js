/*
 * @Author: your name
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-21 11:17:32
 * @LastEditors: qiaokun
 * @Description: 添加终端接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  postTerminal(params) {
    return axios.post(`${config.organService}/terminals`, params)
  }
}

export default postApi
