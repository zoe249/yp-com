/*
 * @Author: your name
 * @Date: 2020-12-18 15:44:23
 * @LastEditTime: 2020-12-29 04:56:41
 * @LastEditors: qiaokun
 * @Description: 修改组织管理接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 修改组织管理
  putOrganizationManagement(params) {
    return axios.put(`${config.organService}/organizations/` + `${params.id}`, params)
  },
  // 修改组织管理的状态   add by qiaokun 2020-12-27
  putOrganizationManagementStatus(id, params) {
    return axios.put(`${config.organService}/organizations/` + id, params)
  }
}

export default putApi
