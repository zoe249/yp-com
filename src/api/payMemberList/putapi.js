import axios from '../http.js'
import { config } from '../config'
const putApi = {
  release(id) {
    return axios.put(`${config.memberService}/paidMemberSchemes/${id}/release`)
  },
  revoke(id) {
    return axios.put(`${config.memberService}/paidMemberSchemes/${id}/revoke`)
  },
  editPayMember(id, data) {
    return axios.put(`${config.memberService}/paidMemberSchemes/${id}`, data)
  }
}
export default putApi
