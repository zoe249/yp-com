import axios from '../http.js'
import { config } from '../config'

const getApi = {
  /**
   * 分页查询礼品卡发售单
   * @param {*} params
   * @returns
   */
  getGiftCardSells(params) {
    return axios({
      url: `${config.saleService}/giftCardSells`,
      params: { ...params }
    })
  },

  /**
   * 根据id查询礼品卡发售单详情
   */
  getGiftCardSellById(id) {
    return axios({
      url: `${config.saleService}/giftCardSells/${id}`
    })
  },

  /**
   * 礼品卡发售单导入会员下载模板
   */
  giftCardSellsDownload() {
    return axios({
      url: `${config.saleService}/giftCardSells/download`,
      responseType: 'blob'
    })
  },

  /**
   * 礼品卡发售单导出秘钥
   */
  giftCardSellsExport(params) {
    return axios({
      url: `${config.saleService}/giftCardSells/export`,
      responseType: 'blob',
      params: {
        ...params
      }
    })
  },
  /**
   * 查询礼品卡列表 非分页
   */
  giftCardSchemesAll(params) {
    return axios({
      url: `${config.saleService}/giftCardSchemes/all`,
      // url: `${config.saleService}/giftCardSchemes`,
      params: { ...params }
    })
  }
}

export default getApi
