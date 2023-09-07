/*
 * @Author: your name
 * @Date: 2021-01-20 10:11:34
 * @LastEditTime: 2021-01-21 15:42:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\slideShow\postapi.js
 */
// 导入 axios
import axios from '../http.js'
// const baseService = '/slideShow/getmembers/'
import { config } from '../config'
const postApi = {
  postSlideShowList(params) {
    return axios.post(`${config.managementService}/slideshows`, params)
  }
}
export default postApi
