/*
 * @Author: your name
 * @Date: 2020-12-02 11:36:19
 * @LastEditTime: 2020-12-23 10:27:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \crm-mvp-system-web\src\api\memberingRules\getapi.js
 */
// 导入 axios
import axios from '../http.js'
const baseService = '/memberLabel/getmembers/'
const getApi = {
  getMemberLabelList() {
    return axios.get(`${baseService}`)
  },
  getMemberLabelListById(id) {
    return axios.get(`${baseService}` + `${id}`)
  }
}
export default getApi
