/*
 * @Author: qiaokun
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-27 11:03:20
 * @LastEditors: qiaokun
 * @Description: 删除角色接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const deleteApi = {
  // 删除角色
  deleteRole(id) {
    return axios.delete(`${config.userService}` + '/roles/' + id)
  }
}
export default deleteApi
