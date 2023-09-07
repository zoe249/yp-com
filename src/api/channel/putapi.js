/*
 * @Author: your name
 * @Date: 2020-12-18 15:44:23
 * @LastEditTime: 2020-12-25 10:53:01
 * @LastEditors: qiaokun
 * @Description: 修改渠道接口封装
 */
import axios from '../http.js'
import { config } from '../config'
const putApi = {
  // 3.提交渠道数据接口
  putChannel(params) {
    return axios.put(`${config.organService}/channels/` + `${params.id}`, params)
  },
  // 修改组织类型的状态   add by qiaokun 2020-12-27
  putChannelStatus(id, params) {
    return axios.put(`${config.organService}/channels/` + id, params)
  }
}

export default putApi
