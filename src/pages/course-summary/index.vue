<template>
  <div class="preport-page">
    <div class="title-circle">
      课 堂<br>总 结
    </div>
    <div class="container">
      <img mode="widthFix" class="layout-bg" src="https://i.loli.net/2018/09/27/5bac9b7f6bc98.png">
      <div style="background: transparent;height: 40px;"></div>
      <div style="background: #fff;height: auto;border-radius: 0 0 8px 8px;padding-bottom: 53px;">
        <h5 class="stu-name">小林</h5>
        <h5 class="session-txt">篮球体验课</h5>
        <h5 class="content-title">
          <img src="/static/img/vipcard-title.png">
          <span>课堂总结</span>
        </h5>
        <div class="summary-content">
          <div class="summary-content-copy">
            本堂课niky表现非常好。大部分 动作非常到位，而且很活泼。本堂课niky表现非常好。大部分 动作非常到位，而且很活泼。
            本堂课niky表现非常好。大部分 动作非常到位，而且很活泼。本堂课niky表现非常好。大部分 动作非常到位，而且很活泼。
            <h5 class="signature">
              <span>leoooo</span><br>
              <span>2018.09.05</span>
            </h5>
          </div>
        </div>
      </div>
    </div>
    <div class="container2">
      <h5 class="content-title">
        <img src="/static/img/vipcard-title.png">
        <span>课后作业</span>
      </h5>
      <div class="task-item">
        <span class="dot"></span>
        复习本堂课所教内容，并在家长面前演示（家长最好一起参与）
      </div>
      <div class="task-item">
        <span class="dot"></span>
        与家长配合完成多次传球，此书无上限，与小伙伴比比谁连续成功传球的次数量最多。
      </div>
      <div class="task-item">
        <span class="dot"></span>
        记得完成Athlete*Now卡片上的小任务噢～
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
  .stu-name
    color #4a4a4a
    font-size 18px
    text-align center 
    margin-top 6px
    position relative
  .session-txt
    width 138px
    height 40px
    background #706079
    margin 6px auto 0
    color #fff 
    font-size 16px
    text-align center
    line-height 40px
    border-radius 4px
    position relative
    z-index 9
  .summary-content
    width 274px
    margin 36px auto 0
    background #dddae0
    border 1px solid #3D3542
    height auto 
  .summary-content-copy
    width 274px
    border 1px dashed #3D3542
    padding 27px 28px 100px
    color #4a4a4a
    font-size 14px
    transform translateX(-12px) translateY(12px)
    position relative
    background #fff
  .signature
    position absolute
    width 100%
    padding-right 30px
    text-align right
    bottom 37px
    right 0
    color #4a4a4a
    font-size 14px
.container2
  padding-bottom 40px
  background #fff
  border-radius 8px
  margin-top 16px
  .content-title
    height 25px
    line-height 25px
    padding 26px 0 0 30px
    margin-bottom 9px
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
  .task-item
    padding 16px 50px 0 74px
    color #4a4a4a
    font-size 14px
    position relative
    .dot
      display inline-block
      width 8px
      height 8px
      border-radius 4px
      background #EE825D
      position absolute
      left 50px
      top 23px
</style>
