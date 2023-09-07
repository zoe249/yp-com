/*
 * @Author: qiaokun
 * @Date: 2020-12-17 15:24:12
 * @LastEditTime: 2020-12-21 11:03:20
 * @LastEditors: Please set LastEditors
 * @Description: 查询七牛云token值接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取角色列表
  getQiniuToken() {
    return axios.get(`${config.fileService}` + '/qiniu/getQiniuToken')
  }
}
export default getApi
