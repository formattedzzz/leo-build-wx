<template>
  <div class="container">
    <div class="project-content">
      <div class="content-l">
        <a href="/pages/socket-page/socket-connect/main?project=question">
        <img class="banner" mode="widthFix" src="https://i.loli.net/2019/01/08/5c34256add050.png">
        <span class="content-name-banner">一站到底</span> 
        </a>
      </div>
      <div class="content-r">
        <div class="content-rt background-2">
          <a href="/pages/socket-page/socket-connect/main?project=concentrate">
          <span class="content-name">专注训练</span>
          </a>
        </div>
        <div class="content-rb background-3">
          <a href="/pages/component-page/slide-left/main">
          <span class="content-name">slider</span>
          </a>
          </div>
      </div>
    </div>
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
                wx.navigateTo({
                  url: `/pages/socket-page/socket-connect/main?room=${options.room}&project=${options.project}`
                })
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
      this.eventBus.$emit('socket_emiton', socket)
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
        this.matching = false
      })
      socket.on('disconnect', () => {
        wx.setTabBarBadge({
          index: 2,
          text: '0'
        })
        console.log('断开连接')
        this.matching = false
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
  
</style>