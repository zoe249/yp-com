import axios from '../http.js'
import { config } from '../config'
const getApi = {
  getList(data) {
    return axios.get(`${config.managementService}/protocols?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`)
  },
  getDetailById(id) {
    return axios.get(`${config.managementService}/protocols/${id}`)
  },
  validName(id, name) {
    return axios.get(`${config.managementService}/protocols/name:exist?name=${name}&id=${id}`)
  }
}
export default getApi
