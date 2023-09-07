/*
 * @Author: your name
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-28 17:23:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\dataPermission\postapi.js
 */
import axios from '../http.js'
import { config } from '../config'
// 新增
const postApi = {
  postDataPermission(params) {
    return axios.post(`${config.userService}/organizationMappings`, params)
  }
}

export default postApi
