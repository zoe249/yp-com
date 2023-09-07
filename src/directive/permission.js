import Vue from 'vue'
import router from '../router/index'
Vue.directive('permission', {
  inserted(el, binding) {
    const action = binding.value.action
    const effect = binding.value.effect
    // 判断在当前的路由所对应的组件中，如何判断用户是否具备action的权限
    if (router.currentRoute.meta.rights.indexOf(action) === -1) {
      if (effect === 'disabled') {
        el.disabled = true
        el.classList.add('is-disabled')
      } else {
        el.parentNode.removeChild(el)
      }
    }
  }
})
