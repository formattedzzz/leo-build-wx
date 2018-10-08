<template>
  <div class="preport-page">
    <div class="title-circle">
      课 前<br>预 告
    </div>
    <div class="container">
      <img mode="widthFix" class="layout-bg" src="https://i.loli.net/2018/09/27/5bac9b7f6bc98.png">
      <div style="background: transparent;height: 80rpx;"></div>
      <div style="background: #fff;height: auto;border-radius: 0 0 16rpx 16rpx;">
        <h5 class="session-txt">篮球课程第一节</h5>
        <h5 class="content-title">
          <img src="/static/img/vipcard-title.png">
          <span>教学目标</span>
        </h5>
        <div class="tech-aim">
          <span class="aim-item" style="color: #EE825D;"><span class="dot" style="background: #EE825D;"></span><span>敏捷性训练</span></span>
          <span class="aim-item" style="color: #59BFCC;"><span class="dot" style="background: #59BFCC;"></span><span>反应力训练</span></span><br>
          <span class="aim-item" style="color: #F4BD03;"><span class="dot" style="background: #F4BD03;"></span><span>踢橄榄球</span></span>
          <span class="aim-item" style="color: #7FBA50;"><span class="dot" style="background: #7FBA50;"></span><span>运动基本姿势</span></span>
        </div>
        <h5 class="content-title">
          <img src="/static/img/vipcard-title.png">
          <span>教学重点</span>
        </h5>
        <div class="tech-key">
          <div class="key-item">
            <div class="item-t">
              <span class="item-t1">01</span>
              <span class="item-t2">运动基本姿势调整</span>
            </div>
            <div class="item-b">
              大部分运动过程中重心降低（*臀部位置降低）下背部绷直从而避免损伤。
            </div>
          </div>
          <div class="key-item">
            <div class="item-t">
              <span class="item-t1">02</span>
              <span class="item-t2">运动基本姿势调整</span>
            </div>
            <div class="item-b">
              加强肢体协调能力，加快步频而非步距来提升变向能力。箭步跨越时，重心放到前跨腿上。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
  },
  onLoad () {
  },
  methods: {
  }
}
</script>

<style lang="stylus">
div
  box-sizing border-box
// 全局样式
.preport-page
  width 100%
  min-height 100vh
  background #3D3542
  padding 90px 12px 30px 12px 
  position relative
.title-circle
  width 78px
  height 78px
  border-radius 50%
  position absolute
  left 50%
  transform translateX(-51%)
  top 40px
  color #3D3542
  padding-top 10px
  line-height 28px
  font-size 20px
  font-weight 600
  text-align center
  background #fff
.container
  width 100%
  position relative
  overflow hidden
  .layout-bg
    width 100%
    position absolute
    left 0
    top 0
  .session-txt
    width 138px
    height 40px
    background #706079
    margin 15px auto 0
    color #fff 
    font-size 16px
    text-align center
    line-height 40px
    border-radius 4px
    position relative
    z-index 9
  .content-title
    margin-top 35px
    height 25px
    line-height 25px
    padding-left 45px
    img
      position relative
      width 20px
      height 20px
      margin-right 15px
      top 4px
    span 
      color #4a4a4a
      font-size 18px
      font-weight 600
  .tech-aim
    width 100%
    margin-top 28px
    padding-left 60px
    line-height 30px
    font-size 14px
    .aim-item
      width 135px
      display inline-block
    .dot
      width 8px
      height 8px
      border-radius 4px
      display inline-block
      margin-right 16px
  .tech-key
    padding 4px 0 40px 42px
    .key-item
      margin-top 20px
    .item-t1
      display inline-block
      width 30px
      height 28px
      line-height 28px
      border-radius 4px
      background #84C44E
      color #fff 
      font-size 18px
      margin-right 11px
      text-align center
    .item-t2
      display inline-block
      width 153px
      height 28px
      line-height 28px
      border-radius 4px
      background #84C44E
      color #fff 
      text-align center
      font-size 14px
    .item-b
      padding 0 40px
      padding-top 18px
      color #626262
      font-size 12px 
</style>
