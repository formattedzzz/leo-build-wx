<template>
  <div class='page'>
  <movable-area class="move-area">
    <movable-view
      class="move-view"
      :x="x"
      y="0"
      :out-of-bounds="true"
      damping="40"
      @change="moveChange"
      @touchend="touchEnd"
      @click="closeSlide"
      :style="moveViewWdith"
      direction="horizontal">
      <div class="formal-content">
        <div class="con-l"><img :src="img"></div>
        <div class="con-m">
          <h5 class="con-mt">{{title}}</h5>
          <h5 class="con-mb">{{desc}}</h5>
        </div>
        <div class="con-r">
          <h5 class="con-rt">{{info}}</h5>
          <img v-if="icon" class="con-rb" :src="icon">
        </div>
      </div>
      <div
        v-for="(item, index) in renderItems" 
        :style="item.style"
        :key="index"
        @click="handleAction(item)"
        class="slide-btn">{{item.text}}</div>
    </movable-view>
  </movable-area>
  </div>
</template>

<script>
  let defaultOptions = [
    {
      text: '删除',
      background: '#ff0000',
      width: 64
    },
    {
      text: '操作',
      background: '#cccccc',
      width: 64
    }
  ]
  export default {
    props: {
      img: {
        type: String,
        default: 'https://i.loli.net/2018/12/16/5c163b8a8e299.png'
      },
      title: {
        type: String,
        default: 'Jack Ma'
      },
      desc: {
        type: String,
        default: '今天董事会别迟到了'
      },
      info: {
        type: String,
        default: '上午 11:00'
      },
      icon: {
        type: String,
        default: ''
      },
      items: {
        type: Object,
        default: function () {
          return defaultOptions
        }
      },
      index: {
        type: [String, Number],
        default: 0
      },
      dist: {
        type: Number,
        default: 30
      },
      height: {
        type: Number,
        default: 64
      }
    },
    data () {
      return {
        x: 0,
        items: this.items,
        dist: this.dist,
        height: this.height,
        index: this.index
      }
    },
    computed: {
      renderItems () {
        let {items} = this
        return items.map((item, index) => {
          let right = index === 0 ? 0 : Number(items[0].width) * 2
          return Object.assign({}, item, {
            style: `width: ${Number(item.width) * 2}rpx;background: ${item.background};right: ${right}rpx`
          })
        })
      },
      moveViewWdith () {
        let {items} = this
        let width = 0
        items.forEach((item) => {
          width += item.width
        })
        return `width: ${750 + width * 2}rpx;`
      }
    },
    onLoad () {
      const {windowWidth} = wx.getSystemInfoSync()
      this.widthFixRate = windowWidth / 375
      let {items, dist} = this
      if (items.length > 2) {
        this.items.splice(0, 2)
      }
      if (dist > 40 || dist < 20) {
        this.dist = 30
      }
      items.forEach((item, index) => {
        if (typeof item !== 'object') {
          this.items[index] = {
            text: item,
            background: ['#ff0000', '#cccccc'][index],
            width: 64
          }
        } else {
          if (!item.width || item.width > 80 || item.width < 50) {
            item.width = 64
          }
          if (!item.background) {
            item.background = ['#ff0000', '#cccccc'][index]
          }
        }
      })
    },
    methods: {
      moveChange (e) {
        // console.log('change', e.target.x)
        this.lastX = e.target.x
      },
      touchEnd (e) {
        // console.log('end', this.lastX)
        let {dist, items} = this
        let totalWidth = 0
        items.forEach((item) => {
          totalWidth += item.width
        })
        this.x = this.lastX
        if (this.lastX < -dist) {
          this.x = -(totalWidth * this.widthFixRate)
        } else {
          this.x = 0
        }
      },
      closeSlide () {
        this.x = 0
      },
      handleAction (item) {
        this.$emit('handle', {
          index: this.index,
          text: item.text
        })
      }
    }
  }
</script>

<style lang="stylus">
.page
  width 100%
div, h5
  box-sizing border-box
.move-area
  width 375px
  height 64px
  background #ccc
  overflow hidden
  border-bottom 1rpx solid #ccc
.move-view
  height 64px
  background #fff
  position relative
  .slide-btn
    height 64px
    position absolute
    top 0
    line-height 64px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    text-align center
    font-size 16px
    color #fff
  .formal-content
    width 375px
    height 64px
    box-sizing border-box
    padding 8px
    display flex
    justify-content space-between
    .con-l
      width 50px
      height 100%
      img 
        width 100%
        height 100%
        flex-shrink 0
    .con-m
      flex-grow 1
      flex-shrink 1
      padding-left 10px
      max-width 236px
      .con-mt 
        width 100% 
        font-size 16px
        color #222
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
      .con-mb
        width 100% 
        font-size 14px
        color #777
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
    .con-r
      width 72px
      flex-shrink 0
      text-align right
      .con-rt
        font-size 12px
        color #9b9b9b
        padding-bottom 4px
      .con-rb
        width 14px
        height 14px
</style>
