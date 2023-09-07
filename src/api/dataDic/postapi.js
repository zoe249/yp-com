/*
 * @Author: qiaokun
 * @Date: 2021-01-06 09:48:05
 * @LastEditTime: 2020-12-21 10:02:19
 * @LastEditors: qiaokun
 * @Description: 新增数据字典接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 3.提交数据字典的方法
  postDataDic(params) {
    return axios.post(`${config.managementService}/dataDics`, params)
  },
  // 提交数据字典项值的方法
  postDataDicItem(ddId, params) {
    return axios.post(`${config.managementService}/dataDics/${ddId}/itemValues`, params)
  }
}

export default postApi
