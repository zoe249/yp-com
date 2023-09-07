/*
 * @Author: your name
 * @Date: 2021-01-12 10:50:50
 * @LastEditTime: 2021-01-14 10:50:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\pointValidPeriod\putapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  putPointValidPeriodList(params) {
    return axios.put(`${config.pointService}/pointValidPeriods/` + `${params.id}`, params)
  }
}
export default putApi
