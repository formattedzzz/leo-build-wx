import Vue from 'vue'
import App from './App'
import Event from './utils/event'
Vue.config.productionTip = false
App.mpType = 'app'

// const baseURL = 'http://localhost:7003'
const baseURL = 'https://wx.nnleo.cn'
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
    pages: [
      '^pages/account-index/main',
      'pages/account-charts/main',
      'pages/account-more/main',
      'pages/account-center/main',
      'pages/component-page/toggle-panel/main',
      'pages/component-page/img-cut/main',
      'pages/component-page/slide-list/main'
    ],
    window: {
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '鲨鱼记账',
      navigationBarTextStyle: 'black',
      backgroundColor: '#eeeeee',
      backgroundTextStyle: 'dark'
    },
    tabBar: {
      'color': '#999999',
      'selectedColor': '#00cc00',
      'borderStyle': '#999999',
      'backgroundColor': '#fff',
      'list': [
        {
          'text': 'Account',
          'pagePath': 'pages/account-index/main',
          'iconPath': '/static/tabbar-img/tab1.png',
          'selectedIconPath': '/static/tabbar-img/tab1-picked.png'
        },
        {
          'text': 'Charts',
          'pagePath': 'pages/account-charts/main',
          'iconPath': '/static/tabbar-img/tab2.png',
          'selectedIconPath': '/static/tabbar-img/tab2-picked.png'
        },
        {
          'text': 'Discover',
          'pagePath': 'pages/account-more/main',
          'iconPath': '/static/tabbar-img/tab3.png',
          'selectedIconPath': '/static/tabbar-img/tab3-picked.png'
        },
        {
          'text': 'About',
          'pagePath': 'pages/account-center/main',
          'iconPath': '/static/tabbar-img/tab4.png',
          'selectedIconPath': '/static/tabbar-img/tab4-picked.png'
        }
      ]
    }
  }
}
