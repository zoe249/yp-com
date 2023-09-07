import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 优惠券信息列表
  getCouponInfoList(data) {
    return axios.get(
      `${config.couponService}/couponInfo` +
        '?couponNo=' +
        `${data.couponNo}` +
        '&couponTemplateName=' +
        `${data.couponTemplateName}` +
        '&couponTemplateCode=' +
        `${data.couponTemplateCode}` +
        '&saleCouponActivityCode=' +
        `${data.saleCouponActivityCode}` +
        '&couponStatus=' +
        `${data.couponStatus}` +
        '&type=' +
        `${data.type}` +
        '&cardNumber=' +
        `${data.cardNumber}` +
        '&beginTime=' +
        `${data.beginTime}` +
        '&endTime=' +
        `${data.endTime}` +
        '&pageIndex=' +
        `${data.pageIndex}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&saleCouponActivityId=' +
        `${data.saleCouponActivityId}` +
        '&number=' +
        `${data.number}`
    )
  },
  // 券操作记录
  getoperationList(data) {
    console.log('datat', data)
    return axios.get(
      `${config.couponService}/couponsActivityRecord` +
        '?startTime=' +
        `${data.startTime}` +
        '&endTime=' +
        `${data.endTime}` +
        '&orderNumber=' +
        `${data.orderNumber}` +
        '&type=' +
        `${data.type}` +
        '&code=' +
        `${data.code}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&pageIndex=' +
        `${data.pageIndex}`
    )
  },
  // 查询签到配置信息
  getDailyAttendanceList() {
    return axios.get(`${config.couponService}/dailyAttendance/detail`)
  },
  // 获取签到统计echarts表
  getEchartsList() {
    return axios.get(`${config.couponService}/dailyAttendance/statistics`)
  },
  // 获取签到数据列表
  getSignList(data) {
    return axios.get(
      `${config.couponService}/dailyAttendance` +
        '?attendanceEndTime=' +
        `${data.attendanceEndTime}` +
        '&attendanceStartTime=' +
        `${data.attendanceStartTime}` +
        '&memberName=' +
        `${data.memberName}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&pageIndex=' +
        `${data.pageIndex}`
    )
  }
}
export default getApi
