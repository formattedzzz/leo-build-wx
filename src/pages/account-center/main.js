import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
  config: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#463f6d',
    navigationBarTitleText: '个人中心',
    navigationBarTextStyle: 'white'
  }
}
