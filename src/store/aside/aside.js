export default {
  state: {
    rightList: JSON.parse(sessionStorage.getItem('rightList') || '[]')
  },
  mutations: {
    // 设置用户权限的值
    setRightList(state, data) {
      state.rightList = data
      sessionStorage.setItem('rightList', JSON.stringify(data))
    }
  },

  actions: {}
}
