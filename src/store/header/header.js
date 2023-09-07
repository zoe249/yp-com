export default {
  state: {
    lang: '中文', // 全局语言
    themeColor: sessionStorage.getItem('currentThemColor') || '#409EFF' // 全局颜色
    // currentUser: {}
  },
  mutations: {
    // 刷新页面之后存进来的值
    changeLang(state, val) {
      if (val === 'zh-CN') state.lang = '中文'
      if (val === 'en-US') state.lang = 'EngLish'
    },
    // 存储主题色
    changeThemecolor(state, val) {
      if (val) {
        state.themeColor = val
        sessionStorage.setItem('currentThemColor', val)
      }
    }
    // 存储当前用户信息
    // setCurrentUser(state, val) {
    //   state.currentUser = val
    //   console.log('触发了方法付')
    //   console.log(state.currentUser)
    // }
  },

  actions: {}
}
