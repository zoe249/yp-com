/*
 * @Author: liupenghui
 * @Date: 2020-12-02 11:36:19
 * @LastEditTime: 2021-01-15 11:56:11
 * @LastEditors: Please set LastEditors
 * @Description: 查询组织类型接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取组织类型列表信息   update by qiaokun  2020-12-27 17:30
  getOrganizationTypeList(data) {
    return axios.get(
      `${config.organService}/organizationTypes` +
        '?name=' +
        `${data.name}` +
        '&status=' +
        `${data.status}` +
        '&pageIndex=' +
        `${data.pageIndex}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&includeTop=' +
        `${data.includeTop}` +
        '&isPermission=' +
        `${data.isPermission}` +
        '&judgeRelation=' +
        `${data.judgeRelation}`
    )
  },
  // 根据 id 查询某一条组织类型  update by qiaokun  2020-12-27 17:30
  getOrganizationTypeById(id) {
    return axios.get(`${config.organService}/organizationTypes/` + `${id}`)
  },
  // 获取组织类型里面 id ，用于用户页面的选择组织对话框里面（用于礼品卡）
  getOrganizationTypeId() {
    return axios.get(`${config.organService}/organizationTypes` + '?status=' + true)
  },
  // 数据权限获取组织类型中的数据
  getPerOrgList() {
    return axios.get(`${config.organService}/organizationTypes`)
  },
  // 名称唯一性校验
  getCheckName(value, id) {
    return axios.get(`${config.organService}/organizationTypes/exist` + '?name=' + value + '&id=' + id)
  },
  // 判断是否含有顶级组织（用于组织类型中禁止使用顶级组织按钮）
  getOrganizationTypeListDialog() {
    return axios.get(`${config.organService}/organizationTypes` + '?pageSize=999')
  }
}
export default getApi
