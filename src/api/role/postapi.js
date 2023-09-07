/*
 * @Author: qiaokun
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-21 11:03:20
 * @LastEditors: Please set LastEditors
 * @Description: 添加角色接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 添加角色
  postRole(params) {
    return axios.post(`${config.userService}` + '/roles', params)
  }
}
export default postApi
