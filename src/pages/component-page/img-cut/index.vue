<template>
<div class="container">
  <!-- <scroll-view class="scroll-view" scroll-y="true" scroll-x="true">
    <img id="img" src="/static/img/md2.jpg" style="width: 300px;height: 600px;" >
  </scroll-view>
  <button type="primary" style="margin: 10rpx;" @click="getRect1">获取窗口RECT信息</button>
  <h5 style="text-align: center;">
    <span style="color: #fff;">{{x}}----{{y}}</span>
    <span style="color: #fff;">{{left}}----{{top}}----{{scale}}</span>
  </h5>
  <movable-area class="movearea" scale-area="true">
    <movable-view 
      class="moveview-layer"
      direction="none">
    <img class="img-layer" mode="widthFix" src="/static/img/md2.jpg">
    </movable-view>
    <movable-view 
      class="moveview" 
      out-of-bounds="true" 
      scale-max="1" 
      scale="true" 
      inertia
      @scale="scaling"
      @change="changing"
      direction="all">
    </movable-view>
  </movable-area> -->
  <canvas
    canvas-id="my-canvas"
    @click="tapcanvas"

    :style="'width:' + width + 'px;height:' + height + 'px;'">
    <cover-view @click="tapcanvas" class="canvas-cover">

    </cover-view>
  </canvas>
  <div class="footer" style="height: 44px;">
    <span class="span1" @click="action1">操作一</span>
    <span class="span2" @click="action2">操作二</span>
    <span class="span3" @click="action3">操作三</span>
  </div>
</div>
</template>

<script>
  export default {
    data () {
      return {
        // x: 0,
        // y: 0,
        // left: 0,
        // top: 0,
        // scale: 0,
        width: 375,
        height: 300,
        ctx: null,
        tempath: ''
      }
    },
    computed: {
    },
    onLoad () {
      const device = wx.getSystemInfoSync()
      let {windowWidth, windowHeight} = device
      this.width = windowWidth
      this.height = windowHeight - 44
      this.ctx = wx.createCanvasContext('my-canvas')
    },
    methods: {
      tapcanvas () {
        console.log('tapcanvas')
      },
      action1 () {

      },
      action2 () {

      },
      action3 () {

      }
      // getRect1 () {
      //   let _this = this
      //   wx.createSelectorQuery().select('#img').boundingClientRect(function (rect) {
      //     console.log(rect)
      //     _this.x = rect.left
      //     _this.y = rect.top
      //   }).exec()
      // },
      // scaling (e) {
      //   let {x, y, scale} = e.target
      //   this.left = x
      //   this.top = y
      //   this.scale = scale
      // },
      // changing (e) {
      //   let {x, y} = e.target
      //   this.left = x
      //   this.top = y
      // }
    }
  }
</script>

<style lang="stylus">
.container
  overflow hidden
  min-height 100vh
  background #999
.scroll-view
  width 300px
  height 300px
  margin 50px auto 0
.movearea
  width 300px
  height 400px
  margin 20px auto 0
  background #fff
  position relative
.moveview-layer 
  width 100%
  height 100%
.img-layer
  width 100%
  height 100%
  left 0
  top 0
.moveview
  width 300px
  height 300px
  background rgba(0, 0, 0, 0.3)
.canvas-cover
  position absolute
  width 100%
  height 100px
  background rgba(0, 0, 0, 0.3)
.footer
  width 100%
  position fixed
  bottom  0 
  left 0
  background rgba(0, 0, 0, 0.3)
  display flex
  justify-content space-around
  line-height 44px
  color #fff 
  font-size 16px
  text-align center
  border-top 1px solid #aaa
  span 
    flex-grow 1
  .span2
    border-left 1px solid #aaa
    border-right 1px solid #aaa
</style>