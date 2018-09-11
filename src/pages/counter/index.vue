<template>
  <div class="container">

    <!-- <div class="wrap">
      <h5 class="title">标题一</h5>
      <div class="content">
        1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>
      </div>
      <h5 class="title">标题二</h5>
      <div class="content">
        1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>
      </div>
      <h5 class="title">标题三</h5>
      <div class="content">
        1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>
      </div>
      <h5 class="title">标题四</h5>
      <div class="content">
        1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>1<br>
      </div>
    </div> -->
  <scroll-view scroll-y class="left-wrapper" id="left">
    <div
    class="left-item"
    v-for="(item, index) in leftMenu"
    :key="index"
    @click="tabMenu(index)"
    :class="{'active': index === activeIndex}" >
      模块{{item}}
    </div>
    <!--这里是左侧的类型选择-->
  </scroll-view>
  
  <scroll-view
    class="right-wrapper"
    scroll-y
    @scroll="scrolling"
    :scroll-into-view="conId"
    @scrolltolower="scrollend"
    scroll-top="30"
    id="right">
    <div class="con-lists" v-for="(item, index) in rightCon" :key="index" :id="'con' + item">
      <div style="background: orange;margin-top: 5px;" class="type-title">
        这里是第{{item}}个sticky-title
      </div>
      <div class="content">
        <div> 
          这里是需要展示具体的列表项<br>
          这里是需要展示具体的列表项<br>
          这里是需要展示具体的列表项<br>
          这里是需要展示具体的列表项<br>
          这里是需要展示具体的列表项<br>
          这里是需要展示具体的列表项<br>
        </div>
      </div>
    </div>
  </scroll-view>

  </div>
</template>

<script>
// Use Vuex
import store from '@/store'

export default {
  data () {
    return {
      leftMenu: [1, 2, 3, 4, 5, 6],
      activeIndex: 0,
      rightCon: [11, 22, 33, 44, 55, 66],
      conId: '',
      currentTop: 0
    }
  },
  computed: {
    count () {
      return store.state.count
    }
  },
  methods: {
    toView (e) {
      console.log(e)
    },
    tabMenu (index) {
      this.activeIndex = index
      this.conId = 'con' + (index + 1) + (index + 1)
    },
    scrolling (e) {
      console.log(e)
      // if (e.currentTarget.id === 'right') {
      //   // 判断滚动的方向
      //   let top = e.detail.scrollTop
      //   this.dir = this.currentTop < top ? 'down' : 'up'
      //   this.currentTop = top
      //   // 判断当前滚动条所在区域，如果不在当前区域则进行跳转
      //   if (top > this.scrollTops[this.getNextView()] &&
      //       this.dir === 'down' &&
      //       this.checked < this.types.length - 1) {
      //     this.setChecked(this.checked + 1)
      //   }
      //   if (top < this.scrollTops[this.toView] &&
      //       this.dir === 'up' &&
      //       this.checked > 0) {
      //     this.setChecked(this.checked - 1)
      //   }
      // }
    },
    scrollend (e) {
      console.log('scrollend')
      this.getRect('#con44')
    },
    getRect: function (id) {
      wx.createSelectorQuery().select(id).boundingClientRect(function (rect) {
        // console.log(rect)
      }).exec()
    },
    getAllRects: function (selector) {
      wx.createSelectorQuery().selectAll(selector).boundingClientRect(function (rects) {
        rects.forEach(function (rect) {
          // console.log(rects)
        })
      }).exec()
    },
    increment () {
      store.commit('increment')
    },
    decrement () {
      store.commit('decrement')
    }
  }
}
</script>

<style lang="stylus">
.title 
  background #ccc 
  position sticky
  height 40px
  top 0px
  z-index 9
.content
  position relative
  background #eee
.container
  display flex 
  .left-wrapper
    width 30%
    background #eee
    height 600px
    .left-item
      background #ccc
      margin-top 5px
    .active 
      background orange
  .right-wrapper
    width 70%
    background #eee
    height 600px
</style>
