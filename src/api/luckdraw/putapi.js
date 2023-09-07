/*
 * @Author: qiaokun
 * @Date: 2021-09-08
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 修改抽奖接口
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 发布接口
  putReleaseLuckDraw(id) {
    return axios.put(`${config.couponService}/luckyDraws/${id}/release`)
  },
  // 撤销发布接口
  putUnpublishLuckDraw(id) {
    return axios.put(`${config.couponService}/luckyDraws/${id}/unPublish`)
  },
  // 根据id修改幸运抽奖接口
  putLuckDrawById(id, data) {
    return axios.put(`${config.couponService}/luckyDraws/${id}`, data)
  }
}
export default putApi
