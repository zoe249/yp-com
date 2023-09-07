/*
 * @Author: your name
 * @Date: 2020-12-29 08:43:24
 * @LastEditTime: 2021-01-11 15:37:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\codeRules\getapi.js
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
// const baseService = '/memberingRules/getmembers/'
const getApi = {
  // 获取编号规则的列表
  getCodeRulesList(data) {
    return axios.get(`${config.memberService}/codeRules` + '?type=' + `${data.type}`)
  },
  // 根据 id 获取某一条数据
  getCodeRulesListById(id) {
    return axios.get(`${config.memberService}/codeRules/` + `${id}`)
  },
  // 编号规则预览效果
  getCodeRulesView(data) {
    return axios.get(`${config.memberService}/codeRules/previewCode` + '?codePrefix=' + `${data.codePrefix}` + '&codeMiddle=' + `${data.codeMiddle}` + '&codeSuffix=' + data.codeSuffix)
  },
  // 获取编号类型
  getCodeTypeList(data) {
    return axios.get(`${config.memberService}/codeRules/type` + '?excludeExist=' + `${data.excludeExist}`)
  }
}
export default getApi
