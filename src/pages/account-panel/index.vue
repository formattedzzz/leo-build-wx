<template>
<div class="panel-page">
  <h5 class="type-title">支出</h5>
  <div class="type-list">
    <div class="type-item" v-for="(item, index) in outcomeList" :key="index" @click="pick(item)">
      <div class="img-con" :class="{'img-con-active': item.typeid === activeId}"><img :src="item.typeicon"></div>
      <span class="css1516558dbe1e46f">{{item.typedesc}}</span>
    </div>    
  </div>
  <h5 class="type-title">收入</h5>
  <div class="type-list" style="justify-content: flex-start;">
    <div class="type-item" v-for="(item, index) in incomeList" :key="index" @click="pick(item)">
      <div class="img-con" :class="{'img-con-active': item.typeid === activeId}"><img :src="item.typeicon"></div>
      <span class="css1516558dbe1e46f">{{item.typedesc}}</span>
    </div>    
  </div>
  <div class="calc-panel">
    <div class="panel-res">
      <span class="comment-txt">备注:</span>
      <input class="comment-val" placeholder="点击写备注..." type="text">
      <input class="fund-val" type="text">
    </div>
  </div>
</div>
</template>

<script>
  import {outcomeList, incomeList} from './typeList.js'
  export default {
    data () {
      return {
        outcomeList,
        incomeList,
        activeId: '',
        activeType: {},
        panelShow: false
      }
    },
    computed: {
      baseURL () {
        return this.baseURL
      }
    },
    onReady () {
    },
    methods: {
      pick (type) {
        this.activeId = type.typeid
        this.activeType = type
        console.log(type)
        if (!this.panelShow) {
          this.panelShow = true
        }
      }
    }
  }
</script>

<style lang="stylus">
svg 
  fill #ffffff
.panel-page
  min-height 100vh
.type-title
  font-weight 300
  font-size 20px
  color #444
  padding 16px 16px 16px 24px
.type-list
  padding 10px 0
  display flex
  justify-content space-around
  flex-wrap wrap
.type-item
  display inline-block
  width 25%
  height 90px
  text-align center    
  font-size 16px
  color #626262
  font-weight 300
  .img-con 
    margin  0 auto
    width 56px
    height 56px
    border-radius 50%
    overflow hidden
    background #f0f0f0
    padding 15px
    img
      width 100%
      height 100%
  .img-con-active
    background #ffff00
// 面板样式
.input-placeholder
  color #aaa
  font-size 12px
  font-weight 300
.calc-panel
  position absolute
  width 100%
  height 50px
  bottom 0
  left 0
.panel-res
  display flex
  height 40px
  justify-content space-between
  border-top 1rpx solid #aaa
  font-size 12px
  color #888
  font-weight 300
  line-height 40px
  .comment-txt
    width 40px
    flex-shrink 0
    background #eee
    text-align center
  .comment-val
    height 40px
    min-width 58%
    background #eee
    text-overflow ellipsis
    overflow hidden
    white-space nowrap
    border-right 1rpx solid #aaa
  .fund-val
    height 40px
    font-size 16px
    color #555
    font-weight 300
    background #eee
    min-width 86px
    text-align right
    padding-right 20px
</style>