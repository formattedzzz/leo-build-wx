<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    console.log('当前环境为：', process.env.NODE_ENV)
  },
  onLanuch () {
    // let vm = this
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
