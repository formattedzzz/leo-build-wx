import Vue from 'vue'
import App from './App'
// import Event from './utils/event'
import Event from './utils/eventHub'
import store from './store/index'
Vue.config.productionTip = false
App.mpType = 'app'

// const baseURL = 'http://localhost:7003'
const baseURL = 'https://wx.nnleo.cn'
Vue.prototype.baseURL = baseURL
Vue.prototype.eventBus = new Event()
Vue.prototype.$store = store
Vue.prototype.req = function (config) {
  return new Promise((resolve, reject) => {
    let base = baseURL
    wx.request({
      url: base + config.url,
      data: config.data,
      method: config.method || 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.statusCode === 500 || res.statusCode === 404) {
          wx.showToast({
            title: `err: ${res.statusCode}`,
            icon: 'none'
          })
          reject(new Error(`err: ${res.statusCode}`))
          return
        }
        if (res.data.code === -1) {
          wx.clearStorageSync()
          Vue.prototype.eventBus.$emit('revokeLogin', true)
        }
        config.success && config.success(res)
        resolve(res)
      },
      fail: function (res) {
        if (config.fail) {
          config.fail(res)
          reject(res)
        } else {
          wx.showToast({
            title: '网络好像不太好诶',
            icon: 'none'
          })
          reject(new Error('网络好像不太好诶'))
        }
      },
      complete: function () {
        config.complete && config.complete()
      }
    })
  })
}
const app = new Vue(App)
app.$mount()

export default {
  config: {
    pages: [
      '^pages/tab-index/main',
      'pages/tab-issue/main',
      'pages/tab-more/main',
      'pages/tab-center/main',

      'pages/account-panel/main',
      'pages/account-record/main',
      'pages/sub-album/main',
      'pages/sub-welcome/main',
      'pages/sub-pupteer/main',
      'pages/sub-test/main',

      'pages/socket-page/socket-connect/main',
      'pages/socket-page/socket-emiton/main',
      'pages/socket-page/socket-shulte/main',

      // 'pages/component-page/toggle-panel/main',
      // 'pages/component-page/img-cut/main',
      // 'pages/component-page/video-test/main',
      'pages/component-page/slide-list/main'
    ],
    window: {
      'navigationBarBackgroundColor': '#fff',
      'navigationBarTitleText': 'leo小筑',
      'navigationBarTextStyle': 'black',
      'backgroundColor': '#eeeeee',
      'backgroundTextStyle': 'dark'
    },
    tabBar: {
      'color': '#999999',
      'selectedColor': '#00cc00',
      'borderStyle': 'black',
      'backgroundColor': '#fff',
      'list': [
        {
          'text': 'Account',
          'pagePath': 'pages/tab-index/main',
          'iconPath': '/static/tabbar-img/tab1.png',
          'selectedIconPath': '/static/tabbar-img/tab1-picked.png'
        },
        {
          'text': 'Charts',
          'pagePath': 'pages/tab-issue/main',
          'iconPath': '/static/tabbar-img/tab2.png',
          'selectedIconPath': '/static/tabbar-img/tab2-picked.png'
        },
        {
          'text': 'Discover',
          'pagePath': 'pages/tab-more/main',
          'iconPath': '/static/tabbar-img/tab3.png',
          'selectedIconPath': '/static/tabbar-img/tab3-picked.png'
        },
        {
          'text': 'About',
          'pagePath': 'pages/tab-center/main',
          'iconPath': '/static/tabbar-img/tab4.png',
          'selectedIconPath': '/static/tabbar-img/tab4-picked.png'
        }
      ]
    }
  }
}
