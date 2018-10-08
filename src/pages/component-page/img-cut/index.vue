<template>
<div class="container">
<scroll-view class="scroll-view" scroll-y="true" scroll-x="true">
  <img class="img" src="/static/img/md2.jpg" style="width: 300px;height: 600px;" >
</scroll-view>
<button type="primary" style="margin: 40rpx;" @click="getRect">获取RECT</button>
{{x}}----{{y}}
</div>
</template>

<script>
  export default {
    data () {
      return {
        x: 0,
        y: 0
      }
    },
    computed: {
    },
    onLoad () {

    },
    methods: {
      getRect () {
        let _this = this
        wx.createSelectorQuery().select('.img').boundingClientRect(function (rect) {
          _this.x = Math.abs(rect.left)
          _this.y = Math.abs(rect.top)
        }).exec()
      }
    }
  }
</script>

<style lang="stylus">
.scroll-view
  width 300px
  height 300px
  margin 50px auto 0
</style>