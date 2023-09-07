import axios from '../http.js'
import { config } from '../config'
const getapi = {
  // 获取积分调整列表
  getPointEditList(data) {
    return axios.get(`${config.pointService}` + '/pointEdit' +
      '?pageIndex=' + `${data.pageIndex}` +
      '&pageSize=' + `${data.pageSize}` +
      '&cardNumber=' + `${data.cardNumber}` +
      '&realName=' + `${data.realName}` +
      '&createTimeFrom=' + `${data.createTimeFrom}` +
      '&createTimeTo=' + `${data.createTimeTo}`
    )
  }
}
export default getapi
