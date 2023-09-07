/*
 * @Author: qiaokun
 * @Date: 2020-12-23 22:03:07
 * @LastEditTime: 2020-12-24 16:40:43
 * @LastEditors: qiaokun
 * @Description: 查询菜单接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取所有的菜单列表
  getPermissionList() {
    return axios.get(`${config.userService}` + '/permissions?applicationId=0')
  },
  // 用户登录时获取的菜单
  getPermissionMenuList() {
    return axios.get(`${config.userService}` + '/permissions?applicationId=1341945931515432960')
  },
  // 根据id查询某一条菜单数据
  getPermissionById(id) {
    return axios.get(`${config.userService}` + '/permissions/' + id)
  },
  // 菜单名称唯一性检查（暂不需要）
  getCheckName(value) {
    return axios.get(`${config.userService}` + '/permissions/exist?name=' + value)
  }
}
export default getApi
