/*
 * @Author: your name
 * @Date: 2021-01-11 20:20:48
 * @LastEditTime: 2021-01-18 14:04:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\api\pointType\getapi.js
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  // 获取积分类型表格
  getPointTypeList(data) {
    return axios.get(
      `${config.pointService}/pointTypes` +
        '?info=' +
        `${data.info}` +
        '&species=' +
        `${data.species}` +
        '&status=' +
        `${data.status}` +
        '&pageSize=' +
        `${data.pageSize}` +
        '&pageIndex=' +
        `${data.pageIndex}`
    )
  },
  // 根据 id 获取某一条数据
  getPointTypeListById(id) {
    return axios.get(`${config.pointService}/pointTypes/` + `${id}`)
  },
  // 名称唯一性校验
  getCheckName(value, id) {
    return axios.get(`${config.pointService}/pointTypes/exist` + '?name=' + `${value}` + '&id=' + id)
  }
}
export default getApi
