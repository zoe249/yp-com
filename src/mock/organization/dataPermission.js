/*
 * @Author: your name
 * @Date: 2020-12-14 17:57:23
 * @LastEditTime: 2020-12-21 10:45:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\mock\organization\dataPermission.js
 */
export default {
  getmembers: () => {
    return {
      code: 2000,
      data: {
        data: [
          {
            id: 1,
            userId: '20180102133',
            name: 'liupenghui',
            organizationCode: '平台',
            permissionOrganizationTypeId: '平台',
            permissionOrganizationId: '111',
            createTime: '2020-01-01',
            creator: 'liu',
            updateTime: '2202-01-01',
            updator: 'handsome'
          },
          {
            id: 2,
            userId: '20180102144',
            name: 'zhangsan',
            organizationCode: '企业',
            permissionOrganizationTypeId: '企业',
            permissionOrganizationId: '222',
            createTime: '2020-02-02',
            creator: 'peng',
            updateTime: '2202-02-02',
            updator: 'hui'
          },
          {
            id: 3,
            userId: '20180102155',
            name: 'lisi',
            organizationCode: '公司',
            permissionOrganizationTypeId: '公司',
            permissionOrganizationId: '333',
            createTime: '2020-03-03',
            creator: 'hui',
            updateTime: '2202-03-03',
            updator: 'peng'
          },
          {
            id: 4,
            userId: '20180102166',
            name: 'wangwu',
            organizationCode: '门店',
            permissionOrganizationTypeId: '门店',
            permissionOrganizationId: '444',
            createTime: '2020-04-04',
            creator: 'handsome',
            updateTime: '2202-04-04',
            updator: 'liu'
          }
        ]
      }
    }
  }
}
