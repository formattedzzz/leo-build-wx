import Vue from 'vue'
import App from './App'
import Event from './utils/event'
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
      sessionID: wx.getStorageSync('sessionID')
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
  config: {
    pages: ['^pages/index/main', 'pages/counter/main', 'pages/profile/main'],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '鲨鱼记账',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      'color': '#666666',
      'selectedColor': '#E9981B',
      'borderStyle': 'black',
      'backgroundColor': '#fff',
      'list': [
        {
          'text': '首页',
          'pagePath': 'pages/index/main',
          'iconPath': '/static/img/tab-index1.png',
          'selectedIconPath': '/static/img/tab-index2.png'
        },
        {
          'text': '我的',
          'pagePath': 'pages/profile/main',
          'iconPath': '/static/img/tab-my1.png',
          'selectedIconPath': '/static/img/tab-my2.png'
        }
      ]
    }
  }
}
