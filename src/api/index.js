// 请求接口的统一出入口
// 获取七牛token值
import getQiniuToken from './upload/getapi'
// 用户认证接口
import postOauthApi from './oauth/postapi'
import getOauthApi from './oauth/getapi'
// 从各个模块中导入
import getUserApi from './user/getapi'
import postUserApi from './user/postapi'
import putUserApi from './user/putapi'
// 组织类型
import getOrganizationTypeApi from './organizationType/getapi'
import postOrganizationTypeApi from './organizationType/postapi'
import putOrganizationTypeApi from './organizationType/putapi'
import deleteOrganizationTypeApi from './organizationType/deleteapi'
// 组织关系
import getOrganizationRelationApi from './organizationRelation/getapi'
import postOrganizationRelationApi from './organizationRelation/postapi'
import putOrganizationRelationApi from './organizationRelation/putapi'
import deleteOrganizationRelationApi from './organizationRelation/deleteapi'
// 首页模块
import getHomeApi from './home/getapi.js'
// 菜单管理
import getPermissionApi from './permission/getapi'
import postPermissionApi from './permission/postapi'
import putPermissionApi from './permission/putapi'
import deletePermissionApi from './permission/deleteapi'
// 角色管理
import getRoleApi from './role/getapi'
import postRoleApi from './role/postapi'
import putRoleApi from './role/putapi'
import deleteRoleApi from './role/deleteapi'
// 渠道配置
import getChannelApi from './channel/getapi'
import postChannelApi from './channel/postapi'
import putChannelApi from './channel/putapi'
// 终端配置
import getTerminalApi from './terminal/getapi'
import postTerminalApi from './terminal/postapi'
import putTerminalApi from './terminal/putapi'
// 渠道与终端关系
import getChannelTerminalApi from './channelTerminal/getapi'
import postChannelTerminalApi from './channelTerminal/postapi'
import putChannelTerminalApi from './channelTerminal/putapi'
// 组织管理
import getOrganizationManagementApi from './organizationManagement/getapi'
import postOrganizationManagementApi from './organizationManagement/postapi'
import putOrganizationManagementApi from './organizationManagement/putapi'
import deleteOrganizationManagementApi from './organizationManagement/deleteapi'
// 数据权限
import getDataPermissionApi from './dataPermission/getapi'
import postDataPermissionApi from './dataPermission/postapi'
import putDataPermissionApi from './dataPermission/putapi'
import deleteDataPermissionApi from './dataPermission/deleteapi'
// 编号规则
import getcodeRulesApi from './codeRules/getapi'
import putcodeRulesApi from './codeRules/putapi'
import postcodeRulesApi from './codeRules/postapi'
// 会员标签
import getMemberLabelApi from './memberLabel/getapi'
import putMemberLabelApi from './memberLabel/putapi'
import postMemberLabelApi from './memberLabel/postapi'
import deleteMemberLabelApi from './memberLabel/deleteapi'
// 会员标签（新）
import getMemberTagApi from './memberTag/getapi'
import deleteMemberTagApi from './memberTag/deleteapi'
import postMemberTagApi from './memberTag/postapi'
import putMemberTagApi from './memberTag/putapi'
// 数据字典
import getDataDicApi from './dataDic/getapi'
import postDataDicApi from './dataDic/postapi'
import putDataDicApi from './dataDic/putapi'
// 协议关丽丽
import getAgreementApi from './agreement/getapi'
import postAgreementApi from './agreement/postapi'
import putAgreementApi from './agreement/putapi'
// 会员列表
import getMemberApi from './member/getapi'
import postMemberApi from './member/postapi'
import putMemberApi from './member/putapi'

// 平台
import getPlatformsApi from './platforms/getapi'
import putPlatformsApi from './platforms/putapi'

// 会员打标签
import getMemberTagMappingApi from './memberTagMapping/getapi'

// 地址
import getAddressApi from './address/getapi'

// 积分种类型
import getPointTypeApi from './pointType/getapi'
import postPointTypeApi from './pointType/postapi'
import putPointTypeApi from './pointType/putapi'

// 积分有效期
import getPointValidPeriodApi from './pointValidPeriod/getapi'
import postPointValidPeriodApi from './pointValidPeriod/postapi'
import putPointValidPeriodApi from './pointValidPeriod/putapi'

// 积分明细
import getPointListApi from './pointList/getapi'

// 礼品卡方案
import getGiftCardSchemeApi from './giftCardScheme/getapi'
import postGiftCardSchemeApi from './giftCardScheme/postapi'
import putGiftCardSchemeApi from './giftCardScheme/putapi'

// 礼品卡列表
import getGiftListApi from './giftList/getapi'

// 广告管理
import getSlideShowApi from './slideShow/getapi'
import postSlideShowApi from './slideShow/postapi'
import putSlideShowApi from './slideShow/putapi'
import deleteSlideShowApi from './slideShow/deleteapi'

// 图片导航
import getPictureNavigationApi from './pictureNavigation/getapi'
import postPictureNavigationApi from './pictureNavigation/postapi'
import putPictureNavigationApi from './pictureNavigation/putapi'
// 积分规则
import getPointRuleApi from './pointRule/getapi'
import postPointRuleApi from './pointRule/postapi'
import putPointRuleApi from './pointRule/putapi'
// 付费会员
import getPayMemberApi from './payMemberList/getapi'
import postPayMemberApi from './payMemberList/postapi'
import putPayMemberApi from './payMemberList/putapi'
// 会员等级
import getMemberLevelApi from './memberLevel/getapi'
import postMemberLevelApi from './memberLevel/postapi'
import putMemberLevelApi from './memberLevel/putapi'
// 会员成长值规则
import getGrowthRuleApi from './growthRule/getapi'
import postGrowthRuleApi from './growthRule/postapi'
import putGrowthRuleApi from './growthRule/putapi'
// 会员成长值明细
import getGrowthListApi from './growthList/getapi'
// 优惠券
import getCouponInfo from './couponInfor/getapi'
import postApi from './couponInfor/postapi'
// 订单管理
import getOrderApi from './order/getaip'
// 消息模板设置
import getMessageTemplateApi from './messageTemplate/getapi'
import putMessageTemplateApi from './messageTemplate/putapi'
import postMessageTemplateApi from './messageTemplate/postapi'
// 优惠券模板
import getCouponTemplateApi from './couponTemplate/getapi'
import postCouponTemplateApi from './couponTemplate/postapi'
import putCouponTemplateApi from './couponTemplate/putapi'
// 优惠券活动
import getSaleCouponActivityApi from './saleCouponActivity/getapi'
import postSaleCouponActivityApi from './saleCouponActivity/postapi'
import putSaleCouponActivityApi from './saleCouponActivity/putapi'
// 幸运抽奖
import getLuckDrawApi from './luckdraw/getapi'
import putLuckDrawApi from './luckdraw/putapi'
import postLusckDrawApi from './luckdraw/postapi'
// 充值活动
import getActivityApi from './savingsActivity/getapi'
import putActivityApi from './savingsActivity/putapi'
import postActivityApi from './savingsActivity/postapi'
// 积分调整
import getPointEditApi from './pointEdit/getapi'
import postPointEditApi from './pointEdit/postapi'

// 礼品卡发售
import getGiftCardSellApi from './giftCardSell/getapi'
import postGiftCardSellApi from './giftCardSell/postapi'
import putGiftCardSellApi from './giftCardSell/putapi'

export default {
  getAgreementApi,
  postAgreementApi,
  putAgreementApi,
  getPayMemberApi,
  postPayMemberApi,
  putPayMemberApi,
  getQiniuToken,
  postOauthApi,
  getOauthApi,
  getUserApi,
  postUserApi,
  putUserApi,
  getHomeApi,
  getPermissionApi,
  postPermissionApi,
  putPermissionApi,
  deletePermissionApi,
  getRoleApi,
  postRoleApi,
  putRoleApi,
  deleteRoleApi,
  getOrganizationTypeApi,
  postOrganizationTypeApi,
  putOrganizationTypeApi,
  deleteOrganizationTypeApi,
  getOrganizationRelationApi,
  postOrganizationRelationApi,
  putOrganizationRelationApi,
  deleteOrganizationRelationApi,
  getChannelApi,
  postChannelApi,
  putChannelApi,
  getTerminalApi,
  postTerminalApi,
  putTerminalApi,
  getChannelTerminalApi,
  postChannelTerminalApi,
  putChannelTerminalApi,
  getOrganizationManagementApi,
  postOrganizationManagementApi,
  putOrganizationManagementApi,
  deleteOrganizationManagementApi,
  getDataPermissionApi,
  postDataPermissionApi,
  putDataPermissionApi,
  deleteDataPermissionApi,
  getcodeRulesApi,
  putcodeRulesApi,
  postcodeRulesApi,
  getMemberLabelApi,
  putMemberLabelApi,
  postMemberLabelApi,
  deleteMemberLabelApi,
  getDataDicApi,
  postDataDicApi,
  putDataDicApi,
  getMemberTagApi,
  deleteMemberTagApi,
  postMemberTagApi,
  putMemberTagApi,
  getMemberApi,
  postMemberApi,
  putMemberApi,
  getPlatformsApi,
  putPlatformsApi,
  getMemberTagMappingApi,
  getAddressApi,
  getPointTypeApi,
  postPointTypeApi,
  putPointTypeApi,
  getPointValidPeriodApi,
  postPointValidPeriodApi,
  putPointValidPeriodApi,
  getPointListApi,
  getGiftCardSchemeApi,
  postGiftCardSchemeApi,
  putGiftCardSchemeApi,
  getGiftListApi,
  getSlideShowApi,
  postSlideShowApi,
  putSlideShowApi,
  deleteSlideShowApi,
  getPictureNavigationApi,
  postPictureNavigationApi,
  putPictureNavigationApi,
  getPointRuleApi,
  postPointRuleApi,
  putPointRuleApi,
  getMemberLevelApi,
  postMemberLevelApi,
  putMemberLevelApi,
  getGrowthRuleApi,
  postGrowthRuleApi,
  putGrowthRuleApi,
  getGrowthListApi,
  getCouponInfo,
  postApi,
  getOrderApi,
  getMessageTemplateApi,
  putMessageTemplateApi,
  postMessageTemplateApi,
  getCouponTemplateApi,
  postCouponTemplateApi,
  putCouponTemplateApi,
  getSaleCouponActivityApi,
  postSaleCouponActivityApi,
  putSaleCouponActivityApi,
  getLuckDrawApi,
  putLuckDrawApi,
  postLusckDrawApi,
  getActivityApi,
  postActivityApi,
  putActivityApi,
  getPointEditApi,
  postPointEditApi,
  getGiftCardSellApi,
  postGiftCardSellApi,
  putGiftCardSellApi
}
