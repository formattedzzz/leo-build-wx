/**
 * @因为工作的交接跟午饭导致断续答的题时间没有统计 (在要求范围内)
 */

// 第一题
for (var i = 0; i < 5; i++) { 
  (function (num) {
    setTimeout(function () {
      console.log(num + 1);
    }, num * 1000)
  })(i)
}
// 通过函数立即执行的方式将遍历中的i值传入函数内部作用域 

// 第二题
function confirmTarget (arr, target) {
  var tempSet = new Set();
  // 记录targer-arr[i]的值 如果后面的arr[i]在set里面存在 说明 命题成立
  var res = false;
  // 仅遍历一次
  arr.forEach((item, idx) => {
    tempSet.add(target - item);
    console.log(tempSet)
    if (idx >= 1 && tempSet.has(item)) {
      // 第二个开始判断
      console.log(idx, item)
      res = true
    }
  })
  return res
}
// 通过申明一个临时set结构来解决判断遍历中的item是否存在目标值

// 第三题
setTimeout(function() {
  console.log(1);
}, 100);
setTimeout(function () {
  console.log(2);
}, 0)
Promise.resolve(console.log(3)).then(() => { 
  console.log(4)
})
async function async1 () {
  console.log(5)
  await async2()
  console.log(6)
}
async function async2 () {
  console.log(7)
}
async1()
console.log(8)

// 输出结果
// 3 5 7 8 4 6 2 1
/**
 * @我的解析
 * @setTimeout 函数入栈宏观队列 @Promise @async 函数入栈微观队列
 * 第一轮循环
 * 立即执行:
 *    Promise.resolve => console.log(3) 
 *    async1() => console.log(5) async2() => console.log(7)
 *    console.log(8)
 * micro [console.log(4); console.log(6)]
 * macro [console.log(2); console.log(1);]
 * 第一轮循环
 *    先清空micro执行栈 再清空macro执行栈
 * */

// 第四题
// 申明一个构造函数Toucher 给实例附上一个属性 并将该元素初始化
// 申明一个数据中心 这里可以用{}来承载 以便拓展监听不同的事件 事件是一个回调函数构成的数组
function Toucher (el) {
  this.$el = el;
  this.callStatck = {};
  this.init(el);
}
// 为元素绑定时间
Toucher.prototype.init = function (el) {
  var startx;
  var starty;
  el.addEventListener('touchstart', function (e) {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
  }, false);
  el.addEventListener('touchend', function (e) {
    var endx;
    var endy;
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    var direction = this.judgeDirection(startx, starty, endx, endy);
    if (direction !== 0) {
      this.trigger('swiper', direction);
    } else {
      console.log('slide too short to trigger');
    }
  }, false);
}
// 监听函数
Toucher.prototype.on = function (evname, evcall) {
  if (typeof evname !== 'string') {
    throw new Error('params eventName should be a string');
  }
  if (typeof evcall !== 'function') {
    throw new Error('params eventName should be a function');
  }
  if (this.callStatck[evname]) {
    this.callStatck[evname].push(evcall)
  } else {
    this.callStatck[evname] = [evcall]
  }
}
// 触发函数
Toucher.prototype.trigger = function (evname, type) {
  // 找到对应的事件名的函数数组 遍历执行 并把结果传进去
  if (this.callStatck[evname] instanceof Array && this.callStatck[evname].length) {
    this.callStatck[evname].forEach(function (call) {
      call({
        direction: ['上','下','左','右'][type]
      })
    })
  }
}
// 需要用到的一个工具函数 判断滑动方向
Toucher.prototype.judgeDirection = function (startx, starty, endx, endy) {
  var angx = endx - startx;
  var angy = endy - starty;
  var result = 0;
  if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
    return result;
  }
  function getAngle(angx, angy) {
    return Math.atan2(angy, angx) * 180 / Math.PI;
  };
  var angle = getAngle(angx, angy);
  if (angle >= -135 && angle <= -45) {
    result = 1;
  } else if (angle > 45 && angle < 135) {
    result = 2;
  } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
    result = 3;
  } else if (angle >= -45 && angle <= 45) {
    result = 4;
  }
  return result;
}

// 用法示例
var touchEl = new Toucher(document.getElementById('app'));
touchEl.on('swipe', function(e) {
  console.log(e.direction)
  // '上'
})


// 第五题
class EventEmitter {
  constructor () {
    this.store = {}
    this.storeOnce = {}
    this.cached = {}
  }
  on (name, func, id = '', useCached = false) {
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
      // 添加改事件的第一个回调
      this.store[name] = [{func, id}]
    }
    if (this.cached[name] instanceof Array && useCached) {
      // 说明有缓存的 可以执行 cached缓存下来的是 订阅的事件名称: [params, []]  params是一个数组或空数组
      func(...(this.cached[name]))
    }
  }
  off (name) {
    // 清空一个事件的监听
    this.store[name] = null
    this.cached[name] = null
  }
  once (name, func, id = '') {
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
  fire (name, ...param) {
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