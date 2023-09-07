// 导入mockjs 使用数据
// import Mock from 'mockjs'
var dataDicList = {
  pageIndex: 1,
  pageSize: 2,
  total: 2,
  data: [
    { id: '123', code: '123', name: '会员等级', diy: false },
    { id: '456', code: '456', name: '所属地址', diy: true }
  ]
}
var dataDicItemList = [
  { ddCode: '123', id: '123123', code: '123123', name: '普通会员', status: true },
  { ddCode: '123', id: '456456', code: '456456', name: '黄金会员', status: false }
]
export default {
  getDataDicList: () => {
    return dataDicList
  },
  getDataDicItemList: () => {
    return dataDicItemList
  }
}
