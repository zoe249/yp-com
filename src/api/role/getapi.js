/*
 * @Author: qiaokun
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-21 11:03:20
 * @LastEditors: Please set LastEditors
 * @Description: 查询角色接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取角色列表
  getRoleList(data) {
    return axios.get(`${config.userService}` + '/roles' + '?pageIndex=' + data.pageIndex + '&pageSize=' + data.pageSize)
  },
  // 通过id获取某一条角色信息
  getRoleById(id) {
    return axios.get(`${config.userService}` + '/roles/' + id)
  },
  // 角色名称唯一性检查
  getCheckName(value, id) {
    return axios.get(`${config.userService}` + '/roles/exist?name=' + value + '&id=' + id)
  }
}
export default getApi
