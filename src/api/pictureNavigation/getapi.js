/*
 * @Author: qiaokun
 * @Date: 2021-01-21
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 查询图片导航接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取图片导航列表信息
  getPictureNavigationList(data) {
    return axios.get(`${config.managementService}/pictureNavigations` + '?name=' + `${data.name}` + '&status=' + `${data.status}` + '&site=' + `${data.site}`)
  },
  // 根据id获取图片导航信息
  getPictureNavigationById(id) {
    return axios.get(`${config.managementService}/pictureNavigations/` + id)
  },
  // 角色名称唯一性检查
  getCheckName(value, id) {
    return axios.get(`${config.managementService}` + '/pictureNavigations/exist?name=' + value + '&id=' + id)
  }
}
export default getApi
