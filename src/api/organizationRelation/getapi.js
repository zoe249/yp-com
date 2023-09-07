/*
 * @Author: liupenghui
 * @Date: 2020-12-02 11:36:19
 * @LastEditTime: 2020-12-29 02:16:43
 * @LastEditors: qiaokun
 * @Description: 查询组织关系接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取表单数据（含有搜索与分页）
  getOrganizationRelationList(data) {
    return axios.get(
      `${config.organService}/organizationRelations` +
        '?organizationTypeId=' +
        `${data.organizationTypeId}` +
        '&parentOrganizationTypeId=' +
        `${data.parentOrganizationTypeId}` +
        '&pageIndex=' +
        `${data.pageIndex}` +
        '&pageSize=' +
        `${data.pageSize}`
    )
  },
  // 根据 id 获取某一条的数据
  getOrganizationRelationById(id) {
    return axios.get(`${config.organService}/organizationRelations/` + `${id}`)
  },
  // 校验
  getCheckName(organizationTypeId) {
    return axios.get(`${config.organService}/organizationRelations` + '?organizationTypeId=' + `${organizationTypeId}`)
  }
}
export default getApi
