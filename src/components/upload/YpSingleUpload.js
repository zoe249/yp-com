/*
 * @Description: 功能描述
 * @Version: 1.5.1
 * @Author: Yuchuan
 * @Date: 2020-11-10 09:27:15
 */
var imgInfo = [
  {
    utype: 'userAvatar',
    message: '头像：建议不超过120像素*120像素，大小500kb内，正方形，jpg、jpeg或png格式',
    imgSize: 500,
    width: 120,
    height: 120,
    heightUse: '120px',
    widthUse: '120px',
    imgUpload: {
      width: '100%',
      height: '100%',
      borderRadius: '100%'
    }
  }, // 后台用户管理，用户头像
  {
    utype: 'memberAvatar',
    message: '',
    imgSize: 500,
    width: 120,
    height: 120,
    heightUse: '80px',
    widthUse: '80px',
    imgUpload: {
      width: '100%',
      height: '100%',
      borderRadius: '100%'
    }
  }, // 会员头像
  {
    utype: 'memberTag',
    message: '标签：建议不超过80像素*80像素，大小500kb内，正方形，jpg、jpeg或png格式',
    imgSize: 500,
    width: 80,
    height: 80,
    heightUse: '80px',
    widthUse: '80px',
    imgUpload: {
      width: '100%',
      height: '100%'
    }
  }, // 会员标签
  {
    utype: 'platformLogo',
    message: 'logo： 建议不超过110像素*75像素，大小500kb内，长方形，jpg、jpeg或png格式 ',
    imgSize: 500,
    width: 110,
    height: 75,
    heightUse: '75px',
    widthUse: '110px',
    imgUpload: {
      width: '100%',
      height: '100%'
    }
  }, // 平台企业logo
  {
    utype: 'giftCardLogo',
    message: '卡logo： 建议不超过60像素*60像素，大小500kb内，正方形，jpg、jpeg或png格式 ',
    imgSize: 500,
    width: 60,
    height: 60,
    heightUse: '60px',
    widthUse: '60px',
    imgUpload: {
      width: '100%',
      height: '100%'
    }
  }, // 礼品卡logo
  {
    utype: 'giftCardBackground',
    message: '卡封面： 建议不超过710像素*398像素，大小500kb内，长方形，jpg、jpeg或png格式 ',
    imgSize: 500,
    width: 710,
    height: 398,
    heightUse: '199px',
    widthUse: '355px',
    imgUpload: {
      width: '100%',
      height: '100%'
    }
  }, // 礼品卡封面
  {
    utype: 'homePoster',
    message: '首页海报： 建议不超过500像素*800像素，大小500kb内，长方形，jpg、jpeg或png格式 ',
    imgSize: 500,
    width: 500,
    height: 800,
    heightUse: '400px',
    widthUse: '250px',
    imgUpload: {
      width: '100%',
      height: '100%'
    }
  }, // 首页弹出广告
  {
    utype: 'homeBanner',
    message: '首页轮播： 建议不超过710像素*350像素，大小500kb内，长方形，jpg、jpeg或png格式 ',
    imgSize: 500,
    width: 710,
    height: 350,
    heightUse: '175px',
    widthUse: '355px',
    imgUpload: {
      width: '100%',
      height: '100%'
    }
  }, // 首页轮播
  {
    utype: 'pictureNavigation',
    message: '',
    imgSize: 500,
    width: 240,
    height: 240,
    heightUse: '30px',
    widthUse: '80px',
    imgUpload: {
      width: '100%',
      height: '100%'
    }
  }, // 图片导航
  {
    utype: 'prizeImg',
    message: '',
    imgSize: 500,
    width: 240,
    height: 240,
    heightUse: '60px',
    widthUse: '60px',
    imgUpload: {
      width: '100%',
      height: '100%'
    }
  }
]
export default {
  imgInfo
}
