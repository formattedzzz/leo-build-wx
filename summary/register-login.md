
### 个人小程序的完美（注册）登录流程应该怎么做

因为很多业务需求 我们开发的小程序必须做到任何用户在任何情况下打开小程序都要能获取登录态
本文示例环境为小程序前端 mpvue 小程序后端 node + jwt
首先我们从最原始的流程开始：
- 新用户进入小程序--->出现主动引导 open-type="getUserInfo" 的button。
- 用户点击 button 弹出授权，触发onGotUserInfo函数，检查用户的授权结果 授权失败的请况依据用户需求而定，一般来说button不应该消失强制用户授权。用户授权之后我们就拿到了用户信息的加密数据encryptedData、加密初始向量iv以及签名signature。
- 之后就可以调用wx.login()获取code（这里没有必要checkSession，见后文）。
- wx.login()是百分百成功的。到了这里我们就拿到了所有东西，可以愉快的走业务API了。
- 后端部分：通过官方接口jscode2session获取session_key, openid。通过appid, session_key解密出encryptedData。OK 到此我们确保拿到真实的用户信息及唯一标示openid。
- 根据openid 查询用户表。没有添加新用户有则更新用户资料。用jsonwebtoken对openid进行签名并最终返回前端，前端存取token。
- 用户再次发起请求的时候把token附带到header。服务端对需要辨识用户唯一性的业务API设置中间件解密token拿到openid。

OK 到这里最理想的情况已经走通了。但是还有很多其他情况需要处理
- 1、如果用户重装了微信或者换了手机登录微信怎么处理？这里我把登录框做成单纯的组件嵌入需要的页面。在组件onload时都去检查有缓存没有token。没有则显示登录框，重走上述流程。这里我们只需要检查token，不需要checkSession是否失效，而且sessionKey的失效时间开发者并不知道，其作用就一个：解密用户信息。
应用jwt就不需要另外建立第三方sessionid。在后端分布式架构中也不需要迁移session表，不同集群共享一张用户表即可

- 2、服务端签发的token有可能会失效。我们也需要处理这种请况（尽管这种可能性很低）。我们在中间件解密token失败时（或者根本就没有附带token）中间件用改放回固定状态码（如data.code: -1）告知登陆态失效需要重新登录。前端收到后清除本地token并显示登录框。

- 3、摒弃中心状态机。利用发布订阅模式让注册登录和业务逻辑代码变得更加的健壮。
通过登录框组件形式嵌入页面的话 每个登录框各自维护一份状态。任何一个登录框完成了登录流程都应该及时告知其他登录框，同时建立全局登录态标志。因为mpvue框架打包采用的是一个vue实例驱动一个page。所以要保证每个页面实例都能访问到可以把 一个eventBus实例挂载到Vue.prototype上。通过核心API完成通讯

```js
this.eventBus.$emit('eventName', data)
this.eventBus.$on('eventName', (data) => { 
  // handling ...
})
```

还有很多时候，比如邀请新用户加入业务。那么基本上所有业务都需要建立在新用户已经有登录态的情况下进行。怎么处理分享出去的页面路径、参数在登录完成之后进行相关操作。这里需要在分享出去的页面先把参数存取来，检查有无token，如果登录态正常执行正常处理函数，否则监听一下登录完成发出的事件来执行该函数。

```js
onLoad () {
  if (wx.getStorageSync('token')) {
    this.handleSomething()
  } else {
    this.eventBus.$on('loginCompelete', () => {
      this.handleSomething()
    })
  }
}
```

挂载eventBus 并对wx.request() API 进行简单封装

```js
Vue.prototype.eventBus = new Event()
//Vue.prototype.$store = store
Vue.prototype.req = function (config) {
  return new Promise((resolve, reject) => {
    let base = baseURL
    wx.request({
      url: base + config.url,
      data: config.data,
      method: config.method || 'GET',
      header: {
        // 附带token请求头
        token: wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.statusCode === 500 || res.statusCode === 404) {
          wx.showToast({
            title: `err: ${res.statusCode}`,
            icon: 'none'
          })
          reject(new Error(`err: ${res.statusCode}`))
          return
        }
        if (res.data.code === -1) {
          // 任何API如果返回 code===-1 则标示需要重新登录 清除旧token并唤起登录框
          wx.clearStorageSync()
          Vue.prototype.eventBus.$emit('revokeLogin', true)
        }
        config.success && config.success(res)
        resolve(res)
      },
      fail: function (res) {
        if (config.fail) {
          config.fail(res)
          reject(res)
        } else {
          wx.showToast({
            title: '网络好像不太好诶',
            icon: 'none'
          })
          reject(new Error('网络好像不太好诶'))
        }
      },
      complete: function () {
        config.complete && config.complete()
      }
    })
  })
}
```

前端登录代码

```js
onGotUserInfo (e) {
  // 对点击操作截流
  if (this.logining === true) {
    return
  }
  // 强制授权 不然没法玩
  if (e.target.errMsg === 'getUserInfo:fail auth deny') {
    wx.showToast({
      title: '请授权 爽快点',
      icon: 'none'
    })
    return
  }
  wx.showLoading({
    title: '登录ing..'
  })
  // 可以先存取一份用户信息到本地
  wx.setStorageSync('userInfo', e.target.userInfo)
  // 有的页面需要更新用户资料
  this.eventBus.$emit('updateUserInfo', true)
  let { encryptedData, iv, signature } = e.target
  wx.login({
    success: (res) => {
      this.req({
        url: '/wx/login',
        data: {
          code: res.code,
          encryptedData,
          iv,
          signature
        },
        method: 'POST'
      }).then((res) => {
        let data = res.data
        if (data.code) {
          // 登录成功缓存token
          wx.setStorageSync('token', data.token)
          wx.showToast({
            title: data.message
          })
          // 触发全局完成登录事件 告知很多地方 你可以进行业务逻辑了
          this.eventBus.$emit('hideLogin', true)
          this.show = false
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        wx.hideLoading()
        this.logining = false
      }).catch((err) => {
        wx.showToast({
          title: err,
          icon: 'none'
        })
        wx.hideLoading()
        this.logining = false
      })
    }
  })
}
```

后端代码 设置获取openid中间件

```js
let express = require('express')
let router = express.Router()
let Axios = require('axios')
let WXBizDataCrypt = require('../static/js/WXBizDataCrypt.js')
let config = require('../config.js')
let { UserTable } = require('../models/model.js')
let JWT = require('jsonwebtoken')
let { secret_key } = require('../config')
router.post('/login', function (req, res) {
  const {
    code,
    encryptedData,
    iv,
    signature
  } = req.body
  const {
    appid,
    secret
  } = config
  Axios({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    method: 'GET',
    params: {
      appid,
      secret,
      js_code: code,
      grant_type: 'authorization_code'
    }
  }).then((response) => {
    let {
      session_key,
      openid
    } = response.data
    // 官方提供了nodejs SDK
    let pc = new WXBizDataCrypt(appid, session_key)
    let decodedata = pc.decryptData(encryptedData, iv)
    let {
      nickName,
      gender,
      country,
      province,
      city,
      avatarUrl
    } = decodedata
    UserTable.findOne({
      where: {
        openid: openid
      }
    }).then((user) => {
      if (user) {
        UserTable.update({
          nickname: nickName,
          gender,
          country,
          province,
          city,
          avatar: avatarUrl
        }, {
          where: {
            openid: openid
          }
        }).then(() => {
          console.log('老用户基本资料更新成功！')
        })
      } else {
        UserTable.create({
          openid,
          nickname: nickName,
          gender,
          avatar: avatarUrl,
          country,
          province,
          city
        }).then(() => {
          console.log('新用户基本资料注入成功！')
        })
      }
    })
    // 签发token
    let token = JWT.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 180), // 过期时间设为间隔180天，这样几乎不存在token过期的情况
      openid: openid
    }, secret_key)
    res.json({
      code: 1,
      message: '登录成功',
      token
    })
  }).catch((err) => {
    console.log(err)
    // 同一用户频繁调用可能会导致回调失败
    res.json({
      code: 0,
      data: null,
      message: 'code2session回调失败，请删除小程序后重新打开'
    })
  })
})

module.exports = router
```

对原生小程序来说 eventBus实例只有挂在到APP.globalData里面。对于每个页面都需要授权的情况。一般会有两种做法，一种如上所述在需要的页面嵌入登录框组件。另外一种是单独做一个二级页面来处理注册和登录。这样我们不管我们分享出去的是什么页面，如果对方是新用户则跳到注册登录页面。这里我们需要在app.js onLanuch 函数中先缓存分享出来的参数

```js
onLanuch (options) {
  options : {
    path: '/pages/share/index',
    query: {
      key: val
    }
    ...
  }
}
```

onLanuch 执行完成之后会将分享页面压入空的路由栈（注意不是注册页面）然后check到缓存没有将redirectTo 到注册页面。同时带上已经获取参数（app.vue会被编译成启动页面，没有路由栈）。注册完成在redirectTo 到分享页面 这样就保证登录态 同时只有一个路由栈 就不会存在返回又看到注册页了

