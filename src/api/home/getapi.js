// 导入 axios
import axios from '../http.js'
const baseService = '/home/getmembers'
const getApi = {
  getMembersList() {
    return axios.get(`${baseService}`)
  },
  getCurrentUser() {
    return axios.get('/home/getCurrentUser')
  }
}
export default getApi
