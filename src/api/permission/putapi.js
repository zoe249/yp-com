/*
 * @Author: qiaokun
 * @Date: 2020-12-23 22:03:07
 * @LastEditTime: 2020-12-24 16:40:43
 * @LastEditors: Please set LastEditors
 * @Description: 修改菜单接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 修改菜单
  putPermission(id, params) {
    return axios.put(`${config.userService}` + '/permissions/' + id, params)
  }
}
export default putApi
