/*
 * @Author: qiaokun
 * @Date: 2020-12-14 10:57:32
 * @LastEditTime: 2020-12-26 10:49:09
 * @LastEditors: qiaokun
 * @Description: 登录获取token值接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  login(params, type) {
    return axios.post(`${config.authServer}` + '/oauth/token', params, type)
  }
}
export default postApi
