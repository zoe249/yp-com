/*
 * @Author: qiaokun
 * @Date: 2021-01-21 15:44:23
 * @LastEditTime: null
 * @LastEditors: null
 * @Description: 修改图片导航接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 修改数据字典自定义状态
  putPictureNavigation(id, params) {
    return axios.put(`${config.managementService}/pictureNavigations/` + id, params)
  }
  // 修改指定数据字典项值内容
  // putDataDicItemStatus(ddId, id, data) {
  //   return axios.put(`${config.managementService}/dataDics/${ddId}/itemValues/` + id, data)
  // }
}

export default putApi
