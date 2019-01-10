<template>
  <div class="suite-page">
    <button size="mini" @click="size = 3">3</button>
    <button size="mini" @click="size = 4">4</button>
    <button size="mini" @click="size = 5">5</button>
    <div class="cell-con" 
    :class="{'cell-con3x': size === 3,'cell-con4x': size === 4,'cell-con5x': size === 5}">
      <div 
      class="cell"
      v-for="(cell, index) in cellArr"
      :key="index"
      hover-class="hover-cell"
      :hover-start-time="0"
      :hover-stay-time="0">{{index + 1}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        roomMembers: [],
        size: 4
      }
    },
    computed: {
      cellArr () {
        return new Array(this.size * this.size).fill(1)
      }
    },
    onLoad () {
    },
    methods: {
    }
  }
</script>

<style lang="stylus">
page
  background #555
.hover-cell
  opacity 0.5
.cell-con
  position fixed
  left 0
  top 50%
  transform translateY(-50%)
  width 100%
  height 100vw
  display flex
  justify-content flex-start
  align-items center
  flex-wrap wrap
.cell-con3x
  .cell
    width 125px
    height @width
    background #45B64A
    font-size 36px
    line-height 125px
    text-align center
    color #fff
    border-right 1rpx solid #fff
    border-bottom 1rpx solid #fff
    &:nth-child(3n)
      border-right none
    &:nth-child(n+7)
      border-bottom none
.cell-con4x
  .cell
    width 25%
    height @width
    background #45B64A
    font-size 32px
    line-height 94px
    text-align center
    color #fff
    border-right 1rpx solid #fff
    border-bottom 1rpx solid #fff
    &:nth-child(4n)
      border-right none
    &:nth-child(n+13)
      border-bottom none
.cell-con5x
  .cell
    width 20%
    height @width
    background #45B64A
    font-size 28px
    line-height 75px
    text-align center
    color #fff
    border-right 1rpx solid #fff
    border-bottom 1rpx solid #fff
    &:nth-child(5n)
      border-right none
    &:nth-child(n+21)
      border-bottom none
</style>
