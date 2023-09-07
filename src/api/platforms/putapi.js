/*
 * @Author: your name
 * @Date: 2021-01-06 17:03:40
 * @LastEditTime: 2021-01-06 18:15:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\platforms\putapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  putPermissionList(params, id) {
    return axios.put(`${config.managementService}` + '/platforms/' + id, params)
  }
}
export default putApi
