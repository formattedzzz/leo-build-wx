# 加入心跳包机制来优化通讯连接

翻了很多文档也没有发现多少具体解决客户端 socket 在静默超过一定时间的情况下断开重连的情况。只找到一些古老的版本 set、get 方法：

```js
io.set("heartbeat interval", 20);
io.set("heartbeat timeout", 30);
```

但好像已经不管用了。所以需要手动加入心跳包，方法很简单，开一个定时器来定时（40-60s）对每个在线的客户端发送空数据的唤起事件，客户端这边建立连接后就监听改事件，在监听的回调里发送回去。

```js
// ----------------------服务端
GameHub.prototype.run_beat_system = function () {
  setInterval(() => {
    this.io.of('/user').emit('beat_req')
  }, 60000)
}
GameHub.prototype.init = function (httpserver, options) {
  let opts = options || this.getdefaultoptions()
  this.io = IO(httpserver)
  this.verify_token(this.io)
  this.run_match_system(this.matching_clients)
  // 执行心跳包系统
  this.run_beat_system(this.online_clients)

  this.io.of('/user').on('connection', async (socket) => {
    socket.on('beat_res', () => {})
    // 接受心跳包
    // ...
  }
  // ...
}
// ----------------------前端
socket.on('connect', () => {
  console.log('connected', socket.id)
  socket.on('beat_req', (msg) => { socket.emit('beat_res') }) // 返回心跳包事件
})
```

这样我们的连接就变得很稳定了，直到 socket 对象被回收才会真正断开连接。
