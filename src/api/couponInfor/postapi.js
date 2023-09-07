import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 签到提交接口
  postAddList(params) {
    console.log('paramsparams', params)
    return axios.post(`${config.couponService}/dailyAttendance`, params)
  }
}

export default postApi
