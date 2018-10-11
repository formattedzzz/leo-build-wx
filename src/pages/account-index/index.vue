<template>
  <div class="container">
    ZHE是首页，记账详情
    <!-- <img src="http://192.168.5.190:7003/static/img/full1.jpg"> -->
    <button @click="toAccountPanel" class="account-btn"></button>
  </div>
</template>

<script>
import store from '@/store'
export default {
  data () {
    return {
      userinfo: ''
    }
  },
  components: {
  },
  computed: {
    baseURL () {
      return this.baseURL
    }
  },
  onLoad () {
    wx.checkSession({
      success (res) {
        if (wx.getStorageSync('sessionID')) {
          console.log('onLaunch session_key、sessionID有效', res)
          store.commit('shiftNeedLogin', {msg: '触发shiftLogin为false'})
        } else {
          console.log('sessionID失效', res)
          wx.switchTab({
            url: '/pages/account-center/main'
          })
        }
      },
      fail (res) {
        console.log('onLaunch session_key失效', res)
        wx.switchTab({
          url: '/pages/account-center/main'
        })
      }
    })
  },
  methods: {
    toAccountPanel () {
      wx.navigateTo({
        url: '/pages/account-panel/main'
      })
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>

<style lang="stylus">
.account-btn
  width 50px
  height 50px
  border-radius 50%
  background #1aad15
  position fixed
  bottom 10px
  left 50%
  transform translateX(-50%)
  box-shadow 0 0 4px #ddd
</style>
