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

