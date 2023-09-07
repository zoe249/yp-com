/*
 * @Author: your name
 * @Date: 2020-12-29 08:43:24
 * @LastEditTime: 2021-01-07 16:21:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\codeRules\postapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 新增编号规则数据接口
  postCodeRulesList(params) {
    return axios.post(`${config.memberService}/codeRules`, params)
  }
}

export default postApi
