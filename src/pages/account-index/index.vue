<template>
  <div class="container">
    <div hover-class="hover-class" @click="toAccountPanel" class="account-btn">
      <img src="/static/svg/account-add.svg">
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
    baseURL () {
      return this.baseURL
    }
  },
  onLoad () {
    let vm = this
    wx.checkSession({
      success (res) {
        if (wx.getStorageSync('sessionID')) {
          console.log('onLaunch session_key、sessionID有效', res)
          vm.store.commit('shiftNeedLogin', {msg: '触发shiftLogin为false'})
        } else {
          console.log('sessionID失效', res)
          wx.switchTab({
            url: '/pages/account-center/main'
          })
        }
      },
      fail (res) {
        console.log('onLaunch session_key失效', res)
        wx.switchTab({
          url: '/pages/account-center/main'
        })
      }
    })
  },
  onShow () {
  },
  onHide () {
  },
  methods: {
    toAccountPanel () {
      wx.navigateTo({
        url: '/pages/account-panel/main'
      })
    }
  }
}
</script>

<style lang="stylus">
.account-btn
  width 50px
  height 50px
  border-radius 50%
  background #0c0
  position fixed
  bottom 10px
  left 50%
  transform translateX(-50%)
  box-shadow 0 0 4px #ddd
  img 
    width 50%
    height 50%
    margin 25%
.swiper-content
  width 100vw
  height 100vh
  position fixed
.swiper-item
  width 100%
  height 100%
  img
    width 100%
    height 100%
    // position absolute
    
.video
  width 100vw
  height 100vh
  position fixed
  left 0
  top 0
  transform translateX(0)
  &.video-hide
    transform translateX(-100%)
.cover-video
  width 100vw
  height 100vh
  position fixed
  left 0
  top 0
  background rgba(255, 255, 255, 0)
  .play-btn
    width 50px
    height 50px
    position absolute
    left 50%
    top 50%
    border-radius 50%
    transform translateX(-50%) translateY(-50%)
    background rgba(0, 0, 0, 0.5)
    color #0c0
    text-align center
    font-size 14px
    line-height 50px
</style>
