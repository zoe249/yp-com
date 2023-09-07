/*
 * @Author: your name
 * @Date: 2020-12-14 09:48:05
 * @LastEditTime: 2020-12-21 10:02:19
 * @LastEditors: qiaokun
 * @Description: 新增渠道接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const postApi = {
  // 3.提交渠道数据接口
  postChannel(params) {
    return axios.post(`${config.organService}/channels`, params)
  }
}

export default postApi
