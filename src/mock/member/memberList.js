// 导入mockjs 使用数据
// import Mock from 'mockjs'
var memberList = {
  pageIndex: 1,
  pageSize: 2,
  total: 2,
  data: [
    {
      id: '123',
      cardNumber: '123',
      status: false,
      cardlevelCode: '01',
      cardlevelName: '黄金会员',
      cardlevelTime: '2020-01-01',
      nickname: '昵称',
      realName: '真实姓名',
      gender: '1',
      phone: '17802925394',
      registrationdate: '2020-12-21',
      memberTagName: '高富帅'
    },
    {
      id: '456',
      cardNumber: '456',
      status: true,
      cardlevelCode: '01',
      cardlevelName: '黄金会员',
      cardlevelTime: '2020-01-01',
      nickname: '昵称2',
      realName: '真实姓名2',
      gender: '2',
      phone: '17802925394',
      registrationdate: '2020-12-21',
      memberTagName: '白富美'
    }
  ]
}
export default {
  getMemberList: () => {
    return memberList
  }
}
