<template>
  <div class="container">
  <scroll-view scroll-y class="left-wrapper" id="left">
    <div
      class="left-item"
      v-for="(item, index) in menuList"
      :key="index"
      @click="tabMenu(index)"
      :class="{'active': index === activeIndex}" >
      {{item}}
    </div>
    <!--这里是左侧的类型选择-->
  </scroll-view>
  
  <scroll-view
    class="right-wrapper"
    scroll-y
    :scroll-into-view="currentId"
    @scroll="scrolling"
    id="right">
    <div class="con-lists" v-for="(item, index) in menuList" :key="index" :id="'list-item' + index">
      <div class="list-title">
        {{item}}
      </div>
      <div class="list-content">
        <div>
          这里是需要展示具体的列表项<br>
          这里是需要展示具体的列表项<br>
          这里是需要展示具体的列表项<br>
          <!-- <img style="width: 100%;" mode="widthFix" :src="baseURL + '/static/img/full1.jpg'"> -->
        </div>
      </div>
    </div>
  </scroll-view>
  </div>
</template>

<script>
// Use Vuex
// import IO from '@/../static/weapp.socket.io.js'
import store from '@/store'
export default {
  data () {
    return {
      menuList: ['分类一', '分类二', '分类三', '分类四', '分类五', '分类六'],
      activeIndex: 0,
      currentId: '',
      currentTop: 0,
      mark: 1
    }
  },
  computed: {
    count () {
      return store.state.count
    },
    baseURL () {
      return this.baseURL
    }
  },
  onLoad () {
    // const socket = IO('http://localhost:7003')
    // socket.on('systeminfo', function (data) {
    //   console.log(data)
    //   socket.emit('custominfo', 'this is data from weapp client')
    // })
    // this.req({
    //   url: '/api/admin',
    //   success (res) {
    //     console.log(res)
    //   }
    // })
  },
  onShow () {
    wx.downloadFile({
      url: 'http://localhost:7003/static/img/full1.jpg',
      success (res) {
        console.log(res)
      }
    })
  },
  methods: {
    sendSocketMessage (msg) {
    },
    uploadFiles () {
      wx.chooseImage({
        success (res) {
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          wx.uploadFile({
            url: 'http://localhost:7003/api/v1', // 上传的接口
            filePath: tempFilePaths[0],
            name: 'uploadfile', // 上传的后端可接受字段，不能随意更改
            success (res) {
              console.log(res) // res.code被微信转为了string
            }
          })
        }
      })
    },
    tabMenu (index) {
      this.activeIndex = index
      this.currentId = 'list-item' + index
      this.uploadFiles()
    },
    scrolling (e) {
      if (this.mark) {
        this.mark = 0
        setTimeout(() => {
          this.getAllRects('.con-lists')
          this.mark = 1
        }, 300)
      }
    },
    getRect (id) {
      wx.createSelectorQuery().select(id).boundingClientRect(function (rect) {
        // console.log(rect)
      }).exec()
    },
    getAllRects (selector) {
      let vm = this
      wx.createSelectorQuery().selectAll(selector).boundingClientRect(function (rects) {
        rects.forEach((rect, index) => {
          if (rect.top < -40 && rects[index + 1].top > 0) {
            vm.activeIndex = index + 1
          }
        })
        if (rects[0].top >= 0) {
          vm.activeIndex = 0
        }
        vm.currentId = ''
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
*
  box-sizing border-box
.container
  display flex 
  .left-wrapper
    width 25%
    background #fff
    height 100vh
    box-shadow 1px 0 4px #ccc
    overflow hidden
    box-sizing border-box
    border-right 1px solid #eee
    .left-item
      background #eee
      height 60px
      font-weight 300
      color #555
      line-height 60px
      text-align center
      margin 5px
      border-radius 6px
    .active
      background #fff
  .right-wrapper
    width 75%
    background #eee
    height 100vh
    background #fff
    .list-title
      position relative
      background #32BEBC
      width 100%
      height 40px
      line-height 40px
      text-align center 
      font-weight 300
      font-size 18px
      color #fff
    .list-content
      padding 10px
      font-size 14px
      color #626262

</style>
