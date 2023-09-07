/*
 * @Author: liupenghui
 * @Date: 2021-01-06 16:55:45
 * @LastEditTime: 2021-01-16 18:03:58
 * @LastEditors: Please set LastEditors
 * @Description: 查询菜单接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取平台信息
  getPlatformsList() {
    return axios.get(`${config.managementService}` + '/platforms')
  }
}
export default getApi
