# 尝试用 githooks 实现零配置的自动化部署

关于自动化部署现在已经有很多很多方案。

- [WebHook](https://segmentfault.com/a/1190000005644039)
- [fjpublish](https://github.com/zczhangchao51/fjpublish)
- pm2 (ecosystem.json) 好像很不错
- ~~jenkins~~ 好像配置很繁琐
- ~~Fabric~~ 没了解过

有很多关于 WebHook 的案例，他的原理是在业务中嵌入代码另外起一个服务来监听远程仓库的推送提交然后执行部署脚本。这样真的很麻烦：

- 需要引入额外包
- 需要另外起服务
- 需要在远程仓库做配置
- 因为新起了服务还需要对 niginx 改配置

githook 的原理几乎是一样的。区别在 githook 是在云服务器上新建一个裸仓库，用裸仓库来充当远程服务器。这样就绕过了上面所有的限制。
直接上操作：

```bash
# 连接服务器
ssh leo@134.175.168.18
# cd 到项目平级的目录下 新建一个裸仓库
git init --bare xxx-bare.git
# 或者分布操作
mkdir xxx-bare.git
cd xxx-bare.git
git init --bare
# xxx-bare.git 最好是：你实际的项目名-bare.git
```

裸仓库与 git init 初使化的仓库不太一样，裸仓库其实相当于通过克隆来的仓库里的.git 文件夹，整个裸仓库中只有 git 索引（index），不包含工作目录。简单来说它是一个有灵魂没有肉体的仓库，包含所有版本、分支信息。
接下来 cd 到 xxx-bare.git/hooks。我们看下都有啥：

![pic](https://i.loli.net/2019/01/21/5c4541f0ba880.png)

提交、推送、更新一大堆乱七八糟的。因为这是在服务器上的仓库，一般我们会触发的钩子也就是推送。复制并重命名 post-update.sample 文件:

```bash
cp post-update.sample post-update
vim post-update
```

在这里添加部署脚本：

```bash
#!/bin/sh
unset GIT_DIR
DIR_PROJECT=/home/ubuntu/account-server
DIR_GITHOOK=/home/ubuntu/account-server-bare.git
# DIR_PROJECT 为你项目的根目录路径
# DIR_GITHOOK 为裸仓库的路径
cd $DIR_PROJECT
git init

# 将刚才的裸仓库添加为你项目仓库的远程仓库
# 注意这里不要和你现有的远程仓库名重名 因为一般你已经有一个origin的默认远程了
git remote add origin2 DIR_GITHOOK
git clean -df
git pull origin2 master

#pm2重启项目即可
pm2 restart app.js
```

> 注意： 一定要 unset GIT_DIR 清除变量， 不然会引起 remote: fatal: Not a git repository: ‘.’错误。

给 post-update 开个光，添加执行权限：

```bash
chmod +x post-update
```

本地仓库添加 remote 源

```bash
git remote add production ubuntu@134.175.168.18:/home/ubuntu/account-server-bare.git
```

添加进项目执行脚本

```bash
"scripts": {
  "dev": "cross-env NODE_ENV=dev nodemon app.js",
  "prod": "git push production master"
}
```

这样我们运行一下 npm run prod 几秒钟之后就服务器上就跑着最新的代码了。特别是对于小程序项目，手机上进行调试只能访问线上的接口。

<img src="https://leo-1256956442.cos.ap-shanghai.myqcloud.com/deploy.png" width="400" />
