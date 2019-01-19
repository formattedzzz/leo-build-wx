### mpvue小程序前端框架做的一个仿轻芒在线答题小程序

- 整体功能
一个账本小工具
一个新闻推送系统 用户也可推出动态
一个小型在线答题系统 支持自主答题、在线匹配答题、邀请好友一起答题 有房间聊天及全局私信功能
一个方格小游戏
- 整体技术栈
前端：mpvue
后端：express
通讯：socket.io
orm： sequelize
登录：jsonwebtoken
代理：nginx
开发调试：nodemon
开发调试：log4js(业务日志) + morgan(访问日志)
后台运行：pm2
自动部署：githooks
<!-- [![npm package](https://img.shields.io/npm/v/mpvue-entry.svg)](https://npmjs.org/package/mpvue-entry)
[![npm downloads](https://img.shields.io/npm/dm/mpvue-entry.svg)](https://npmjs.org/package/mpvue-entry)
[![build status](https://travis-ci.org/F-loat/mpvue-entry.svg?branch=master)](https://travis-ci.org/F-loat/mpvue-entry)
[![codecov](https://codecov.io/gh/F-loat/mpvue-entry/branch/master/graph/badge.svg)](https://codecov.io/gh/F-loat/mpvue-entry/branch/master)
[![codebeat badge](https://codebeat.co/badges/c51b57e4-c809-404e-a825-4271a8e2e01e)](https://codebeat.co/projects/github-com-f-loat-mpvue-entry-master)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/F-loat/mpvue-entry/blob/master/LICENSE) -->

#### 环境搭建

- 前端环境

``` bash
git clone https://github.com/formattedzzz/leo-build-wx.git
cd leo-build-wx
npm install
npm run dev
```

- 服务端环境

``` bash
git clone https://github.com/formattedzzz/leo-build-server.git

启动之前手动建立数据库并修改数据库密码 打开终端或可视化工具
mysql -u root -p 'your mysql password'
CREATE DATABASE account;
修改config.js中password字段

cd leo-build-server
npm install
npm run dev
```

#### 在线预览
<div style="text-align:center;"><img src="https://i.loli.net/2019/01/20/5c434b5c6a01c.jpg" style="width:200px;height:200px;"></div>

#### 一些总结
[小程序的完整（注册）登录流程总结](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)

[小程序的touchstart touchmove touchend和tap间有哪些坑点？](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)

[发布订阅模式在多页应用中的最佳实践](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)

[给你的socket连接加入中间件](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)

[多页应用中socket对象的全局管理](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)

[加入心跳包机制让通讯连接更加稳定](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)

[摒弃socket.id机制 利用openid维护连接对象](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)

[怎样做一个优雅、无数据负担的小程序左滑删除组件](https://github.com/formattedzzz/smooth-slider4mp)

[引入log4js分离业务日志并快速在线访问](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)

[让你的debug控制台更加的生动](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)

[怎么样初始化一个答题记录这样和双方绑定的结构表](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)

[尝试用githook实现零配置的自动化部署](https://github.com/formattedzzz/leo-build-wx/blob/master/summary/login.md)