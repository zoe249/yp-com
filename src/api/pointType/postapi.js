/*
 * @Author: your name
 * @Date: 2021-01-11 20:31:55
 * @LastEditTime: 2021-01-14 09:30:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\pointType\postapi.js
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  postPointTypeList(params) {
    return axios.post(`${config.pointService}/pointTypes`, params)
  }
}
export default postApi
