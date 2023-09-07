/*
 * @Author: liupenghui
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-27 11:03:20
 * @LastEditors: qiaokun
 * @Description: 添加组织类型接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  postOrganizationType(params) {
    return axios.post(`${config.organService}/organizationTypes`, params)
  }
}

export default postApi
