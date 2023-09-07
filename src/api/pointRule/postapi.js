/*
 * @Author: qiaokun
 * @Date: 2021-06-02 09:55:00
 * @LastEditTime: null
 * @LastEditors: null
 * @Description: null
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 查询积分规则列表数据
  postPointRule(data) {
    return axios.post(`${config.pointService}/pointRules`, data)
  }
}
export default postApi
