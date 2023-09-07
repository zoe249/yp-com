/*
 * @Author: your name
 * @Date: 2021-01-20 10:11:46
 * @LastEditTime: 2021-01-20 19:26:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\slideShow\deleteapi.js
 */
import axios from '../http.js'
// const baseService = '/slideShow/getmembers/'
import { config } from '../config'
const deleteApi = {
  deleteSlideShowList(id) {
    return axios.delete(`${config.managementService}/slideshows/` + `${id}`)
  }
}
export default deleteApi
