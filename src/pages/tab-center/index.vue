<template>
<div class="tab-home">
  <!-- <img mode="widthFix" class="page-bg" src="/static/img/account-center-bg.png"> -->
  <div class="banner-con background-cube"></div>
  <div style="height: 16vh;"></div>
  <div class="userinfo">
    <div class="user-avatar"><img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl"></div>
    <h5 class="user-nickname"><span >Hi， {{userInfo.nickName}}！</span></h5>
  </div>
  <div class="other-info" @click="toQarecord">我的对战记录</div>
  <div class="other-info" @click="toAlbum">我的相册</div>
  <div class="other-info" @click="toWelcome">welcome</div>
  <div class="other-info" @click="toTest">puppeteer</div>
  <div class="other-info" @click="toEvent('leo')">test</div>
  <div class="other-info" @click="toEvent('sss')">test</div>
  <login-modal></login-modal>
</div>
</template>

<script>
  import loginModal from '@/components/loginModal'
  export default {
    data () {
      return {
        userInfo: {}
      }
    },
    computed: {
    },
    onLoad () {
      this.userInfo = wx.getStorageSync('userInfo')
      this.eventBus.$on('updateUserInfo', () => {
        this.userInfo = wx.getStorageSync('userInfo')
      })
      this.eventBus.$emit('test', 'emit before on')
    },
    onShow () {
    },
    methods: {
      toQarecord () {
        wx.navigateTo({
          url: '/pages/account-record/main'
        })
      },
      toSuite () {
        wx.navigateTo({
          url: '/pages/socket-page/socket-shulte/main'
        })
      },
      toAlbum () {
        wx.navigateTo({
          url: '/pages/sub-album/main'
        })
      },
      toWelcome () {
        wx.navigateTo({
          url: '/pages/sub-welcome/main'
        })
      },
      toTest () {
        wx.navigateTo({
          url: '/pages/sub-pupteer/main'
        })
      },
      toEvent (id) {
        wx.navigateTo({
          url: '/pages/sub-test/main?from=' + id
        })
      }
    },
    components: {
      loginModal
    }
  }
</script>

<style lang="stylus">
.tab-home
  height 100vh
  overflow hidden
  background #eee
.banner-con
  width 100%
  height 28vh
  position absolute
  left 0 
  top 0
.userinfo
  margin 10px
  height 120px
  background #fff
  position relative 
  display flex
  padding 0 20px
  justify-content flex-start
  align-items center
  .user-avatar
    width 64px
    height 64px
    border-radius 50%
    margin-right 30px
    overflow hidden
    img
      width 100%
      height 100%
  .user-nickname
    font-size 20px
    font-weight 600
    color #555
.other-info
  margin 4px 10px
  background #fff
  padding 10px
  font-size 16px
  color #4a4a4a
</style>