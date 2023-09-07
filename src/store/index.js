import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab/tab'
import header from './header/header'
import aside from './aside/aside'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    tab,
    header,
    aside
  }
})
