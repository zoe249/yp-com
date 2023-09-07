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
  // 提交积分调整
  postPointEdit(id, params) {
    return axios.post(`${config.pointService}/pointEdit/` + id + ':Edit', params)
  }
}
export default postApi
