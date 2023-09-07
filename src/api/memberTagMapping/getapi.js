/*
 * @Author: qiaokun
 * @Date: 2020-01-04
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 查询实体属性
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 查询会员属性列表
  getMemberAttibutesList() {
    return axios.get(`${config.managementService}/entitys/t_member?includeBaseField=false`)
  }
}
export default getApi
