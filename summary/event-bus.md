### EVENTBUS在多页应用中的最佳实践

先罗列一下小程序中常用的页面通讯手段有哪些
- query传值 常用

```js
onLoad (options) {
  console.log(options)
  // options 只能载onLoad、onLanuch方法中 
  // 其他地方可以用mpvue框架提供的方法访问：
  this.$mp.query
  // 也可以直接挂在到页面实例
  this.query = options
}
onShow () {
  console.log(this.query)
}
```

- APP.golalData、Vuex(mpvue) 有些繁琐 很多场景不够灵活

```js
const APP = getApp()
onLoad () {
  APP.golalData.key
}
```

- 缓存

```js
onUnload () {
  wx.setStorageSync('mark', data)
}
onShow () {
  if (wx.getStorageSync('mark')) {
    console.log(wx.getStorageSync('mark'))
  }
}
```
缓存比较直观可以解决一些比较小众的场景 比如说只在特定的页面onShow钩子函数中执行某些代码。而我们又不确定onShow的前一个具体场景是啥。业务中碰到过上传头像的一个场景，需要在选好照片后把临时路径传入裁剪页面，裁剪好之后获取新的临时路径并缓存。直到返回到上一个页面在特定时机才上传。

- eventbus 简便易用 逻辑清晰

先看看eventbus的核心实现

```js
export default class Event {
  constructor () {
    this.store = {}
    this.storeOnce = {}
    // 缓存 用于先触发后监听
    this.cached = {}
  }
  $on (name, func, useCached = true) {
    this.store[name] ? this.store[name].push(func) : (this.store[name] = [func])
    if (this.cached[name] instanceof Array && useCached) {
      func(...(this.cached[name]))
    }
  }
  $once (name, func) {
    console.log(this.storeOnce[name], this.cached[name])
    this.storeOnce[name] ? this.storeOnce[name].push(func) : (this.storeOnce[name] = [func])
    if (this.cached[name] instanceof Array) {
      func(...(this.cached[name]))
      this.cached[name] = null
    }
  }
  $emit (name, ...param) {
    if (this.store[name] instanceof Array) {
      this.store[name].forEach(func => func(...param))
      this.cached[name] = param
    } else if (this.storeOnce[name] instanceof Array) {
      this.storeOnce[name].forEach(func => func(...param))
      this.storeOnce[name] = null
    } else {
      this.cached[name] = param
    }
  }
}
```

我们需要把一个Event实例挂载到每个页面都能访问到的地方。很显然每个页面都由一个vue实例驱动。

```js
import Vue from 'vue'
import Event from './utils/event'
Vue.prototype.eventBus = new Event()
```

```js
// page1 hooks or any methods
onLoad () {
  console.log(this.evntBus)
  this.eventBus.$emit('event', data)
}
// page2 hooks or any methods
onShow () {
  this.eventBus.$on('event', (data) => {
    console.log(data)
  })
  // 条件监听
  this.checkToken().then(() => {
    // ...
  }).catch(err){
    if (err.key) {
      this.eventBus.$on('event', (data) => {
        console.log(data)
      })
    }
  }
}
```

- 回调执行的可能是store事件栈里的（在emit之后）也可能是cached时间栈里的。条件监听可以免设不必要的变量，让代码更加健壮。

- 缓存虽然也能在页面间传递比较大的不适合用在query中大对象，但它于eventBus最本质的区别是缓存取出来的只是全新的副本，而eventbus仍然保持着引用关系。

- 用eventBus挂在更加易于访问的全局属性

```js
// page.vue
getopenid () {
  this.req({
    url: '/api/openid'
  }).then(({data}) => {
    let res = data
    if (res.code) {
      this.eventBus.$emit('attach_openid', res.openid)
    }
  })
}
// main.js
app.eventBus.$on('attach_openid', (openid) => {
  Vue.prototype.openid = openid
})

// other pages
onLoad () {
  console.log(this.openid)
}
```

应eslint规范 页面内实例是不要通过 __ proto __ 来访问构造原型，但是我们依然可以通过eventBus来绕过vue文件内访问不到Vue的问题。这里我们可以把当前socket对象挂在全局，每个页面都能访问、操作同一个对象。