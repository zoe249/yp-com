import axios from '../http.js'
import { config } from '../config'

const putApi = {
  /**
   * 修改礼品卡发售单
   * @param {string} id
   * @param {object} params
   */
  giftCardSellsUpdate(id, params) {
    return axios({
      url: `${config.saleService}/giftCardSells/${id}`,
      method: 'PUT',
      data: params
    })
  },

  /**
   * 生效礼品卡发售单
   * @param {string} id
   */
  giftCardSellsRelease(id) {
    return axios({
      url: `${config.saleService}/giftCardSells/${id}/release`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}

export default putApi
