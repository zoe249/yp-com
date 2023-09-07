/*
 * @Author: qiaokun
 * @Date: 2021-08-27 10:06:32
 * @LastEditTime: 2021-08-27 10:06:32
 * @LastEditors: qiaokun
 * @Description: 登录获取滑块验证码信息接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  getSlideImgInfo() {
    return axios.get(`${config.authServer}` + '/verifyImage')
  }
}
export default getApi
