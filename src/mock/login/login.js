// 导入mockjs 使用数据
// import Mock from 'mockjs'
export default {
  loginInfo: () => {
    return {
      code: 2000,
      data: {
        message: 'success',
        token: 'xx1234456789xx'
      }
    }
  }
}
