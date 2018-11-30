import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
  config: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#e50',
    navigationBarTitleText: '我的账单',
    navigationBarTextStyle: 'white'
  }
}
