/*
 * @Author: your name
 * @Date: 2021-01-20 10:11:41
 * @LastEditTime: 2021-01-20 19:47:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\slideShow\putapi.js
 */
// 导入 axios
import axios from '../http.js'
// const baseService = '/slideShow/getmembers/'
import { config } from '../config'
const putApi = {
  putSlideShowList(id, params) {
    return axios.put(`${config.managementService}/slideshows/` + id, params)
  },
  // 修改组织类型的状态   add by qiaokun 2020-12-27
  // putOrganizationTypeStatus(id, params) {
  //   return axios.put(`${config.organService}/organizationTypes/` + id, params)
  // }
  putSlideShowStatus(id, params) {
    console.log(params)
    return axios.put(`${config.managementService}/slideshows/` + id + '/displayed', params)
  }
}
export default putApi
