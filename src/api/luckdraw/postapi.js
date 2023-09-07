/*
 * @Author: qiaokun
 * @Date: 2021-09-09
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 添加抽奖接口
 */
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 新增抽奖接口
  postLuckDraw(data) {
    return axios.post(`${config.couponService}/luckyDraws`, data)
  }
}
export default postApi
