/*
 * @Author: qiaokun
 * @Date: 2020-08-20
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 微信域 的消息模板设置 添加接口
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 添加消息模板数据
  postMessageTemplates(data) {
    return axios.post(`${config.wechatService}/messageTemplates`, data)
  }
}
export default postApi
