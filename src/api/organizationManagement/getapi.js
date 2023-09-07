/*
 * @Author: your name
 * @Date: 2020-12-14 11:47:39
 * @LastEditTime: 2021-01-27 10:02:21
 * @LastEditors: Please set LastEditors
 * @Description: 查询组织管理接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取省市区地址
  getAdress(id) {
    return axios.get(`${config.managementService}` + '/areas/' + id + '/children')
  },
  // 查询组织类型
  getorganizationManagementsListBy(params) {
    return axios.get(`${config.organService}/organizations/` + `${params.id}`, params)
  },
  // 查询组织管理组织类型为顶级的信息
  getOrganizationsTop() {
    return axios.get(`${config.organService}/organizations/top`)
  },
  // 获取组织管理列表(用于用户选择组织对话框里面)
  getorganizationManagementsList(data) {
    return axios.get(`${config.organService}/organizations` + '?code=' + `${data.code}` + '&organizationTypeId=' + `${data.organizationTypeId}`)
  },
  // 获取组织管理数据，根据organizationId（用于用户）
  getorganizationManagementsListByCode(value) {
    return axios.get(`${config.organService}/organizations` + '?code=' + value)
  },
  // 获取组织管理列表
  getOrganizationManagementsList(data) {
    return axios.get(
      `${config.organService}/organizations` +
        '?code=' +
        `${data.code}` +
        '&organizationTypeId=' +
        `${data.organizationTypeId}` +
        '&formats=' +
        `${data.formats}` +
        '&parent=' +
        data.parent +
        '&excludeUser=' +
        data.excludeUser +
        '&userCode=' +
        data.userCode +
        '&publish=' +
        data.publish
    )
  },
  getOrganizationManagementsByCode(code) {
    return axios.get(
      `${config.organService}/organizations` + '?code=' + `${code}` + '&organizationTypeId=' + '' + '&formats=' + '' + '&parent=' + '' + '&excludeUser=' + '' + '&userCode=' + '' + '&publish=' + ''
    )
  },
  // 获取组织管理列表
  getOrganizationManagementsListStatus() {
    return axios.get(`${config.organService}/organizations` + '?publish=' + true)
  },
  // 获取组织管理列表（用于积分有效期）
  getOrganizationManagementIsPoint() {
    return axios.get(`${config.organService}/organizations` + '?publish=' + true + '&isPoint=' + true + '&isTree=' + false)
  },
  // 获取组织管理列表（用于礼品卡管理）
  getOrganizationManagementInGift() {
    return axios.get(`${config.organService}/organizations` + '?publish=' + true + '&isTree=' + false)
  },
  // 根据 id 来进行获取信息
  getOrganizationManagementById(id) {
    return axios.get(`${config.organService}/organizations/` + `${id}`)
  },
  // 获取组织类型中启用状态的数据
  getOrganizationList() {
    return axios.get(`${config.organService}/organizationTypes` + '?status=' + true)
  },
  // 获取父级组织类型
  getOrgTypeListByParentId(id) {
    return axios.get(`${config.organService}/organizationRelations` + '?parentOrganizationTypeId=' + id)
  },
  // 获取组织关系中的数据1342028815546847232
  getRelatiosList(value) {
    return axios.get(`${config.organService}/organizationRelations` + '?organizationTypeId=' + value)
  },
  // 在用户中获取本数据
  // getorganizationUserList() {
  //   return axios.get(`${config.organService}/organizations`)
  // },
  // 获取用户过滤组织管理列表数据
  getOrgManagementFilter(organizationTypeId, userCode) {
    return axios.get(`${config.organService}/organizations` + '?organizationTypeId=' + organizationTypeId + '&excludeUser=' + true + '&userCode=' + userCode + '&publish=' + true)
  },
  // 名称与编号唯一性校验
  getCheckName(data) {
    return axios.get(`${config.organService}/organizations/exist` + '?name=' + data.name + '&code=' + data.code + '&id=' + data.id)
  }
}
export default getApi
