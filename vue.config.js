/**
 * vue config 配置
 */
module.exports = {
  // lintOnSave: true,
  // publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 正式环境
  publicPath: process.env.NODE_ENV === 'production' ? '././' : '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/scss/_variable.scss";'
      },
      postcss: {
        plugins: [
          require('postcss-px2rem')({ remUnit: 192 }) // 换算的基数
        ]
      }
    }
  },
  devServer: {
    port: 8082, // 端口号
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    disableHostCheck: true,
    proxy: {
      '/com': {
        target: 'https://test.yuepong.cn/',
        changeOrigin: true,
        secure: false,
        headers: {
          Authorization: 'bearer 4Bke4q3XpyrmS3egQWBJE9YkXF/UEWaObOgCWxl/Quc=' // 用法： 登录 https://dev.yuepong.cn/com/#/login, 获取sessionStorage的token， 复制到proxy的header中，yarn serve启动
        }
      }
    }
  }
}
