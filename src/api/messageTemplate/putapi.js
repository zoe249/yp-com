/*
 * @Author: qiaokun
 * @Date: 2020-08-19
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 微信域 的消息模板设置 查询接口
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 根据消息模板id修改状态
  putMessageTemplatesStatus(id, data) {
    return axios.put(`${config.wechatService}/messageTemplates/${id}/status`, data)
  },
  putMessageTemplates(id, data) {
    return axios.put(`${config.wechatService}/messageTemplates/${id}`, data)
  }
}
export default putApi
