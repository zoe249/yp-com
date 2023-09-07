// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  /**
   * 新增礼品卡发售单
   */
  giftCardSellsAdd(params) {
    return axios({
      url: `${config.saleService}/giftCardSells`,
      method: 'POST',
      data: params
    })
  },
  /**
   * 礼品卡发售单导入会员上传
   */
  giftCardSellsUpload(file) {
    return axios.post(`${config.saleService}/giftCardSells/upLoad`, file)
  },
  // 上传文件路径
  uploadFileUrl() {
    return `/com/api-gateway${config.saleService}/giftCardSells/upload`
  },
  // 礼品卡发售单导入会员下载异常excel
  downloadErrorFile(file) {
    return axios({
      url: `${config.saleService}/giftCardSells/downloadErr`,
      method: 'POST',
      data: file,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/octet-stream;charset=UTF-8'
      }
    })
  }
}

export default postApi
