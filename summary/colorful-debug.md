### 简简单单的、让你的debug控制台生动起来

很多项目里都会引入chalk包来打印彩色的log信息，其实自己写一个也是非常简单。
主要是改变输出的背景色和字体颜色：

- 字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
- 背景编号：40黑，41红，42绿，43黄，44蓝，45紫，46深绿，47白色

```js
const debug = {
  log (...msgs) {
    let msg = ' ';
    [].forEach.call(msgs, (item) => {
      msg += item
    })
    console.log('\033[47;30m' + 'debug' + '\033[40;37m' + msg + '\033[0m' + '\n')
  },
  success (...msgs) {
    let msg = ' ';
    [].forEach.call(msgs, (item) => {
      msg += item
    })
    console.log('\033[42;30m' + 'success' + '\033[40;32m' + msg + '\033[0m' + '\n')
  },
  warn (...msgs) {
    let msg = ' ';
    [].forEach.call(msgs, (item) => {
      msg += item
    })
    console.log('\033[43;30m' + 'warn' + '\033[40;33m' + msg + '\033[0m' + '\n')
  },
  error (...msgs) {
    let msg = ' ';
    [].forEach.call(msgs, (item) => {
      msg += item
    })
    console.log('\033[41;30m' + 'error' + '\033[40;31m' + msg + '\033[0m' + '\n')
  }
}
// \033[0m 为关闭所有属性
/** 用法实例 */
debug.log('this is a loginfo')
debug.success('this is a success info')
debug.warn('this is a warn info')
debug.error('this is a error info')
module.exports = debug
```

**其他标记**
- \033[0m 关闭所有属性
- \033[1m 设置高亮度
- \033[4m 下划线
- \033[5m 闪烁
- \033[7m 反显
- \033[8m 消隐
- \033[nA 光标上移n行
- \033[nB 光标下移n行
- \033[nC 光标右移n列
- \033[nD 光标左移n列
- \033[y;xH 设置光标位置（y列x行）
- \033[2J 清屏
- \033[K 清除从光标到行尾的内容

#### 显示效果

![](https://s2.ax1x.com/2019/01/21/kPOW7V.md.png)