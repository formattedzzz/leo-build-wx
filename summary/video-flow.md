# node 处理静态资源、实现视频云点播的效果

express 框架本身并没有为我们提供支持所有文件的访问形式，比如说：

```txt
- static
-- index.html
-- index.js
-- index.css
-- some.png
-- some.pdf
-- some.mp3
-- some.mp4
-- api.log
```

虽然网上有很多像 serve-handler 托管静态资源的库，但时在返回视频这一块并不是我想要样子。动手写一个最简单的。

```js
// app.js
let static_controller = require("static_controller");
app.use("/static", static_controller);
```

```js
// static_controller.js
let express = require("express");
let router = express.Router();
let path = require("path");
let fs = require("fs");
function getContentType(str) {
  switch (str) {
    case "png":
    case "jpg":
    case "gif":
    case "jpeg":
      return "image/" + str;
      break;
    case "svg":
      return "text/xml";
      break;
    case "pdf":
      return "application/pdf";
      break;
    case "js":
      return "application/x-javascript";
      break;
    case "css":
    case "txt":
      return "text/" + str;
      break;
    case "html":
      return "text/html";
      break;
    default:
      return "application/octet-stream";
  }
}
router.get("*", function(req, res) {
  let pathurl = req.path;
  let type = /\.(\w+)$/.exec(pathurl) ? /\.(\w+)$/.exec(pathurl)[1] : "";
  res.set("Content-Type", getContentType(type) + ";charset=utf-8");
  let url = path.resolve(__dirname, "../static" + pathurl);
  fs.readFile(url, function(err, data) {
    if (err) {
      res.header("Content-Type", "application/json;charset=utf-8");
      res.status(404).json({
        code: 0,
        message: "404!没有找到相应资源，请检查路径"
      });
    } else {
      res.send(data);
    }
  });
});
module.exports = router;
```

对视频的处理断点处理。如果我们一股脑将视频文件以二进制流的形势返回没有做断点续传处理的话，前端一拖动视频就会报错。因为一拖动会重新触发 video 标签的请求行为、导致返回的流与 video 组件的 seek 值相冲突。我们需要对流文件进行分段式返回。上完整代码：

```js
router.get("*", function(req, res) {
  let pathurl = req.path;
  // 根据static下具体的路径拼接成完整路径
  let url = path.resolve(__dirname, "../upload" + pathurl);
  // 因为我们只针对视频流文件做处理（这里以mp4为例） 所以取出后缀名
  let type = /\.(\w+)$/.exec(pathurl) ? /\.(\w+)$/.exec(pathurl)[1] : "";
  if (type === "mp4") {
    const path = url;
    // 获取文件信息
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    // 获取头部的range字段 如果服务端返回206状态的话 那么前端的下次请求头部将会带上range字段并从返回的末尾开始
    const range = req.headers.range;
    console.log(req.headers.range);
    if (range) {
      // 取出range的字节范围 格式为：{range: 'bytes=10256384-41245374'}
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      // 计算返回总长
      const chunksize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        // 206状态必要的字段
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4"
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  } else {
    // 如果不是视频格式的话我们可以尝试寻找 content-type就根据后缀名来返回
    let url = path.resolve(__dirname, "../upload" + pathurl);
    fs.readFile(url, function(err, data) {
      if (err) {
        res.header("Content-Type", "application/json;charset=utf-8");
        res.status(404).json({
          code: 0,
          message: "404!没有找到相应资源，请检查路径"
        });
      } else {
        res.set("Content-Type", `image/${type};charset=utf-8`);
        res.send(data);
      }
    });
  }
});
```

HTTP/1.1 206 状态码表示的是：客户端通过发送范围请求头 Range 抓取到了资源的部分数据。这种请求通常用来:

- 学习 http 头和状态
- 解决网路问题
- 解决大文件下载问题
- 解决 CDN 和原始 HTTP 服务器问题
- 使用工具例如 lftp, wget, telnet 测试断点续传
- 测试将一个大文件分割成多个部分同时下载

<img src="https://leo-1256956442.cos.ap-shanghai.myqcloud.com/client206.png" width="360" />

<img src="https://leo-1256956442.cos.ap-shanghai.myqcloud.com/server206.png" width="360" />

> fs.createReadStream(path, [options])

创建文件可读流，options 可以指定读取文件参数，包括 start，end，指定读取特定位置文件数据

> fs.statSync(path, callback)

该方法用于检测文件的状态，可以借此来判断某个文件是否存在。path 参数传入该文件的绝对物理路径，callback 回调函数有两个参数 err 和 stats。其中 err 为错误信息参数，stats 为一个文件状态对象。

```js
Stats: {
    dev: 2114,
    ino: 48064969,
    mode: 33188,
    nlink: 1,
    uid: 85,
    gid: 100,
    rdev: 0,
    size: 527,
    blksize: 4096,
    blocks: 8,
    atimeMs: 1318289051000.1,
    mtimeMs: 1318289051000.1,
    ctimeMs: 1318289051000.1,
    birthtimeMs: 1318289051000.1,
    atime: Mon, 10 Oct 2011 23:24:11 GMT,
    mtime: Mon, 10 Oct 2011 23:24:11 GMT,
    ctime: Mon, 10 Oct 2011 23:24:11 GMT,
    birthtime: Mon, 10 Oct 2011 23:24:11 GMT
}
```
