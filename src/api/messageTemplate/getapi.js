/*
 * @Author: qiaokun
 * @Date: 2020-08-19
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 微信域 的消息模板设置 查询接口
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 分页查询消息模板
  getMessageTemplates(data) {
    return axios.get(`${config.wechatService}/messageTemplates?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&templateApplicationId=${data.templateApplicationId}&templateId=${data.templateId}`)
  },
  // 模板用途列表（未分页）
  getTemplateApplications() {
    return axios.get(`${config.wechatService}/templateApplications`)
  },
  // 根据模板id查询模板详情参数
  getTemplateApplicationItems(id) {
    return axios.get(`${config.wechatService}/templateApplicationItems?templateApplicationId=${id}`)
  },
  // 根据微信模板id查询模板字符串截取数据
  getWxchatMessageTemplate(id) {
    return axios.get(`${config.wechatService}/weChatOfficialAccounts/getMessageTemplate?templateId=${id}`)
  },
  /**
   * 描述：根据模板id查询模板数据
   * @param {*} id
   * @returns
   */
  getMessageTemplateById(id) {
    return axios.get(`${config.wechatService}/messageTemplates/${id}`)
  },
  // 根据id与用途id查询模板是否存在
  getMessageTemplateUseExist(templateApplicationId, id) {
    return axios.get(`${config.wechatService}/messageTemplates/exist?id=${id}&templateApplicationId=${templateApplicationId}`)
  }
}
export default getApi
