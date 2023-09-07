import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入vuex
import store from '../store/index.js'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    meta: {},
    redirect: '/login'
  },
  {
    path: '/login',
    meta: {},
    component: () => import('../views/Login.vue')
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    meta: {},
    component: () => import('../views/ForgetPassword.vue')
  },
  {
    path: '/main',
    meta: {},
    redirect: { name: 'home' },
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {},
        component: () => import('../views/home/home.vue')
      },
      {
        path: '*',
        name: 'notfound',
        meta: {},
        component: () => import('../views/NotFound.vue')
      }
    ]
  }
]
const permissionRule = {
  path: '/permission',
  meta: {},
  name: 'permission',
  component: () => import('../views/permission/permission.vue')
}
const roleRule = {
  path: '/role',
  meta: {},
  name: 'role',
  component: () => import('../views/role/role.vue')
}
const userRule = {
  path: '/user',
  meta: {},
  name: 'user',
  component: () => import('../views/user/user.vue')
}
const dataPermissionRule = {
  path: '/dataPermission',
  meta: {},
  name: 'dataPermission',
  component: () => import('../views/dataPermission/dataPermission.vue')
}
const organizationTypeRule = {
  path: '/organizationType',
  meta: {},
  name: 'organizationType',
  component: () => import('../views/organizationType/organizationType.vue')
}
const organizationRelationRule = {
  path: '/organizationRelation',
  meta: {},
  name: 'organizationRelation',
  component: () => import('../views/organizationRelation/organizationRelation.vue')
}
const organizationManagementRule = {
  path: '/organizationManagement',
  meta: {},
  name: 'organizationManagement',
  component: () => import('../views/organizationManagement/organizationManagement.vue')
}
const channelRule = {
  path: '/channel',
  meta: {},
  name: 'channel',
  component: () => import('../views/channel/channel.vue')
}
const terminalRule = {
  path: '/terminal',
  meta: {},
  name: 'terminal',
  component: () => import('../views/terminal/terminal.vue')
}
const channelTerminalRule = {
  path: '/channelTerminal',
  meta: {},
  name: 'channelTerminal',
  component: () => import('../views/channelTerminal/channelTerminal.vue')
}
const memberListRule = {
  path: '/memberList',
  meta: {},
  name: 'memberList',
  component: () => import('../views/memberList/memberList.vue')
}
const dataDicRule = {
  path: '/dataDic',
  meta: {},
  name: 'dataDic',
  component: () => import('../views/dataDic/dataDic.vue')
}
const codeRuleRule = {
  path: '/codeRule',
  meta: {},
  name: 'codeRule',
  component: () => import('../views/codeRule/codeRule.vue')
}
const platformsRule = {
  path: '/platforms',
  meta: {},
  name: 'platforms',
  component: () => import('../views/platforms/platforms.vue')
}
const memberTagRule = {
  path: '/memberTag',
  meta: {},
  name: 'memberTag',
  component: () => import('../views/memberTag/memberTag.vue')
}
const memberTagMappingRule = {
  path: '/memberTagMapping',
  meta: {},
  name: 'memberTagMapping',
  component: () => import('../views/memberTagMapping/memberTagMapping.vue')
}
const pointTypeRule = {
  path: '/pointType',
  meta: {},
  name: 'pointType',
  component: () => import('../views/pointType/pointType.vue')
}
const pointValidPeriodRule = {
  path: '/pointValidPeriod',
  meta: {},
  name: 'pointValidPeriod',
  component: () => import('../views/pointValidPeriod/pointValidPeriod.vue')
}
const pointListRule = {
  path: '/pointList',
  meta: {},
  name: 'pointList',
  component: () => import('../views/pointList/pointList.vue')
}
const pointEditRule = {
  path: '/pointEdit',
  meta: {},
  name: 'pointEdit',
  component: () => import('../views/pointEdit/pointEdit.vue')
}
const giftCardSchemeRule = {
  path: '/giftCardScheme',
  meta: {},
  name: 'giftCardScheme',
  component: () => import('../views/giftCardScheme/giftCardScheme.vue')
}
const giftCardListRule = {
  path: '/giftCardList',
  meta: {},
  name: 'giftCardList',
  component: () => import('../views/giftCardList/giftCardList.vue')
}
const slideShowRule = {
  path: '/slideShow',
  meta: {},
  name: 'slideShow',
  component: () => import('../views/slideShow/slideShow.vue')
}
const pictureNavigationRule = {
  path: '/pictureNavigation',
  meta: {},
  name: 'pictureNavigation',
  component: () => import('../views/pictureNavigation/pictureNavigation.vue')
}
const testRule = {
  path: '/test',
  meta: {},
  name: 'test',
  component: () => import('../views/test/test.vue')
}
const pointRuleRule = {
  path: '/pointRule',
  meta: {},
  name: 'pointRule',
  component: () => import('../views/pointRule/pointRule.vue')
}
const memberLevelRule = {
  path: '/memberLevel',
  meta: {},
  name: 'memberLevel',
  component: () => import('../views/memberLevel/memberLevel.vue')
}
const growthRuleRule = {
  path: '/growthRule',
  meta: {},
  name: 'growthRule',
  component: () => import('../views/growthRule/growthRule.vue')
}
const growthListRule = {
  path: '/growthList',
  meta: {},
  name: 'growthList',
  component: () => import('../views/growthList/growthList.vue')
}
/**
 * 优惠券信息,券操作记录,订单管理
 * 添加人：wangdandi
 * 添加时间：2021-08-16
 */
const couponInformationRule = {
  path: '/couponInformation',
  meta: {},
  name: 'couponInformation',
  component: () => import('../views/couponInformation/couponInformation.vue')
}
const operationRecordRule = {
  path: '/operationRecord',
  meta: {},
  name: 'operationRecord',
  component: () => import('../views/operationRecord/operationRecord.vue')
}
const orderRule = {
  path: '/order',
  meta: {},
  name: 'order',
  component: () => import('../views/order/order.vue')
}
const messageTemplateRule = {
  path: '/messageTemplate',
  meta: {},
  name: 'messageTemplate',
  component: () => import('../views/messageTemplate/messageTemplate.vue')
}
const couponTemplateRule = {
  path: '/couponTemplate',
  meta: {},
  name: 'couponTemplate',
  component: () => import('../views/couponTemplate/couponTemplate.vue')
}
const saleCouponActivityRule = {
  path: '/saleCouponActivity',
  meta: {},
  name: 'saleCouponActivity',
  component: () => import('../views/saleCouponActivity/saleCouponActivity.vue')
}
const luckDrawRule = {
  path: '/luckDraw',
  meta: {},
  name: 'luckDraw',
  component: () => import('../views/luckDraw/luckDraw.vue')
}
const dailyAttendanceRule = {
  path: '/dailyAttendance',
  meta: {},
  name: 'dailyAttendance',
  component: () => import('../views/dailyAttendance/dailyAttendance.vue')
}
const dailyAttendanceListRule = {
  path: '/dailyAttendanceList',
  meta: {},
  name: 'dailyAttendanceList',
  component: () => import('../views/dailyAttendanceList/dailyAttendanceList.vue')
}
const savingsActivityRule = {
  path: '/savingsActivity',
  meta: {},
  name: 'savingsActivity',
  component: () => import('../views/savingsActivity/savingsActivity.vue')
}
const savingsListRule = {
  path: '/savingsList',
  meta: {},
  name: 'savingsList',
  component: () => import('../views/savingsList/savingsList.vue')
}
const payMemberListRule = {
  path: '/payMemberList',
  meta: {},
  name: 'payMemberList',
  component: () => import('../views/payMemberList/index.vue')
}
const buyMemberRecord = {
  path: '/buyMemberRecord',
  meta: {},
  name: 'buyMemberRecord',
  component: () => import('../views/buyMemberRecord/index.vue')
}
const agreementList = {
  path: '/agreementList',
  meta: {},
  name: 'agreementList',
  component: () => import('../views/agreementList/index.vue')
}
const giftCardSell = {
  path: '/giftCardSell',
  meta: {},
  name: 'giftCardSell',
  component: () => import('../views/giftCardSell/index.vue')
}
// 定义路由规则和字符串的映射关系
const ruleMapping = {
  permission: permissionRule,
  role: roleRule,
  user: userRule,
  dataPermission: dataPermissionRule,
  organizationType: organizationTypeRule,
  organizationRelation: organizationRelationRule,
  organizationManagement: organizationManagementRule,
  channel: channelRule,
  terminal: terminalRule,
  channelTerminal: channelTerminalRule,
  memberList: memberListRule,
  dataDic: dataDicRule,
  codeRule: codeRuleRule,
  platforms: platformsRule,
  memberTag: memberTagRule,
  memberTagMapping: memberTagMappingRule,
  pointType: pointTypeRule,
  pointValidPeriod: pointValidPeriodRule,
  pointList: pointListRule,
  pointEdit: pointEditRule,
  giftCardScheme: giftCardSchemeRule,
  giftCardList: giftCardListRule,
  slideShow: slideShowRule,
  pictureNavigation: pictureNavigationRule,
  test: testRule,
  pointRule: pointRuleRule,
  memberLevel: memberLevelRule,
  growthRule: growthRuleRule,
  growthList: growthListRule,
  couponInformation: couponInformationRule,
  operationRecord: operationRecordRule,
  order: orderRule,
  messageTemplate: messageTemplateRule,
  couponTemplate: couponTemplateRule,
  saleCouponActivity: saleCouponActivityRule,
  luckDraw: luckDrawRule,
  dailyAttendance: dailyAttendanceRule,
  dailyAttendanceList: dailyAttendanceListRule,
  savingsActivity: savingsActivityRule,
  savingsList: savingsListRule,
  payMemberList: payMemberListRule,
  buyMemberRecord: buyMemberRecord,
  agreementList: agreementList,
  giftCardSell: giftCardSell
}
const router = new VueRouter({
  // base: process.env.BASE_URL,
  routes
})
// 设置路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/forgetPassword') {
    next()
  } else {
    const token = window.sessionStorage.getItem('token')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})

export function initDynamicRoutes() {
  // 根据二级权限，对路由规则进行动态的添加
  const currentRoutes = router.options.routes
  const rightList = store.state.aside.rightList
  rightList.forEach(item => {
    item.permissions.forEach(item => {
      // item 就是二级菜单
      var temp = ruleMapping[item.url]
      if (temp) {
        temp.meta.rights = item.permissions
      } else {
        // 20210104 by qiaokun 特殊处理 如果匹配不到路由则给返回的url默认为notfound
        item.url = 'notfound'
        temp = {
          path: '/notfound',
          meta: { rights: [] },
          name: 'notfound',
          component: () => import('../views/NotFound.vue')
        }
      }
      // 为什么是[3]?因为打印出来的路由main为3
      currentRoutes[3].children.push(temp)
    })
  })
  // 存储数据进入vuex
  // store.commit('setRightList', rightList)
  router.addRoutes(currentRoutes)
}
export default router
