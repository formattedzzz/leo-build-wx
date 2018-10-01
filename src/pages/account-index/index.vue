<template>
  <div class="container">
    ZHE是首页，记账详情
    <img src="http://192.168.5.190:7003/static/img/full1.jpg">
    {{userinfo}}
  </div>
</template>

<script>

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
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>

<style lang="stylus">
</style>
