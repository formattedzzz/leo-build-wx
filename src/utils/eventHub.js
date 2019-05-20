// 发布订阅模式
export default class Event {
  constructor () {
    this.store = {}
    this.storeOnce = {}
    this.cached = {}
  }
  $on (name, func, id = '', useCached = false) {
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

