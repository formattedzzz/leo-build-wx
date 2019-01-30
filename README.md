## 基于mpvue小程序前端框架做的一个仿轻芒在线答题小程序

### 整体功能

- [x] 一个账本小工具
- [ ] ~~一个信息发布系统~~

> 一个压图小工具

- [x] 处理前后大小、展示压缩率
- [x] 批量、顺序上传
- [x] 自定义图片名称
- [x] 图床存取【资源有限,个人限额50】
- [x] 快速提取图片外链
- [x] 图片预览
- [x] 图片删除
- [ ] 图片分组

> 一个仿轻芒在线答题系统

- [ ] 自主答题模式[题库有限，暂不开放]
- [x] 在线匹配答题
- [x] 邀请好友答题
- [x] 答题记录
- [x] 房间聊天
- [ ] ~~全局私信功能~~
- [x] 一个方格小游戏
- [x] 排行榜

### 整体技术栈
- 前端：mpvue
- 后端：express
- 通讯：socket.io
- orm： sequelize
- 登录：jsonwebtoken
- 代理：nginx
- 开发调试：nodemon
- 日志系统：log4js(业务日志) + morgan(访问日志)
- 后台运行：pm2
- 自动部署：githooks

### 环境搭建

- 前端环境

``` bash
git clone https://github.com/formattedzzz/leo-build-wx.git
cd leo-build-wx
npm install
npm run dev
# 真机调试需要改为自己的appid 同时修改服务端config.js中appid、secret_key字段
```

- 服务端环境

``` bash
git clone https://github.com/formattedzzz/leo-build-server.git

# 启动之前手动建立数据库并修改数据库密码 打开终端或可视化工具
# mysql -u root -p 'your mysql password'
# CREATE DATABASE account;
# 修改config.js中password字段

cd leo-build-server
npm install
npm run dev
```

### 在线体验

<img src="https://i.loli.net/2019/01/20/5c434b5c6a01c.jpg" width="200" height="200">

### 一些总结

- [x] [小程序的完整（注册）登录流程总结](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/register-login.md)

- [x] [小程序的touch事件和tap事件间的需要留心的一些点](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/mp-event.md)

- [x] [EVENTBUS在多页应用中的最佳实践](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/event-bus.md)

- [x] [给你的socket连接加入连接中间件](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/socket-middleware.md)

- [ ] [摒弃socketid 利用openid维护连接对象及全局管理](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/socket-manager.md)

- [x] [加入心跳包机制来优化通讯连接](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/socket-beats.md)

- [x] [利用move-view做一个优雅、无数据负担的小程序左滑删除组件](https://github.com/formattedzzz/smooth-slider4mp)

- [ ] [挑战细致的业务:仿鲨鱼记账的个性化的键盘](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/custom-keyboard.md)

- [x] [CSS利用对比度和模糊属性实现粘性加载效果](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/stickiness-effect.md)

- [x] [node处理静态资源、实现视频云点播的效果](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/video-flow.md)

- [ ] [引入log4js分离业务日志并快速在线访问](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/node-logs.md)

- [x] [简简单单的、让你的debug控制台生动起来](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/colorful-debug.md)

- [ ] [存、取两名玩家答题记录的API设计](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/qa-records.md)

- [ ] [图片处理的路径、存储小结](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/img-handle.md)

- [x] [尝试用githooks实现零配置的自动化部署](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/git-hooks.md)
