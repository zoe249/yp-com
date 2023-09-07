/*
 * @Author: your name
 * @Date: 2021-01-20 09:33:39
 * @LastEditTime: 2021-01-22 10:02:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\slideShow\getapi.js/
 */
// 导入 axios
import axios from '../http.js'
// const baseService = '/slideShow/getmembers/'
import { config } from '../config'
const getApi = {
  // 获取广告管理后端数据
  getSlideShowTableList(data) {
    return axios.get(
      `${config.managementService}/slideshows` + '?site=' + `${data.site}` + '&displayed=' + `${data.displayed}` + '&pageIndex=' + `${data.pageIndex}` + '&pageSize=' + `${data.pageSize}`
    )
  },
  // 根据 Id 获取某一条广告管理数据
  getSlideShowListById(id) {
    return axios.get(`${config.managementService}/slideshows/` + `${id}`)
  },
  // 用于对列表的数据进行查询（用于状态开关）
  getSlideShowListChangeStatus(data) {
    return axios.get(`${config.managementService}/slideshows` + '?site=' + `${data.site}` + '&displayed=' + `${data.displayed}`)
  }
}
export default getApi
