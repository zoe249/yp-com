/*
 * @Author: your name
 * @Date: 2020-12-14 10:14:40
 * @LastEditTime: 2020-12-28 20:39:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\user\postapi.js
 */
import axios from '../http.js'
import { config } from '../config'
// const baseService = '/user/login'
const putApi = {
  // 编辑用户信息
  putUserList(params) {
    return axios.put(`${config.userService}/users/` + `${params.id}`, params)
  },
  // 重置密码
  putUserPwd(id) {
    return axios.put(`${config.userService}/users/` + `${id}` + '/resetPassword')
  },
  // 修改组织类型的状态   add by qiaokun 2020-12-27
  putUserStatus(id, params) {
    return axios.put(`${config.userService}/users/` + id, params)
  },
  // 修改用户密码
  putUserPassword(params) {
    return axios.put(`${config.userService}/users/changePassword`, params)
  }
}
export default putApi
