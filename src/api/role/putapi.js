/*
 * @Author: qiaokun
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-21 11:03:20
 * @LastEditors: qiaokun
 * @Description: 修改角色接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 修改角色
  putRole(id, params) {
    return axios.put(`${config.userService}` + '/roles/' + id, params)
  }
}
export default putApi
