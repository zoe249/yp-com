/*
 * @Author: your name
 * @Date: 2020-12-23 10:47:53
 * @LastEditTime: 2020-12-23 10:49:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\memberLabel\deleteapi.js
 */
import axios from '../http.js'
const baseService = '/memberLabel/getmembers/'
const deleteApi = {
  deleteMemberLabelListById(id) {
    return axios.delete(`${baseService}` + `${id}`)
  }
}
export default deleteApi
