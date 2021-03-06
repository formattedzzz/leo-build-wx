// 发布订阅模式
export default class Event {
  constructor () {
    this.store = {}
    this.storeOnce = {}
    this.cached = {}
  }
  $on (name, func, maxlen = 100, useCached = true) {
    // 检查store里有没有监听这个事件 如果有 往该事件push 没有则初始化该属性值为数组 
    // 这里store存的其实不是具体的函数 而是包含上下文的函数调用栈
    // 为什么我们要加一个maxlen 参数呢 很多情况下 我们往往会重复同样上下文环境的一个函数 在多次监听时只触发一次
    if (this.store[name]) {
      if (this.store[name].length < maxlen) {
        this.store[name].push(func)
      }
    } else {
      this.store[name] = [func]
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
  $once (name, func) {
    console.log(this.storeOnce[name], this.cached[name])
    this.storeOnce[name] ? this.storeOnce[name].push(func) : (this.storeOnce[name] = [func])
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
      this.store[name].forEach(func => func(...param))
      // 同时往缓存里面添加事件 事件名称: data
      this.cached[name] = param
    } else if (this.storeOnce[name] instanceof Array) {
      // store 没有 storeOnce 里面有则走这里
      this.storeOnce[name].forEach(func => func(...param))
      this.storeOnce[name] = null
    } else {
      // 否则把参数塞进缓存池 缓存池时覆盖的 采用时间维度上最新的
      this.cached[name] = param
    }
  }
}
// event.$on('leo', ()=>{console.log(123)}, 123)
// event.$on('leo', ()=>{console.log(12322222)}, 'abc')
// var event = new Event()
// event.$emit('leo', {name: 'leooop'}, 123)
// event.$emit('leo', {name: 'leooov'}, 'abc')
// event.$on('leo', (data) => {
//   console.log(data)
// })
