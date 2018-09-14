import Vue from 'vue'
import App from './App'
import Event from './utils/event'
// import '/static/weui.'
Vue.config.productionTip = false
App.mpType = 'app'

const baseURL = 'http://localhost:7003'
Vue.prototype.baseURL = baseURL
Vue.prototype.req = function (config) {
  let base = baseURL
  wx.request({
    url: base + config.url,
    data: config.data,
    method: config.method || 'GET',
    header: {
      Cookie: wx.getStorageSync('Cookie')
    },
    success: function (res) {
      if (res.statusCode === 500 || res.statusCode === 404) {
        wx.showToast({
          title: `err: ${res.statusCode}`,
          icon: 'none'
        })
        return
      }
      config.success && config.success(res)
    },
    fail: function (res) {
      if (config.fail) {
        config.fail(res)
      } else {
        wx.showToast({
          title: '加载出错,请检查网络',
          icon: 'none'
        })
      }
    },
    complete: function () {
      wx.stopPullDownRefresh()
      config.complete && config.complete()
    }
  })
}
Vue.prototype.event = new Event()
const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/index/main', 'pages/counter/main'],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '鲨鱼记账',
      navigationBarTextStyle: 'black'
    }
  }
}
