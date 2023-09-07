/*
 * @Author: your name
 * @Date: 2020-12-26 10:13:43
 * @LastEditTime: 2020-12-28 17:22:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\dataPermission\deleteapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const deleteApi = {
  deleteDataPermission(id) {
    return axios.delete(`${config.userService}/organizationMappings/` + `${id}`)
  }
}
export default deleteApi
