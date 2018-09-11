<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('当前环境为：', process.env.NODE_ENV)
  }
}
</script>

<style lang="stylus">
page 
  width 100vw
  min-height 100vh
  overflow hidden
</style>
