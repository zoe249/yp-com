// 导入mockjs 使用数据
// import Mock from 'mockjs'
export default {
  getmembers: () => {
    return {
      code: 2000,
      data: {
        data: [
          { id: '001', month: '1月', addMember: 1, addIntegral: 2, getCoupons: 221, registerUser: 431 },
          { id: '002', month: '2月', addMember: 2, addIntegral: 4, getCoupons: 222, registerUser: 530 },
          { id: '003', month: '3月', addMember: 3, addIntegral: 6, getCoupons: 223, registerUser: 630 },
          { id: '004', month: '4月', addMember: 4, addIntegral: 3, getCoupons: 221, registerUser: 431 },
          { id: '005', month: '5月', addMember: 5, addIntegral: 2, getCoupons: 222, registerUser: 530 },
          { id: '006', month: '6月', addMember: 6, addIntegral: 1, getCoupons: 223, registerUser: 630 }
        ]
      }
    }
  }
}
