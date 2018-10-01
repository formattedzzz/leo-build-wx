<template>
<div class="login-page">
  <img mode="widthFix" class="page-bg" src="/static/img/account-center-bg.png">
  <div class="userinfo">
    <div class="userinfo-t">
      <img class="user-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl">
      <h5 v-if="userInfo.nickName" class="user-nickname"><span >Hi, {{userInfo.nickName}}</span></h5>
      <h5 v-else><span class="login-btn">授权登录</span></h5>
    </div>
    <div class="userinfo-b"></div>
  </div>
  <div class="btn-panel">
    <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo" type="primary">获取用户信息授权登录</button>
    <button open-type="openSetting" style="margin-top: 20px;">打开授权设置页</button>
    
  </div>
  <div style="color: #fff;text-align: center;position: relative;">{{userInfostr}}</div>
</div>
</template>

<script>
  export default {
    data () {
      return {
        userInfo: {},
        userInfostr: ''
      }
    },
    onLoad () {
      this.userInfo = wx.getStorageSync('userInfo')
      this.req({
        url: '/api/admin',
        success: (res) => {
          this.userInfostr = JSON.stringify(res.data)
        }
      })
    },
    onShareAppMessage () {
    },
    methods: {
      onGotUserInfo (e) {
        let vm = this
        console.log(e)
        if (e.target.errMsg === 'getUserInfo:fail auth deny') return
        this.userInfo = e.target.userInfo
        wx.setStorageSync('userInfo', e.target.userInfo)
        let { encryptedData, iv, signature } = e.target
        wx.login({
          success: (res) => {
            vm.req({
              url: '/wx/login',
              data: {
                code: res.code,
                encryptedData,
                iv,
                signature
              },
              menthod: 'GET',
              success (response) {
                let data = response.data
                if (data.code) {
                  wx.setStorageSync('sessionID', data.sessionID)
                  wx.showToast({
                    title: data.message
                  })
                }
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
.page-bg
  width 100vw
  position absolute
  left 0
  top 0
  z-index 0
.userinfo
  margin 20px
  height 200px
  background rgba(0, 0, 0, 0.5)
  border-radius 8px
  position relative
  .userinfo-t
    text-align center
    .user-avatar
      width 64px
      height 64px
      margin 30px
      border-radius 50%
    .user-nickname
      font-size 20px
      font-weight 300
      color #fff
    .login-btn
      margin-top 70px
      display inline-block
      background #45B64A
      width 100px
      height 30px
      border-radius 15px
      font-size 16px
      color #fff 
      line-height 30px
      text-align center
.btn-panel
  margin 20px 0
  width 100%
  padding 20px
</style>