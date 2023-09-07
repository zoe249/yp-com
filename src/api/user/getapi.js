/*
 * @Author: your name
 * @Date: 2020-12-02 11:36:19
 * @LastEditTime: 2021-01-05 10:03:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \crm-mvp-system-web\src\api\user\getapi.js
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 从后端获取表格数据
  getUserList(data) {
    return axios.get(
      `${config.userService}/users` +
        '?realName=' +
        `${data.realName}` +
        '&status=' +
        `${data.status}` +
        '&organization=' +
        `${data.organization}` +
        '&role=' +
        `${data.role}` +
        '&pageIndex=' +
        `${data.pageIndex}` +
        '&pageSize=' +
        `${data.pageSize}`
    )
  },
  // 根据 id 获取某一条数据
  getUserListById(id) {
    return axios.get(`${config.userService}/users/` + `${id}`)
  },
  // 获取角色列表
  getRoleList() {
    return axios.get(`${config.userService}/roles` + '?pageSize=9999999')
  },
  // 获取用户code，在数据权限中使用
  getUserCodeDataPerList() {
    return axios.get(`${config.userService}/users`)
  },
  // 获取当前登录用户
  getCurrentUser() {
    return axios.get(`${config.userService}/users/current`)
  },
  // 校验账号的唯一性
  getCheckName(value, id) {
    return axios.get(`${config.userService}/users/exist` + '?code=' + value + '&id=' + id)
  }
}
export default getApi
