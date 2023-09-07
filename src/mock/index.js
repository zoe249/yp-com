/*
 * @Author: qiaokun
 * @Date: 2020-12-02 11:36:19
 * @LastEditTime: 2021-01-20 10:18:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \src\mock\index.js
 */
// 导入mockjs
import Mock from 'mockjs'
// import { config } from '../api/config'
import loginApi from './login/login.js'
import homeApi from './home/home.js'
import permissionApi from './permission/permission.js'
import roleApi from './role/role.js'
import userApi from './user/user.js'
import organizationApi from './organization/organization.js'
import relationsApi from './organization/relations.js'
import channelApi from './organization/channel.js'
import terminalApi from './organization/terminal.js'
import channelTerminalApi from './organization/channelTerminal.js'
import organizationManagementApi from './organization/organizationManagement.js'
import dataPermissionApi from './organization/dataPermission.js'
import memberingRulesApi from './member/memberingRules.js'
import memberLabelApi from './member/memberLabel.js'
import memberTagApi from './member/memberTag.js'
import dataDicApi from './dataDic/dataDic.js'
import memberListApi from './member/memberList.js'
import viewMemberApi from './member/viewMember.js'
import memberAttibutesApi from './member/memberAttibutes.js'
import pointTypeApi from './pointManagement/pointType.js'
import pointValidPeriod from './pointManagement/pointValidPeriod.js'
import giftCardApi from './giftCard/giftCardScheme.js'
import giftListApi from './giftCard/giftList.js'
import slideShowApi from './slideShow/slideShow.js'

// 设置延时200-2000延时
Mock.setup({
  timeout: '200-2000'
})
// const baseURL = 'http://dev.yuepong.com:9092/api-gateway'
// 登录
// 拦截的是/user/login
Mock.mock(/\/user\/login/, 'post', loginApi.loginInfo)
Mock.mock('http://dev.yuepong.com:9092/api-gateway/home/getmembers', 'get', userApi.getmembers)
Mock.mock(/\/user-service\/api\/v1.5\/users/, 'post', userApi.getmembers)
Mock.mock(/\/user-service\/api\/v1.5\/users/, 'put', userApi.getmembers)
// 拦截的是/home/getmembers
Mock.mock(/\/home\/getmembers/, 'get', homeApi.getmembers)
// 拦截的是/permission/getPermissionList
// Mock.mock(`${baseURL}` + `${config.userService}` + '/permissions?applicationId=0', 'get', permissionApi.getpermissionlist)
// 拦截的是/role/getRoleList
Mock.mock(/\/role\/getRoleList/, 'get', roleApi.getRoleList)
// 组织类型，拦截的是/organization/getmembers
Mock.mock(/\/organ-service\/api\/v1.5\/organizationTypes/, 'get', organizationApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.5\/organizationTypes/, 'post', organizationApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.5\/organizationTypes/, 'put', organizationApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.5\/organizationTypes/, 'delete', organizationApi.getmembers)
// 组织关系，拦截的是/relations/getmembers
Mock.mock(/\/organ-service\/api\/v1.5\/organizationRelations/, 'get', relationsApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.5\/organizationRelations/, 'post', relationsApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.5\/organizationRelations/, 'put', relationsApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.5\/organizationRelations/, 'delete', relationsApi.getmembers)
// 首页当前用户信息, 拦截的是 /home/getCurrentUser
Mock.mock(/\/home\/getCurrentUser/, 'get', userApi.getCurrentUser)
// 通过菜单id获取具体菜单信息  拦截的是/permission/getPermissionById
Mock.mock(/\/permission\/getPermissionById/, 'get', permissionApi.getPermissionById)
// 渠道配置,拦截的是/channel/getmembers
Mock.mock(/\/organ-service\/api\/v1.0\/channels/, 'put', channelApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.0\/channels/, 'post', channelApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.0\/channels/, 'get', channelApi.getmembers)
// Mock.mock(/\/config\/channels/, 'get', channelApi.getmembers)
// 终端配置,拦截的是/terminal/getmembers
Mock.mock(/\/organ-service\/api\/v1.5\/terminals/, 'get', terminalApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.5\/terminals/, 'post', terminalApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.5\/terminals/, 'put', terminalApi.getmembers)
// 渠道与终端关系，拦截的是/channelTerminal/getmembers
Mock.mock(/\/organ-service\/api\/v1.5\/channelsTerminalsMappings/, 'get', channelTerminalApi.getmembers)
// 组织管理，拦截的是/organizationManagement/getmembers
Mock.mock(/\/organizationManagement\/getmembers/, 'get', organizationManagementApi.getmembers)
Mock.mock(/\/organizationManagement\/getmembers/, 'post', organizationManagementApi.getmembers)
// 获取组织顶级数据 拦截的是/organ-service/api/v1.5/organizations/top
Mock.mock(/\/organ-service\/api\/v1.5\/organizations\/top/, 'get', organizationManagementApi.getOrganizationsTop)
Mock.mock(/\/organ-service\/api\/v1.5\/organizations/, 'get', organizationManagementApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.5\/organizations/, 'post', organizationManagementApi.getmembers)
Mock.mock(/\/organ-service\/api\/v1.5\/organizations/, 'put', organizationManagementApi.getmembers)
// 数据权限，拦截的是/dataPermission/getmembers
Mock.mock(/\/user-service\/api\/v1.5\/organizationMappings/, 'get', dataPermissionApi.getmembers)
Mock.mock(/\/user-service\/api\/v1.5\/organizationMappings/, 'post', dataPermissionApi.getmembers)
Mock.mock(/\/user-service\/api\/v1.5\/organizationMappings/, 'put', dataPermissionApi.getmembers)
// 通过角色id获取具体角色信息 拦截的是 /role/getRoleById
Mock.mock(/\/role\/getRoleById/, 'get', roleApi.getRoleById)
// 编号规则 拦截的是/channel/getmembers
Mock.mock(/\/memberingRules\/getmembers/, 'get', memberingRulesApi.getmembers)
Mock.mock(/\/memberingRules\/getmembers/, 'put', memberingRulesApi.getmembers)
Mock.mock(/\/memberingRules\/getmembers/, 'post', memberingRulesApi.getmembers)
// 会员标签 拦截的是/memberLabel/getmembers
Mock.mock(/\/memberLabel\/getmembers/, 'get', memberLabelApi.getmembers)
Mock.mock(/\/memberLabel\/getmembers/, 'put', memberLabelApi.getmembers)
Mock.mock(/\/memberLabel\/getmembers/, 'post', memberLabelApi.getmembers)
Mock.mock(/\/memberLabel\/getmembers/, 'delete', memberLabelApi.getmembers)
// 会员标签
Mock.mock(/\/memberTag\/getmembers/, 'get', memberTagApi.getmembers)
Mock.mock(/\/memberTag\/getmembers/, 'delete', memberTagApi.getmembers)
Mock.mock(/\/memberTag\/getmembers/, 'post', memberTagApi.getmembers)
Mock.mock(/\/memberTag\/getmembers/, 'put', memberTagApi.getmembers)
// 查看会员
Mock.mock(/\/viewMember\/getmembers/, 'get', viewMemberApi.getmembers)
// 积分种类
Mock.mock(/\/pointType\/getmembers/, 'get', pointTypeApi.getmembers)
Mock.mock(/\/pointType\/getmembers/, 'post', pointTypeApi.getmembers)
Mock.mock(/\/pointType\/getmembers/, 'put', pointTypeApi.getmembers)
// 积分有效期
Mock.mock(/\/pointValidPeriod\/getmembers/, 'get', pointValidPeriod.getmembers)
Mock.mock(/\/pointValidPeriod\/getmembers/, 'post', pointValidPeriod.getmembers)
Mock.mock(/\/pointValidPeriod\/getmembers/, 'put', pointValidPeriod.getmembers)
// 礼品卡方案
Mock.mock(/\/giftCardScheme\/getmembers/, 'get', giftCardApi.getmembers)
// 礼品卡列表
Mock.mock(/\/giftList\/getmembers/, 'get', giftListApi.getmembers)
// 广告管理
Mock.mock(/\/slideShow\/getmembers/, 'get', slideShowApi.getmembers)
Mock.mock(/\/slideShow\/getmembers/, 'post', slideShowApi.getmembers)
Mock.mock(/\/slideShow\/getmembers/, 'put', slideShowApi.getmembers)
Mock.mock(/\/slideShow\/getmembers/, 'delete', slideShowApi.getmembers)
// 会员筛选器 拦截的是/membershipFilter/getmembers
// Mock.mock(/\/membershipFilter\/getmembers/, 'get', memberLabelApi.getmembers)
// 获取数据字典列表
Mock.mock(RegExp('http://dev.yuepong.com:9092/api-gateway/dataDics1' + '.*'), 'get', dataDicApi.getDataDicList)
// 获取数据字典项值
Mock.mock(RegExp('http://dev.yuepong.com:9092/api-gateway/dataDics/itemValues' + '.*'), 'get', dataDicApi.getDataDicItemList)
// 获取会员列表数据
Mock.mock(RegExp('http://dev.yuepong.com:9092/api-gateway/members' + '.*'), 'get', memberListApi.getMemberList)
// 获取会员属性列表数据
Mock.mock(RegExp('http://dev.yuepong.com:9092/api-gateway/memberAttibutes' + '.*'), 'get', memberAttibutesApi.getMemberAttibutesList)
