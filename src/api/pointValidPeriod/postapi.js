/*
 * @Author: your name
 * @Date: 2021-01-12 10:50:40
 * @LastEditTime: 2021-01-14 10:45:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\pointValidPeriod\postapi.js
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  postPointValidPeriodList(params) {
    return axios.post(`${config.pointService}/pointValidPeriods`, params)
  }
}
export default postApi
