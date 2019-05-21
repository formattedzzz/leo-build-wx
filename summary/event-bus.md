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
缓存比较直观可以解决一些比较小众的场景 比如说只在特定的页面onShow钩子函数中执行某些代码。而我们又不确定onShow的前一个具体场景是啥。业务中碰到过上传头像的一个场景，需要在选好照片后把临时路径传入裁剪页面，裁剪好之后获取新的临时路径并缓存。直到返回到上一个页面在特定时机才上传。

- eventbus 简便易用 逻辑清晰

先看看eventbus的核心实现

```js
// 发布订阅模式
export default class Event {
  constructor () {
    this.store = {}
    this.storeOnce = {}
    this.cached = {}
  }
  $on (name, func, id = '', useCached = false) {
    // name 事件名称 func 函数调用栈(参数、上下文在监听的时候唯一确定) id func标志位
    // 如果没有标志位或没有相同标志位的调用栈 直接push 否则替换 更新为最新参数、上下文的调用栈
    // useCached 默认不使用缓存 若明确存在可能先触发后监听的情况在手动打开
    if (this.store[name]) {
      if (id === '' || !this.store[name].some((v) => v.id === id)) {
        this.store[name].push({ func, id })
      } else {
        this.store[name].forEach((ev, idx) => {
          if (ev.id === id) {
            this.store[name][idx] = {
              id: ev.id,
              func
            }
          }
        })
      }
    } else {
      this.store[name] = [{func, id}]
    }
    if (this.cached[name] instanceof Array && useCached) {
      // 说明有缓存的 可以执行 cached缓存下来的是 订阅的事件名称: [params, []]  params是一个数组或空数组
      func(...(this.cached[name]))
    }
  }
  $off (name) {
    this.store[name] = null
    this.cached[name] = null
  }
  $once (name, func, id = '') {
    console.log(this.storeOnce[name], this.cached[name])
    // this.storeOnce[name] ? this.storeOnce[name].push({func, id}) : (this.storeOnce[name] = [func])
    if (this.storeOnce[name]) {
      if (id !== '' && !this.storeOnce[name].some((v) => v.id === id)) {
        this.storeOnce[name].push({func, id})
      }
    } else {
      this.storeOnce[name] = [{func, id}]
    }
    if (this.cached[name] instanceof Array) {
      // 说明有缓存的 可以执行
      func(...(this.cached[name]))
      this.cached[name] = null
    }
  }
  $emit (name, ...param) {
    // param: 参数数组或空数组 ...扩展运算符的特点
    // console.log(param)
    if (this.store[name] instanceof Array) {
      // 遍历该事件的所有函数 传入数据执行
      this.store[name].forEach(event => event.func(...param))
      // 同时往缓存里面添加事件 事件名称: data
      this.cached[name] = param
    } else if (this.storeOnce[name] instanceof Array) {
      // store 没有 storeOnce 里面有则走这里
      this.storeOnce[name].forEach(event => event.func(...param))
      this.storeOnce[name] = null
    } else {
      // 否则把参数塞进缓存池 缓存池时覆盖的 采用时间维度上最新的
      this.cached[name] = param
    }
  }
}
```

我们需要把一个Event实例挂载到每个页面都能访问到的地方。很显然每个页面都由一个vue实例驱动。

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

应eslint规范 页面内实例是不要通过 __ proto __ 来访问构造原型，但是我们依然可以通过eventBus来绕过vue文件内访问不到Vue的问题。这里我们可以把当前socket对象挂在全局，每个页面都能访问、操作同一个对象。
