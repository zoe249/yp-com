/*
 * @Author: liupenghui
 * @Date: 2020-12-23 10:57:35
 * @LastEditTime: 2020-12-27 17:44:53
 * @LastEditors: qiaokun
 * @Description: 删除组织类型接口封装
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const deleteApi = {
  /*
   * @Description: 通过删除组织类型
   * @params: id  组织类型id
   */
  // 这句话不用复制  代码举例说明： 方法名称   操作 + 模块名称   删除组织类型  deleteOrganizationType
  deleteOrganizationType(id) {
    return axios.delete(`${config.organService}/organizationTypes/` + `${id}`)
  }
}
export default deleteApi
