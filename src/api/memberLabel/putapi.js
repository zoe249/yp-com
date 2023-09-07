/*
 * @Author: your name
 * @Date: 2020-12-23 10:37:19
 * @LastEditTime: 2020-12-23 10:38:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\memberLabel\putapi.js
 */
import axios from '../http.js'
const baseService = '/memberLabel/getmembers/'
const putApi = {
  putMemberLabelList() {
    return axios.get(`${baseService}`)
  }
}
export default putApi
