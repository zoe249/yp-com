/*
 * @Author: your name
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-29 04:57:01
 * @LastEditors: qiaokun
 * @Description: 新增组织管理接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  postOrganizationManagement(params) {
    return axios.post(`${config.organService}/organizations`, params)
  }
}

export default postApi
