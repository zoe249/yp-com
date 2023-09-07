/*
 * @Author: your name
 * @Date: 2020-12-04 11:09:21
 * @LastEditTime: 2020-12-18 11:36:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \crm-mvp-system-web\src\mock\organization\organization.js
 */
export default {
  getmembers: () => {
    return {
      code: 2000,
      data: {
        data: [
          {
            id: 1,
            name: '平台',
            top: true,
            status: true,
            createAt: '2020-01-01',
            updateAt: '2020-01-01'
          },
          {
            id: 2,
            name: '公司',
            top: false,
            status: true,
            createAt: '2020-01-01',
            updateAt: '2020-01-01'
          },
          {
            id: 3,
            name: '门店',
            top: false,
            status: true,
            createAt: '2020-01-01',
            updateAt: '2020-01-01'
          }
        ]
      }
    }
  }
}
