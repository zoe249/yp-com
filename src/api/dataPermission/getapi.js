/*
 * @Author: your name
 * @Date: 2020-12-14 17:56:09
 * @LastEditTime: 2020-12-28 16:40:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\dataPermission\getapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取数据列表信息
  getDataPermissionsList(data) {
    return axios.get(`${config.userService}/organizationMappings` + '?code=' + `${data.code}` + '&organization=' + `${data.organization}` + '&pageIndex=' + `${data.pageIndex}` + '&pageSize=' + `${data.pageSize}`)
  },
  // 根据 id 获取某一条的数据
  getDataPermissionsListById(id) {
    return axios.get(`${config.userService}/organizationMappings/` + `${id}`)
  },
  // 获取组织类型中启用状态的数据
  getOrganizationList() {
    return axios.get(`${config.organService}/organizationTypes` + '?status=' + true + '&isPermission=' + true)
  }
}
export default getApi
