# 给你的 socket 连接加入连接中间件

默认 socket 连接配置是不稳定的，连接建立之后如果客户端跟服务端在没有任何互动事件触发达到一定时间之后会出现短暂的重连（重连是默认配置，可在连接时修改）、但是重连会给我们的业务造成很大的干扰，因为 socket.id 会被刷新。而且这种短暂的重连跟手机断网或者飞行模式造成失连是一样的。会完整的出发 connect 和 disconnect。一个用户一旦失去连接我们就必须做业务处理，即使他是短暂的。并且在他短暂重连后我们依然要能识别出他是谁，所以要用 openid 来做用户的唯一标示。如果首次连接参数没有附带 openid，那我们就认为这是一次没有意义的连接。好在 socket.io 为我们提供了中间件机制。

先看文档

```js
const socket = io("http://localhost?token=abc");
// server-side
const io = require("socket.io")();

// middleware
io.use((socket, next) => {
  let token = socket.handshake.query.token;
  if (isValid(token)) {
    return next();
  }
  return next(new Error("authentication error"));
});

// then
io.on("connection", socket => {
  let token = socket.handshake.query.token;
  // ...
});
```

业务代码

```js
//------------------------------前端
import IO from `${path}/socket.io.js`
connect () {
  if (socket.connected) return
  let token = wx.getStorageSync('token')
  // 在这里带上token
  let URL = `${this.baseURL}/user?token=${token}`
  socket = IO(URL)
  this.eventBus.$emit('attach_socket', socket)
  socket.on('connect', () => {
    wx.setTabBarBadge({
      index: 2,
      text: '1'
    })
    console.log('connected', socket.id)
    socket.on('beat_req', (msg) => { socket.emit('beat_res') })
  })
  socket.on('error', () => {
    wx.showModal({
      title: '提示',
      content: '连接失败,可能是token出错了',
      showCancel: false
    })
  })
  socket.on('disconnect', (reason) => {
    wx.setTabBarBadge({
      index: 2,
      text: '0'
    })
    console.log(reason, '正在重连')
    socket.connect()
  })
}

//------------------------------服务端
let JWT = require('jsonwebtoken')
// 这里我们依然用JWT来解析前端带过来的token
let {UserTable} = require('../models/model.js')
let IO = require('socket.io')
GameHub.prototype.verify_token = function (IO) {
  IO.use((socket, next) => {
    let {token} = socket.handshake.query
    JWT.verify(token, config.secret_key, (err, decoded) => {
      if (err) {
        debug.error('authentication error')
        return next(new Error('authentication error'))
      } else {
        return next()
      }
    })
  })
}
GameHub.prototype.init = function (httpserver, options) {
  let opts = options || this.getdefaultoptions()
  this.io = IO(httpserver)
  // 在socket服务挂载到appserver时便调用检验函数
  this.verify_token(this.io)
  // ...
}
```

这样我们就可以确保每次连接都能拿到 openid 并且和相应 socket 对象建立联系，查询 user 表拿到基本信息
