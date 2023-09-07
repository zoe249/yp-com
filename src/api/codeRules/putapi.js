/*
 * @Author: your name
 * @Date: 2020-12-29 08:43:24
 * @LastEditTime: 2021-01-07 16:25:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\codeRules\putapi.js
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 提交编号规则数据接口
  putCodeRulesList(params, id) {
    return axios.put(`${config.memberService}/codeRules/` + id, params)
  }
}

export default putApi
