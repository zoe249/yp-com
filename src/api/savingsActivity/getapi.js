/*
 * @Author: wangdandi
 * @Date: 2020-09-22
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 充值活动接口
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 分页查询充值活动接口
  getSavingsActivityList(data) {
    return axios.get(
      `${config.memberService}/savingsActivity?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&name=${data.name}&status=${data.status}&beginTime=${data.beginTime}&endTime=${data.endTime}`
    )
  },
  // 储存明细数据列表接口
  getDataSavingsActivityList(data) {
    return axios.get(
      `${config.memberService}/savingsList?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&nickname=${data.nickname}&type=${data.type}&channelsId=${data.channelsId}&number=${data.number}&beginTime=${data.beginTime}&endTime=${data.endTime}`
    )
  },
  // 根据id查看活动详情
  getViewSavingsActivityById(id) {
    return axios.get(`${config.memberService}/savingsActivity/${id}`)
  }
}
export default getApi
