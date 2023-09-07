/*
 * @Author: 谯坤
 * @Date: 2021-06-21 11:36:19
 * @LastEditTime: 2021-06-21 11:36:19
 * @LastEditors: 谯坤
 * @Description: 查询会员等级列表接口
 */
// 导入 axios
import axios from '../http.js'
import { config } from '../config'
const getApi = {
  /**
   * 描述：查询会员等级列表数据
   * @param {*} params 查询表单对象
   * @returns 返回分页信息、会员等级列表数据
   */
  getMemberLevelList(params) {
    return axios.get(`${config.memberService}/memberLevels?level=${params.level}&name=${params.name}&pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`)
  },
  /**
   * 描述：根据会员等级 id 查询 会员等级数据
   * @param {*} id 会员等级id
   * @returns 具体某一条会员等级数据
   */
  getMemberLevelById(id) {
    return axios.get(`${config.memberService}/memberLevels/${id}`)
  },
  /**
   * 描述：校验等级名称唯一性
   * @param {*} value 等级名称
   * @param {*} id 新增时 id 等于'' 编辑时传 id 值
   * @returns
   */
  getCheckName(value, id) {
    return axios.get(`${config.memberService}/memberLevels/nameUnique` + '?name=' + value + '&id=' + id)
  },
  /**
   * 描述：校验等级唯一性
   * @param {*} value 等级
   * @param {*} id 新增时 id 等于'' 编辑时传 id 值
   * @returns
   */
  getCheckLevel(value, id) {
    return axios.get(`${config.memberService}/memberLevels/levelUnique` + '?level=' + value + '&id=' + id)
  }
}
export default getApi
