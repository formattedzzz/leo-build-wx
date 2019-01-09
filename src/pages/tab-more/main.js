import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.eventBus.$on('attach_socket', (data) => {
  Vue.prototype.socket = data
})
app.eventBus.$on('attach_openid', (openid) => {
  Vue.prototype.openid = openid
})
app.$mount()
export default {
  config: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '发现',
    navigationBarTextStyle: 'black'
  }
}
