/*
 * @Author: your name
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-29 01:51:29
 * @LastEditors: qiaokun
 * @Description: 新增组织关系接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  postOrganizationRelation(params) {
    return axios.post(`${config.organService}/organizationRelations`, params)
  }
}

export default postApi
