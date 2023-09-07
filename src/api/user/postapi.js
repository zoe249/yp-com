/*
 * @Author: your name
 * @Date: 2020-12-14 10:14:40
 * @LastEditTime: 2020-12-28 13:04:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\user\postapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const baseService = '/user/login'
const postApi = {
  login() {
    return axios.post(`${baseService}`)
  },
  // 增加用户信息
  postUserList(params) {
    return axios.post(`${config.userService}/users`, params)
  }
}
export default postApi
