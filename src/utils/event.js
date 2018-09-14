// 发布订阅模式
export default class Event {
  constructor () {
    this.store = {}
    this.storeOnce = {}
    this.cached = {}
  }
  $on (name, func, useCached = true) {
    this.store[name] ? this.store[name].push(func) : (this.store[name] = [func])
    if (this.cached[name] instanceof Array && useCached) {
      // 说明有缓存的 可以执行
      func(...(this.cached[name]))
    }
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
