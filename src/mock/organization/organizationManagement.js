/*
 * @Author: your name
 * @Date: 2020-12-14 11:50:20
 * @LastEditTime: 2020-12-14 14:23:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\mock\organization\organizationManagement.js
 */
// 导入mockjs 使用数据
// import Mock from 'mockjs'
export default {
  getmembers: () => {
    return {
      code: 2000,
      data: {
        data: [
          {
            // 应用
            id: '1',
            code: '0',
            // parentId: '0',
            name: '悦朋平台',
            organizationTypeId: '平台',
            type: '1',
            publish: true,
            permissions: [
              {
                id: '2',
                code: '01',
                parentId: '0-悦朋平台',
                address: '威海市经区大庆路53号',
                name: '悦朋',
                organizationTypeId: '企业',
                type: '2',
                publish: true,
                permissions: [
                  {
                    // 二级菜单
                    id: '3',
                    code: '0101',
                    parentId: '01-悦朋',
                    address: '威海市经区大庆路53号',
                    name: '悦朋公司',
                    organizationTypeId: '公司',
                    formats: '女装',
                    type: '2',
                    publish: true,
                    permissions: [
                      {
                        // 按钮
                        id: '4',
                        code: '010101',
                        parentId: '0101-悦朋公司',
                        address: '威海市经区大庆路53号',
                        name: '九龙城店',
                        organizationTypeId: '门店',
                        formats: '女装',
                        type: '3',
                        publish: false
                      },
                      {
                        // 按钮
                        id: '5',
                        code: '010102',
                        parentId: '0101-悦朋公司',
                        address: '威海市经区大庆路53号',
                        name: '九龙城店',
                        organizationTypeId: '门店',
                        formats: '女装',
                        type: '3',
                        publish: true
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '6',
                    code: '0201',
                    parentId: '01-悦朋',
                    address: '威海市经区大庆路53号',
                    name: '悦朋公司',
                    organizationTypeId: '公司',
                    formats: '女装',
                    type: '2',
                    publish: false,
                    permissions: [
                      {
                        // 按钮
                        id: '7',
                        code: '020101',
                        parentId: '0201-悦朋公司',
                        address: '威海市经区大庆路53号',
                        name: '九龙城店',
                        organizationTypeId: '门店',
                        formats: '女装',
                        type: '3',
                        publish: false
                      },
                      {
                        // 按钮
                        id: '8',
                        code: '020102',
                        parentId: '0201-悦朋公司',
                        address: '威海市经区大庆路53号',
                        name: '九龙城店',
                        organizationTypeId: '门店',
                        formats: '女装',
                        type: '3',
                        publish: false
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  getOrganizationsTop: () => {
    return {
      code: 2000,
      data: {
        data: {
          id: '123456',
          code: '666',
          logo: 'http://qiaokun.yuepong.com/logo.png',
          systemName: '深圳市优讯龙腾科技有限公司',
          tagline: '做一个有幸福感的企业'
        }
      }
    }
  }
}
