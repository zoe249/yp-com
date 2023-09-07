/*
 * @Author: qiaokun
 * @Date: 2021-01-07 15:44:23
 * @LastEditTime: null
 * @LastEditors: null
 * @Description: 修改数据字典接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 修改数据字典自定义状态
  putDataDicStatus(id, params) {
    return axios.put(`${config.managementService}/dataDics/` + id, params)
  },
  // 修改指定数据字典项值内容
  putDataDicItemStatus(ddId, id, data) {
    return axios.put(`${config.managementService}/dataDics/${ddId}/itemValues/` + id, data)
  }
}

export default putApi
