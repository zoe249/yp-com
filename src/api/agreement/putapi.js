import axios from '../http.js'
import { config } from '../config'
const putApi = {
  editAgreement(id, data) {
    return axios.put(`${config.managementService}/protocols/${id}`, data)
  }
}
export default putApi
