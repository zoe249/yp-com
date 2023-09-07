/*
 * @Author: your name
 * @Date: 2020-12-03 09:37:45
 * @LastEditTime: 2020-12-17 11:17:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \crm-mvp-system-web\src\mock\user\user.js
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
            id: 1,
            code: '20180102133',
            realName: '王小虎',
            organizationCode: '上海市普陀区金沙江路 1518 弄',
            email: '1103145646',
            password: '123456',
            roleId: '1',
            nickName: '烦躁人',
            sex: '男',
            avatar: '我是图片',
            phone: '15965890771',
            firstLoginAt: '2020-12-01',
            lastLofinAt: '2020-12-02',
            status: true
          },
          {
            id: 2,
            code: '20180102144',
            realName: '王小龙',
            organizationCode: '上海市普陀区金沙江路 1433 弄',
            password: '123456',
            email: '391879465',
            roleId: '2',
            nickName: '雄赳赳 气昂昂',
            sex: '女',
            avatar: '我是图片',
            phone: '15965890771',
            firstLoginAt: '2020-12-01',
            lastLofinAt: '2020-12-02',
            status: false
          },
          {
            id: 3,
            code: '20180102155',
            realName: '王小蛇',
            organizationCode: '上海市普陀区金沙江路 223 弄',
            password: '123456',
            email: '2713702727',
            roleId: '3',
            nickName: '灰色空间',
            sex: '男',
            avatar: '我是图片',
            phone: '15965890771',
            firstLoginAt: '2020-12-01',
            lastLofinAt: '2020-12-02',
            status: true
          }
        ]
      }
    }
  },
  getCurrentUser: () => {
    return {
      code: 2000,
      data: {
        username: '李铁钢',
        avatar: 'http://qiaokun.yuepong.com/admin-logo.jpg'
      }
    }
  }
}
