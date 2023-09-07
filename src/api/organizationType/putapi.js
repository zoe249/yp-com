/*
 * @Author: liupenghui
 * @Date: 2020-12-18 15:44:23
 * @LastEditTime: 2020-12-25 10:04:43
 * @LastEditors: qiaokun
 * @Description: 编辑组织类型接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 编辑组织类型
  putOrganizationType(params) {
    return axios.put(`${config.organService}/organizationTypes/` + `${params.id}`, params)
  },
  // // 进行对开关进行编辑
  // putOrganizationTypeSwitch(data) {
  //   return axios.put(`${config.organService}/organizationTypes/` + `${data.status}`, data)
  // }
  // 修改组织类型的状态   add by qiaokun 2020-12-27
  putOrganizationTypeStatus(id, params) {
    return axios.put(`${config.organService}/organizationTypes/` + id, params)
  }
}

export default putApi
