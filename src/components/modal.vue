<!--  -->
<template>
  <div class="panel">
    <div @click="$emit('update:show', false)" class="mask" :class="{'show1': show}"></div>
    <div 
    class="panel-con"
    :style="panelStyle" 
    :class="{'show2': show}">
      <div class="panel-header">
        
      </div>
      <div class="btn-con-box">
        <span @click="$emit('update:show', false)" class="cancel-btn">取消</span>
        <span @click="$emit('update:show', false)" class="imok-btn">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    height: {
      type: Number,
      default: 70
    }
  },
  data () {
    return {
    }
  },
  computed: {
    panelStyle () {
      return `height: ${this.height}vh;`
    }
  }
}
</script>
<style lang='stylus'>
.panel
  width 100vw
  height 0
  position fixed
  left 0
  bottom 0
  z-index 99
  .mask 
    width 100vw
    height 100vh
    position absolute
    left 0
    bottom 0
    background rgba(0,0,0,0.5)
    display none
  .panel-con
    width 100vw
    background #fff 
    border-radius 20px 20px 0 0
    position absolute  
    transition all 0.6s ease-out
    transform translateY(200px)
    opacity 0
    left 0
    bottom 0
    text-align center

    .btn-con-box
      height 40px
      width 100%
      position absolute
      left 0
      bottom 0
      text-align center
      .cancel-btn
        display inline-block
        width 120px 
        height 32px
        background orange 
        border-radius 16px 0 0 16px
        line-height 32px
        color #fff
        font-size 16px
        font-weight 300
      .imok-btn
        display inline-block
        width 120px 
        height 32px
        background #f00 
        border-radius 0 16px 16px 0
        line-height 32px
        color #fff
        font-size 16px
        font-weight 300
  .show1
    display block
  .show2
    transform translateY(0)
    opacity 1
</style>