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
    </div>
    <login-modal></login-modal>

  </div>
</template>

<script>
import loginModal from '@/components/loginModal'
// import IO from '@/../static/weapp.socket.io.js'
// let socket
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
                  url: `/pages/socket-page/socket-connect/main?inviter=${options.openid}`
                })
              })
            } else {
              wx.navigateTo({
                url: `/pages/socket-page/socket-connect/main?inviter=${options.openid}`
              })
            }
          }
        }
      })
    }
  },
  onShow () {
  },
  onHide () {
  },
  methods: {
    bounce () {
      wx.vibrateLong()
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