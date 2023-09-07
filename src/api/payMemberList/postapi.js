import axios from '../http.js'
import { config } from '../config'
const postApi = {
  addPayMember(params) {
    return axios.post(`${config.memberService}/paidMemberSchemes`, params)
  }
}
export default postApi
