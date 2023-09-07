// 导入mockjs 使用数据
// import Mock from 'mockjs'
export default {
  getRoleList: () => {
    return {
      code: 2000,
      data: {
        data: [
          { id: '001', name: '企业管理员', description: '负责企业后台运营管理员' },
          { id: '002', name: '运营管理员', description: '负责门店经营管理员' },
          { id: '003', name: '客服人员', description: '负责客服服务' },
          { id: '004', name: '测试企业管理员', description: '测试企业管理员' },
          { id: '005', name: '测试运营管理员', description: '测试负责门店经营管理员' },
          { id: '006', name: '测试客服人员', description: '测试负责客服服务' }
        ]
      }
    }
  },
  getRoleById: () => {
    return {
      code: 2000,
      data: {
        data: {
          id: '001',
          name: '企业管理员',
          description: '负责企业后台运营管理员',
          permissionIds: ['01', '0102', '010201', '01020101', '010202']
        }
      }
    }
  }
}
