/*
 * @Author: qiaokun
 * @Date: 2020-12-14 11:47:39
 * @LastEditTime: 2021-01-09 10:26:11
 * @LastEditors: Please set LastEditors
 * @Description: 查询组织管理接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取省市区地址
  getAddress(id) {
    return axios.get(`${config.managementService}` + '/areas/' + id + '/children')
  }
}
export default getApi
