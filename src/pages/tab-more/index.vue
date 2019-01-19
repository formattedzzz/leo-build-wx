<template>
  <div class="container">
    <div class="project-content">
      <div class="content-l">
        <a href="/pages/socket-page/socket-connect/main?project=concentrate">
        <img class="banner" mode="widthFix" src="https://i.loli.net/2019/01/08/5c34256add050.png">
        <span class="content-name-banner">专注训练</span> 
        </a>
      </div>
      <div class="content-r">
        <div class="content-rt background-2">
          <a href="/pages/socket-page/socket-connect/main?project=question">
          <span class="content-name">一站到底</span>
          </a>
        </div>
        <div class="content-rb background-3">
          <a href="/pages/component-page/slide-left/main">
          <span class="content-name">slider</span>
          </a>
          </div>
      </div>
    </div>
    <div class="gary-51 colorful-stripe">51° 灰</div>
    <div class="suite corner" @click="toShulte">小方格</div>
    <login-modal></login-modal>
  </div>
</template>

<script>
import loginModal from '@/components/loginModal'
import IO from '@/../static/weapp.socket.io.js'
let socket = {}
export default {
  data () {
    return {
    }
  },
  computed: {
    baseURL () {
      return this.baseURL
    }
  },
  onLoad (options) {
    if (options.from) {
      wx.showModal({
        title: '邀请提醒',
        content: `${options.from}邀请你挑战${options.project}`,
        confirmText: '接受',
        concelText: '拒绝',
        success: (res) => {
          if (res.confirm) {
            if (!wx.getStorageSync('token')) {
              wx.showModal({
                title: '提示',
                content: '请先授权登录',
                showCancel: false
              })
              this.eventBus.$on('hideLogin', () => {
                setTimeout(() => {
                  wx.navigateTo({
                    url: `/pages/socket-page/socket-connect/main?room=${options.room}&project=${options.project}`
                  })
                }, 200)
              })
            } else {
              wx.navigateTo({
                url: `/pages/socket-page/socket-connect/main?room=${options.room}&project=${options.project}`
              })
            }
          }
        }
      })
      
    }
    this.getopenid()
  },
  onShow () {
    if (wx.getStorageSync('token')) {
      this.connect()
    } else {
      this.eventBus.$on('hideLogin', () => {
        this.connect()
      })
    }
  },
  onHide () {
  },
  methods: {
    getopenid () {
      this.req({
        url: '/api/openid'
      }).then(({data}) => {
        let res = data
        if (res.code) {
          this.eventBus.$emit('attach_openid', res.openid)
        }
      })
    },
    connect () {
      if (socket.connected) return
      let token = wx.getStorageSync('token')
      let URL = `${this.baseURL}/user?token=${token}`
      socket = IO(URL)
      this.eventBus.$emit('attach_socket', socket)
      socket.on('connect', () => {
        wx.setTabBarBadge({
          index: 2,
          text: '1'
        })
        console.log('connected', socket.id)
        socket.on('beat_req', (msg) => { socket.emit('beat_res') }) // 发送心跳包
      })
      socket.on('error', () => {
        wx.showModal({
          title: '提示',
          content: '连接失败,可能是token出错了',
          showCancel: false
        })
      })
      socket.on('disconnect', (reason) => {
        wx.setTabBarBadge({
          index: 2,
          text: '0'
        })
        console.log(reason, '正在重连')
        socket.connect()
      })
    },
    toShulte () {
      wx.navigateTo({
        url: '/pages/socket-page/socket-shulte/main'
      })
    }
  },
  components: {
    loginModal
  }
}
</script>

<style lang="stylus">
.project-content
  width 100%
  padding 25px
  display flex
  justify-content space-between
  font-size 16px
  color #fff
  text-align center
  overflow hidden
  div
    border-radius 8px
  a 
    display inline-block
    width 100%
    height 100%
    position absolute
    left 0
    top 0
  .banner
    width 150px
    height 120px
  .content-name
    display inline-block
    position absolute
    left 50%
    top 50%
    transform translateX(-50%) translateY(-50%)
  .content-name-banner
    margin-top 12px
  .content-l
    width 150px
    position relative
    overflow hidden
    box-shadow 0 0 4px #ccc
    color #555
  .content-r
    width 150px
    .content-rt
      width 100%
      height 80px
      position relative
      overflow hidden
    .content-rb
      margin-top 25px
      width 100%
      height 80px
      position relative
      overflow hidden
.gary-51
  margin 0 auto 
  width 325px
  font-size 36px
  height 100px
  text-align center
  line-height 100px
  color #fff
  border-radius 8px
.suite
  margin 25px auto 
  width 325px
  font-size 36px
  height 90px
  text-align center
  line-height 90px
  color #fff
  border-radius 8px
  position relative
</style>