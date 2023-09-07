/*
 * @Author: qiaokun
 * @Date: 2021-01-21 09:48:05
 * @LastEditTime: 2020-12-21 10:02:19
 * @LastEditors: qiaokun
 * @Description: 新增图片导航接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 3.提交图片导航的方法
  postPictureNavigation(params) {
    return axios.post(`${config.managementService}/pictureNavigations`, params)
  }
}

export default postApi
