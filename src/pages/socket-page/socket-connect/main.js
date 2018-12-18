import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.eventBus.$on('socket_emiton', (data) => {
  Vue.prototype.socket = data
})
app.$mount()
export default {
  config: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#445',
    navigationBarTitleText: '英语全能王',
    navigationBarTextStyle: 'white'
  }
}
