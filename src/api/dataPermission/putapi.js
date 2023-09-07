/*
 * @Author: your name
 * @Date: 2020-12-18 15:44:23
 * @LastEditTime: 2020-12-28 17:23:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\channel\putapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  putDataPermission(params) {
    return axios.put(`${config.userService}/organizationMappings/` + `${params.id}`, params)
  }
}

export default putApi
