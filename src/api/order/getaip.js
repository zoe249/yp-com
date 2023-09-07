import axios from '../http.js'
import { config } from '../config'
const getApi = {
  //  订单管理
  getOrderList(data) {
    return axios.get(
      `${config.orderService}/order` +
        '?memberCode=' +
        `${data.memberCode}` +
        '&code=' +
        `${data.code}` +
        '&activityCode=' +
        `${data.activityCode}` +
        '&beginTime=' +
        `${data.beginTime}` +
        '&endTime=' +
        `${data.endTime}` +
        '&orderNum=' +
        `${data.orderNum}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&pageIndex=' +
        `${data.pageIndex}`
    )
  },
  // 查看详情--基本信息
  showOrderDialog(id) {
    return axios.get(`${config.orderService}` + '/order/' + id)
  },
  // 查看详情--商品信息
  getProductList(id) {
    return axios.get(`${config.couponService}` + '/couponsActivity/' + id)
  },
  // 查看详情--会员信息
  getMemberList(id) {
    return axios.get(`${config.memberService}/members/` + id)
  },

  /**
   * 根据id查询礼品卡发售单详情
   */
  getGiftCardSellById(id) {
    return axios({
      url: `${config.saleService}/giftCardSells/${id}`
    })
  }
}

export default getApi
