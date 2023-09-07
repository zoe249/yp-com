/*
 * @Author: your name
 * @Date: 2020-12-23 21:29:41
 * @LastEditTime: 2020-12-23 21:48:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\organizationManagement\deleteapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const deleteApi = {
  deleteOrganizationManagementsListById(id) {
    return axios.delete(`${config.organService}/organizations/` + `${id}`)
  }
}
export default deleteApi
