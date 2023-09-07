/*
 * @Author: your name
 * @Date: 2020-12-22 13:42:57
 * @LastEditTime: 2020-12-23 14:14:52
 * @LastEditors: Please set LastEditors
 * @description: I'm tired.こんにちは
 * @FilePath: \celesta-web-project\src\mock\member\memberLabel.js
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
            id: '0102',
            parentId: '01',
            name: '生命周期',
            level: 1,
            description: 'encounter',
            handmade: false,
            icon: 'userpermission',
            type: '2',
            url: 'userpermission',
            permissions: [
              {
                // 二级菜单
                id: '010201',
                parentId: '0102',
                name: '会员生命周期',
                level: 2,
                description: 'similar',
                handmade: true,
                icon: 'permission',
                type: '2',
                url: 'permission',
                permissions: [
                  {
                    // 按钮
                    id: '01020101',
                    parentId: '010201',
                    name: '潜在用户',
                    level: 3,
                    description: 'ddlikeme',
                    handmade: true,
                    icon: 'add',
                    type: '3',
                    url: 'add'
                  },
                  {
                    // 按钮
                    id: '01020102',
                    parentId: '010201',
                    name: '新生用户',
                    level: 3,
                    description: 'gglikehe',
                    handmade: true,
                    icon: 'add',
                    type: '3',
                    url: 'add'
                  }
                ]
              },
              {
                // 二级菜单
                id: '010202',
                parentId: '0102',
                name: '行为偏好',
                level: 2,
                description: 'half-life',
                handmade: false,
                icon: 'role',
                type: '2',
                url: 'role',
                permissions: [
                  {
                    // 按钮
                    id: '01020201',
                    parentId: '010201',
                    name: '打排球',
                    level: 3,
                    description: 'heartache',
                    handmade: true,
                    icon: 'add',
                    type: '3',
                    url: 'add'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}
