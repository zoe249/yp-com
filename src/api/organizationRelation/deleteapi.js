/*
 * @Author: your name
 * @Date: 2020-12-23 11:05:36
 * @LastEditTime: 2020-12-29 02:50:40
 * @LastEditors: qiaokun
 * @Description: 删除组织关系接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const deleteApi = {
  deleOrganizationRelation(id) {
    return axios.delete(`${config.organService}/organizationRelations/` + `${id}`)
  }
}
export default deleteApi
