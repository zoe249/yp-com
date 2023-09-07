# celesta-web-project
## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### 版本说明 v2.0.3

#### 1、会员等级

     1)新增会员等级页面

#### 2、会员成长规则

     1)新增会员成长规则页面

##### 3、会员成长明细

     1)新增会员成长明细页面

#### 4、会员列表

     1)字段“会员等级”取会员等级菜单中自定义的会员等级，初始等级为01-普通会员，跟随成长值的变化展示会员等级

### 修改转发(20220727)
1. vue.config增加proxy转发代理 ， 代理地址为'http://dev.yuepong.cn/'

   用法： 登录 https://dev.yuepong.cn/com/#/login, 获取sessionStorage的token， 复制到proxy的header中，yarn serve启动

2. http.js增加baseURL 判断接口前缀 ，不需要考虑域名，除了haunghe和已有的dev， test环境外 ，其他均为/com/api-gateway,
 请求地址为 `当前网站域名 + 接口前缀`
后缀开发和上线不需要来回切换请求地址， 一个dist就可（如果还有前缀不一致再单独考虑）



