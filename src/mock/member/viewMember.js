/*
 * @Author: your name
 * @Date: 2021-01-06 10:31:45
 * @LastEditTime: 2021-01-06 10:39:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\mock\member\viewMember.js
 */
// 导入mockjs 使用数据
// import Mock from 'mockjs'

export default {
  getmembers: () => {
    return {
      code: 2000,
      pageIndex: 1,
      pageSize: 2,
      total: 2,
      data: [
        {
          id: '1',
          cardNumber: '123456',
          status: true,
          realName: '真实姓名',
          gender: '1',
          phone: '17802925394',
          registrationdate: '2020-12-21',
          cardlevel: '1',
          name: '原生会员'
        },
        {
          id: '2',
          cardNumber: '789000',
          status: false,
          realName: '虚假姓名',
          gender: '2',
          phone: '17802925394',
          registrationdate: '2021-01-06',
          cardlevel: '2',
          name: '新生会员'
        },
        {
          id: '3',
          cardNumber: '123456',
          status: true,
          realName: '真假姓名',
          gender: '2',
          phone: '17802925394',
          registrationdate: '2020-12-21',
          cardlevel: '3',
          name: '牢牢会员'
        }
      ]
    }
  }
}
