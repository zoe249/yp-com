/*
 * @Author: qiaokun
 * @Date: 2021-09-08
 * @LastEditTime: null
 * @LastEditors: Please set LastEditors
 * @Description: 查询抽奖接口
 */
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 分页查询抽奖列表接口
  getLuckDrawList(data) {
    return axios.get(
      `${config.couponService}/luckyDraws?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&drawStyle=${data.drawStyle}&name=${data.name}&status=${data.status}&beginTime=${data.beginTime}&endTime=${data.endTime}`
    )
  },
  // 根据幸运抽奖id查询单条抽奖数据
  getLuckDrawListDetailById(id) {
    return axios.get(`${config.couponService}/luckyDraws/${id}`)
  },
  // 分页查询幸运抽奖明细
  getViewDataDetailList(data) {
    return axios.get(
      `${config.couponService}/luckyDraws/drawRecord?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&memberId=${data.memberId}&memberName=${data.memberName}&number=${data.number}&drawBeginTime=${data.drawBeginTime}&drawEndTime=${data.drawEndTime}&exclude=0`
    )
  }
}
export default getApi
