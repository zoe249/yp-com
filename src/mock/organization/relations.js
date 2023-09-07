/*
 * @Author: your name
 * @Date: 2020-12-04 11:09:21
 * @LastEditTime: 2020-12-04 17:33:22
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
            organizationTypeId: '我是组织类型',
            parentOrganizationTypeId: '我是上级组织名称',
            // status: true,
            createAt: '2020-01-01',
            updateAt: '2020-01-01'
          },
          {
            id: 2,
            organizationTypeId: '王小虎',
            parentOrganizationTypeId: '我是上级组织名称',
            // status: true,
            createAt: '2020-01-01',
            updateAt: '2020-01-01'
          },
          {
            id: 3,
            organizationTypeId: '王小蛇',
            parentOrganizationTypeId: '我是上级组织名称',
            // status: true,
            createAt: '2020-01-01',
            updateAt: '2020-01-01'
          }
        ]
      }
    }
  }
}
