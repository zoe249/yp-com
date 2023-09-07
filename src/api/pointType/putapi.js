/*
 * @Author: your name
 * @Date: 2021-01-11 20:32:02
 * @LastEditTime: 2021-01-14 09:56:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\pointType\putapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 修改积分类型数据
  putPointTypeList(params) {
    return axios.put(`${config.pointService}/pointTypes/` + `${params.id}`, params)
  },
  // 修改积分类型的状态
  putPointTypeStatus(id, params) {
    return axios.put(`${config.pointService}/pointTypes/` + id, params)
  }
}
export default putApi
