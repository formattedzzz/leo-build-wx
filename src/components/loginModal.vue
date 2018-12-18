<template>
  <div class="login-page background-cube" :class="{'login-page-show': show}">
    <button class="login-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">授权登录</button>
  </div>
</template>

<script>
  export default {
    props: {
      // show: {
      //   type: Boolean,
      //   default: false
      // }
    },
    data () {
      return {
        logining: false,
        show: false,
        onlyAuth: false
      }
    },
    computed: {
    },
    onLoad () {
      console.log('loginmodal onload')
      if (!wx.getStorageSync('token')) {
        console.log('缓存无token，需要登录')
        // this.$emit('update:show', true)
        this.show = true
      } else {
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userInfo']) {
              wx.showToast({
                title: '检测到你还未授权本小小程序',
                icon: 'none'
              })
              console.log('检测到你还未授权本小小程序')
              this.show = true
              this.onlyAuth = true
            }
          }
        })
      }
      this.eventBus.$on('revokeLogin', (data) => {
        console.log(data)
        this.show = true
      })
      this.eventBus.$on('hideLogin', (data) => {
        console.log('other page has logined')
        this.show = false
      })
      // wx.checkSession({
      //   success (res) {
      //     if (wx.getStorageSync('sessionID')) {
      //       console.log('onLaunch session_key、sessionID有效', res)
      //       vm.store.commit('shiftNeedLogin', {msg: '触发shiftLogin为false'})
      //     } else {
      //       console.log('sessionID失效', res)
      //       wx.switchTab({
      //         url: '/pages/account-center/main'
      //       })
      //     }
      //   },
      //   fail (res) {
      //     console.log('onLaunch session_key失效', res)
      //     wx.switchTab({
      //       url: '/pages/account-center/main'
      //     })
      //   }
      // })
    },
    methods: {
      onGotUserInfo (e) {
        if (this.logining === true) {
          return
        }
        if (e.target.errMsg === 'getUserInfo:fail auth deny') {
          wx.showToast({
            title: '未授权 继续点',
            icon: 'none'
          })
          return
        } else {
          if (this.onlyAuth === true) {
            this.onlyAuth = false
            this.show = false
            this.eventBus.$emit('hideLogin', true)
            return
          }
        }
        wx.showLoading({
          title: '登录ing..'
        })
        wx.setStorageSync('userInfo', e.target.userInfo)
        this.eventBus.$emit('updateUserInfo', true)
        let { encryptedData, iv, signature } = e.target
        wx.login({
          success: (res) => {
            this.req({
              url: '/wx/login',
              data: {
                code: res.code,
                encryptedData,
                iv,
                signature
              },
              method: 'POST'
            }).then((res) => {
              let data = res.data
              if (data.code) {
                // this.store.commit('shiftNeedLogin', {msg: '触发shiftLogin为false'})
                wx.setStorageSync('token', data.token)
                wx.showToast({
                  title: data.message
                })
                this.eventBus.$emit('hideLogin', true)
                this.show = false
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
              wx.hideLoading()
              this.logining = false
            }).catch((err) => {
              wx.showToast({
                title: err,
                icon: 'none'
              })
              wx.hideLoading()
              this.logining = false
            })
          }
        })
      }
    },
    components: {

    }
  }
</script>

<style lang="stylus">
.login-page
  width 100vw
  height 100vh
  position fixed 
  left 0
  top 0
  z-index 99
  visibility hidden
  opacity 0
  transition 0.4s all ease-out
  &.login-page-show
    visibility visible
    opacity 1
  .login-btn
    width 160px
    height 48px
    line-height 48px
    border-radius 4px
    background #ee5500
    font-size 20px
    color #fff
    position absolute
    left 50%
    top 50% 
    transform translateX(-50%) translateY(-50%)
</style>

