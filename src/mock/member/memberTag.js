/*
 * @Author: peng hui
 * @Date: 2020-12-21 16:36:18
 * @LastEditTime: 2021-01-05 11:30:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\mock\member\memberingRules.js
 */
export default {
  getmembers: () => {
    return {
      code: 2000,
      data: {
        // 表格数据
        data: [
          {
            id: 1,
            name: '生命周期',
            description: '上海市普陀区金沙江路 1518 弄',
            level: 1,
            handmade: true,
            icon: '../../assets/images/admin-logo.jpg',
            children: [
              {
                id: 2,
                name: '新增会员',
                description: '上海市普陀区金沙江路 1519 弄',
                level: 2,
                handmade: true,
                icon: '../../assets/images/admin-logo.jpg',
                children: [
                  {
                    id: 3,
                    name: '新增会员',
                    description: '上海市普陀区金沙江路 1519 弄',
                    level: 3,
                    handmade: true,
                    icon: '../../assets/images/admin-logo.jpg'
                  },
                  {
                    id: 4,
                    name: '真实会员',
                    description: '上海市普陀区金沙江路 1519 弄',
                    level: 3,
                    handmade: false,
                    icon: '../../assets/images/admin-logo.jpg'
                  }
                ]
              }
            ]
          },
          {
            id: 5,
            name: '会员生命后期',
            description: '上海市普陀区金沙江路 1517 弄',
            level: 1,
            handmade: false,
            icon: '../../assets/images/admin-logo.jpg'
          },
          {
            id: 6,
            name: '原生会员',
            description: '上海市普陀区金沙江路 1519 弄',
            level: 1,
            handmade: true,
            icon: '../../assets/images/admin-logo.jpg'
          }
        ]
      }
    }
  }
}
