import axios from '../http.js'
import { config } from '../config'
const postApi = {
  addAgreement(params) {
    return axios.post(`${config.managementService}/protocols`, params)
  }
}
export default postApi
