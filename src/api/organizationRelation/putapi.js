/*
 * @Author: your name
 * @Date: 2020-12-18 15:44:23
 * @LastEditTime: 2020-12-29 02:52:01
 * @LastEditors: qiaokun
 * @Description:  编辑组织关系接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  putOrganizationRelation(params) {
    return axios.put(`${config.organService}/organizationRelations/` + `${params.id}`, params)
  }
}

export default putApi
