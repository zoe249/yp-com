/*
 * @Author: your name
 * @Date: 2020-12-23 10:37:27
 * @LastEditTime: 2020-12-23 10:38:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\memberLabel\postapi.js
 */
// 导入 axios
import axios from '../http.js'
const baseService = '/memberLabel/getmembers/'
const postApi = {
  postMemberLabelList() {
    return axios.get(`${baseService}`)
  }
}
export default postApi
