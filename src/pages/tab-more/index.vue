<template>
  <div class="container">
    <div class="weui-cells weui-cells_after-title">
      <!-- <navigator url="/pages/component-page/slide-list/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">滑动列表</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/component-page/img-cut/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">图片裁剪</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/component-page/toggle-panel/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">折叠面板</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator> -->
      <navigator url="/pages/component-page/slide-left/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">左滑删除</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/socket-page/socket-connect/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">一站到底</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/socket-page/socket-invite/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">专注训练</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator url="/pages/socket-page/socket-connect/main?room=room_001" class="weui-cell weui-cell_access" hover-class="weui-cell_active" hover-stay-time="300">
        <div class="weui-cell__bd">测试入口</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
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
      resPanelShow: false
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
                  url: `/pages/socket-page/socket-connect/main?room=${options.room}`
                })
              })
            } else {
              wx.navigateTo({
                url: `/pages/socket-page/socket-connect/main?room=${options.room}`
              })
            }
          }
        }
      })
    }
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

        // socket.on('system_info', (msg) => {
        //   console.log('received system news: ', msg)
        // })
        // socket.on('broadcast', () => {
        //   console.log('broadcast')
        // })
        // socket.on('broadcast2', () => {
        //   console.log('broadcast2')
        // })
        // socket.on('private_msg', (from, to, msg) => {
        //   console.log(from, to, msg)
        // })
        // socket.emit('custom_info', {
        //   title: 'this is a news from custom'
        // })
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
.weui-cells
  margin-top 20px
.video
  width 100%
</style>