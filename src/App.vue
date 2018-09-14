<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('当前环境为：', process.env.NODE_ENV)
  },
  onLaunch () {
    // let vm = this
    wx.checkSession({
      success (res) {
        console.log('onLaunch session_key有效', res)
      },
      fail (res) {
        console.log('onLaunch session_key失效', res)
        // wx.login({
        //   success: (res) => {
        //     vm.req({
        //       url: '/wx/login',
        //       data: {
        //         code: res.code
        //       },
        //       menthod: 'GET',
        //       success (data) {
        //         console.log(data)
        //       }
        //     })
        //   }
        // })
      }
    })
  }
}
</script>

<style lang="css">
@import url('../static/weui.wxss');
@import url('../static/icon-font.wxss');
</style>
<style lang="stylus">
page 
  width 100vw
  min-height 100vh
  overflow hidden
</style>
