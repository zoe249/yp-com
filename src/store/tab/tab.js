export default {
  state: {
    isCollapse: false,
    currentMenu: {}, // 左侧选择当前的路由
    tabList: [
      {
        permissionkey: 'home',
        url: 'home',
        name: '首页',
        logo: 'iconfont icon-shouye'
      }
    ] // tabs列表
  },
  mutations: {
    // 根据左侧导航栏设置tabList的值
    selectMenu(state, val) {
      if (val.url !== 'home') {
        state.currentMenu = val
        const result = state.tabList.findIndex(item => item.url === val.url)
        if (result === -1) {
          state.tabList.push(val)
        }
      } else {
        state.currentMenu = null
      }
    },
    // 关闭tab方法
    closeTab(state, val) {
      const result = state.tabList.findIndex(item => item.url === val.url)
      state.tabList.splice(result, 1)
    },
    // 关不tabs所有的方法或者关闭其他
    colseAllTab(state, val) {
      if (val === 'closeAll') {
        state.tabList = [
          {
            permissionkey: 'home',
            url: 'home',
            name: '首页',
            logo: 'iconfont icon-shouye'
          }
        ]
      }
    },
    // 刷新页面之后存进来的值
    changeSetTabs(state, val) {
      state.tabList = val
    },
    // 控制关闭/开启折叠左侧导航事件
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse
    }
  },

  actions: {}
}
