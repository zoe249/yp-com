import axios from '../http.js'
import { config } from '../config'
const getApi = {
  getList(data) {
    return axios.get(`${config.memberService}/paidMemberSchemes` + '?pageIndex=' + `${data.pageIndex}` + '&pageSize=' + `${data.pageSize}`)
  },
  getRecordList(data) {
    return axios.get(
      `${config.memberService}/memberPaidMappings` +
        '?pageIndex=' +
        `${data.pageIndex}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&phone=' +
        `${data.phone}` +
        '&searchInfo=' +
        `${data.searchInfo}` +
        '&status=' +
        `${data.status}`
    )
  },
  getDetailById(id) {
    return axios.get(`${config.memberService}/paidMemberSchemes/${id}`)
  },
  validName(id, name) {
    return axios.get(`${config.memberService}/paidMemberSchemes/name?productName=${name}&id=${id}`)
  },
  validCode(code) {
    return axios.get(`${config.memberService}/paidMemberSchemes/code?productCode=${code}`)
  }
}
export default getApi
