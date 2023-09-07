/*
 * @Author: qiaokun
 * @Date: 2020-12-23 22:03:07
 * @LastEditTime: 2020-12-24 16:40:43
 * @LastEditors: qiaokun
 * @Description: 添加菜单接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 新增菜单
  postPermission(params) {
    return axios.post(`${config.userService}` + '/permissions', params)
  }
}
export default postApi
